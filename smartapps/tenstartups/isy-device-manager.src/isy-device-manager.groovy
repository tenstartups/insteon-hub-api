/**
 *  ISY Device Manager
 *
 *  Copyright 2016 SmartThings
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
definition(
		name: "ISY Device Manager",
		namespace: "TenStartups",
		author: "Marc Lennox (marc.lennox@gmail.com)",
		description: "Integrate SmartThings with an ISY994i home automation controller in order to control and receive events from your Insteon Switches, Dimmers, Outlets and Fan Controllers.",
		category: "My Apps",
		iconUrl: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png",
		iconX2Url: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png",
		iconX3Url: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png")

preferences {
	page(name: "deviceDiscovery", title: "ISY994i Discovery", content: "deviceDiscovery")
}

mappings {
    path("/update") {
        action: [POST: "processUpdate"]
    }
}

def ssdpUSN() {
    return "urn:schemas-upnp-org:service:ISYDeviceManager:1"        
}

def deviceDiscovery() {
	def lightDevices = lightChoices()
	def dimmableLightDevices = dimmableLightChoices()
	def fanDevices = fanChoices()
	def sceneDevices = sceneChoices()

    ssdpSubscribe()
	ssdpDiscover()

 	return dynamicPage(name: "deviceDiscovery", title: "ISY Device Discovery Started...", nextPage: "", refreshInterval: 5, install: true, uninstall: true) {
		section("Please wait while we discover your ISY devices. Select your devices below once they have been discovered.") {
			input "selectedLights", "enum", required: false, title: "Select light devices (${lightDevices.size() ?: 0} found)", multiple: true, options: lightDevices
			input "selectedDimmableLights", "enum", required: false, title: "Select dimmable light devices (${dimmableLightDevices.size() ?: 0} found)", multiple: true, options: dimmableLightDevices
			input "selectedFans", "enum", required: false, title: "Select fan devices (${fanDevices.size() ?: 0} found)", multiple: true, options: fanDevices
			input "selectedScenes", "enum", required: false, title: "Select scene devices (${sceneDevices.size() ?: 0} found)", multiple: true, options: sceneDevices
		}
	}
}

def installed() {
	log.debug("Installed with settings: ${settings}")
	createAccessToken()
	initialize()
}

def updated() {
	log.debug("Updated with settings: ${settings}")
	unsubscribe()
	initialize()
}

def uninstalled() {
	revokeAccessToken()
}

def initialize() {
	unsubscribe()
	unschedule()
	ssdpSubscribe()
	createSelectedDevices()
    deleteUnselectedDevices()
	runEvery5Minutes("ssdpDiscover")
}

def selectedDevices() {
	def selected = []
    if (selectedLights) {
    	selected += selectedLights
	}
    if (selectedDimmableLights) {
    	selected += selectedDimmableLights
	}
    if (selectedFans) {
    	selected += selectedFans
	}
    if (selectedScenes) {
    	selected += selectedScenes
	}
    selected
}

def discoveredLightDevices() {
	if (!state.discoveredLightDevices) {
		state.discoveredLightDevices = [:]
	}
	state.discoveredLightDevices
}

def discoveredDimmableLightDevices() {
	if (!state.discoveredDimmableLightDevices) {
		state.discoveredDimmableLightDevices = [:]
	}
	state.discoveredDimmableLightDevices
}

def discoveredFanDevices() {
	if (!state.discoveredFanDevices) {
		state.discoveredFanDevices = [:]
	}
	state.discoveredFanDevices
}

def discoveredSceneDevices() {
	if (!state.discoveredSceneDevices) {
		state.discoveredSceneDevices = [:]
	}
	state.discoveredSceneDevices
}

Map lightChoices() {
	def map = [:]
    discoveredLightDevices().sort({ it.value.label }).each {
		map[it.value.dni] = it.value.label
	}
	map
}

Map dimmableLightChoices() {
	def map = [:]
    discoveredDimmableLightDevices().sort({ it.value.label }).each {
		map[it.value.dni] = it.value.label
	}
	map
}

Map fanChoices() {
	def map = [:]
    discoveredFanDevices().sort({ it.value.label }).each {
		map[it.value.dni] = it.value.label
	}
	map
}

Map sceneChoices() {
	def map = [:]
    discoveredSceneDevices().sort({ it.value.label }).each {
		map[it.value.dni] = it.value.label
	}
	map
}

void ssdpSubscribe() {
	subscribe(location, "ssdpTerm.${ssdpUSN()}", ssdpDiscoveryHandler)
}

void ssdpDiscover() {
	sendHubCommand(new physicalgraph.device.HubAction("lan discovery ${ssdpUSN()}", physicalgraph.device.Protocol.LAN))
}  

void ssdpDiscoveryHandler(event) {
    state.hubId = event?.hubId
	def parsedEvent = parseLanMessage(event?.description)
    String ipAddress = convertHexToIP(parsedEvent?.networkAddress)
    int ipPort = convertHexToInt(parsedEvent?.deviceAddress)
    sendHubCommand(
        new physicalgraph.device.HubAction(
            """GET ${parsedEvent.ssdpPath} HTTP/1.1\r\nHOST: ${ipAddress}:${ipPort}\r\n\r\n""",
            physicalgraph.device.Protocol.LAN,
            null,
            [callback: ssdpDescriptionHandler]
        )
    )
}

void ssdpDescriptionHandler(physicalgraph.device.HubResponse hubResponse) {
	log.debug("Received SSDP description response")

	def discoveredDevices = hubResponse.json?.device

	def discoveredLights = [:]
    def discoveredDimmableLights = [:]
    def discoveredFans = [:]
    def discoveredScenes = [:]

	discoveredDevices.each { device ->
        def deviceAttrs = [
        	hubId: state.hubId,
            dni: device.network_id,
            label: device.name,
            externalId: device.id,
            isyAddress: device.address,
            ipAddress: device.ip_address,
            ipPort: device.ip_port,
        ]
        switch (device.type) {
            case 'Light':
	            deviceAttrs << [name: 'ISY Light Device', handler: 'ISY Light']
    	        discoveredLights[device.network_id] = deviceAttrs
        	    break
            case 'DimmableLight':
                deviceAttrs << [name: 'ISY Dimmable Light Device', handler: 'ISY Dimmable Light']
                discoveredDimmableLights[device.network_id] = deviceAttrs
                break
            case 'Fan':
                deviceAttrs << [name: 'ISY Fan Device', handler: 'ISY Fan']
                discoveredFans[device.network_id] = deviceAttrs
                break
            case 'Scene':
                deviceAttrs << [name: 'ISY Scene Device', handler: 'ISY Scene']
                discoveredScenes[device.network_id] = deviceAttrs
                break
        }
        def childDevice = getChildDevice(deviceAttrs.dni)
        if (childDevice) {
			refreshChildDevice(childDevice, deviceAttrs)
 			updateChildDeviceToken(childDevice)
        }
	}
     
    // Reset state maps
    state.discoveredLightDevices = discoveredLights
    state.discoveredDimmableLightDevices = discoveredDimmableLights
    state.discoveredFanDevices = discoveredFans
    state.discoveredSceneDevices = discoveredScenes
 }

void refreshChildDevice(childDevice, deviceAttrs) {
	syncDeviceNameAndLabel(childDevice, deviceAttrs.name, deviceAttrs.label)
    syncDeviceDataValue(childDevice, "externalId", deviceAttrs.externalId)
    syncDeviceDataValue(childDevice, "ipAddress", deviceAttrs.ipAddress)
    syncDeviceDataValue(childDevice, "ipPort", deviceAttrs.ipPort)
}

void updateChildDeviceToken(childDevice) {
    sendHubCommand(
        new physicalgraph.device.HubAction(
            method: "POST",
            path: "/api/device/${childDevice.getDataValue("externalId")}/token/${state.accessToken}",
            headers: [HOST: "${childDevice.getDataValue("ipAddress")}:${childDevice.getDataValue("ipPort")}"]
        )
    )
}

void deleteChildDeviceToken(childDevice) {
    sendHubCommand(
        new physicalgraph.device.HubAction(
            method: "DELETE",
            path: "/api/device/${childDevice.getDataValue("externalId")}/token",
            headers: [HOST: "${childDevice.getDataValue("ipAddress")}:${childDevice.getDataValue("ipPort")}"]
        )
    )
}

def createSelectedDevices(devices) {
	def selectedDevices = selectedLights.collect { dni -> discoveredLightDevices()[dni] } +
                          selectedDimmableLights.collect { dni -> discoveredDimmableLightDevices()[dni] } +
                          selectedFans.collect { dni -> discoveredFanDevices()[dni] } +
                          selectedScenes.collect { dni -> discoveredSceneDevices()[dni] }

	selectedDevices.each { device ->
		def childDevice = getChildDevice(device.dni)
		if (!childDevice) {
            log.debug("Adding child device ${device.label}")
            childDevice = addChildDevice("TenStartups", device.handler, device.dni, device.hubId, [
                "name": device.name,
                "label": device.label,
                "data": [
                    "externalId": device.externalId,
                    "ipAddress": device.ipAddress,
                    "ipPort": device.ipPort,
                ],
                completedSetup: true
            ])
        }
        updateChildDeviceToken(childDevice)
	}
}

def deleteUnselectedDevices(devices) {
	(getChildDevices().collect { it.deviceNetworkId } - selectedDevices()).each { dni ->
		def childDevice = getChildDevice(dni)
		if (!childDevice) {
        	return
        }
	    log.debug("Removing child device ${childDevice.label}")
        deleteChildDevice(dni)
	}
}

def syncDeviceNameAndLabel(device, name, label) {
    if (name && device.name != name) {
        device.name = name
    }
    if (label && device.label != label) {
        device.label = label
    }
}

def syncDeviceDataValue(device, name, value) {
    if (value && device.getDataValue(name) != value) {
        device.setDataValue(name, value)
    }
}

def processUpdate() {
	if (!request.JSON?.device?.network_id) {
    	httpError(400, "Device network ID not provided")
    }
	log.debug("Received update ${request.JSON}")
	if (!request.JSON?.data) {
    	httpError(400, "Update data not provided")
    }
    def child = getChildDevice(request.JSON.device.network_id)
	if (!child) {
    	deleteChildDeviceToken()
    	httpError(404, "Device ${request.JSON.device.network_id} not found")
    }

	return child.processStatusUpdate(request.JSON.data)
}

private Integer convertHexToInt(hex) {
	Integer.parseInt(hex,16)
}

private String convertHexToIP(hex) {
	[convertHexToInt(hex[0..1]),convertHexToInt(hex[2..3]),convertHexToInt(hex[4..5]),convertHexToInt(hex[6..7])].join(".")
}