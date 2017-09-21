/**
 *  Insteon Service Manager
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
		name: "Insteon Device Manager",
		namespace: "TenStartups",
		author: "Marc Lennox (marc.lennox@gmail.com)",
		description: "Integrate the Insteon Hub (2245) with SmartThings in order to control and receive events from your Insteon Switches, Dimmers, Outlets and Fan Controllers.",
		category: "My Apps",
		iconUrl: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png",
		iconX2Url: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png",
		iconX3Url: "http://www.smarthome.com.au/media/extendware/ewimageopt/media/template/12/e/insteon-home-automation-system.png")

preferences {
	page(name: "deviceDiscovery", title: "Insteon Hub Discovery", content: "deviceDiscovery")
}

mappings {
    path("/update") {
        action: [POST: "processUpdate"]
    }
}

def getSearchTargets() {
    return ["urn:schemas-upnp-org:device:InsteonSwitch:1", "urn:schemas-upnp-org:device:InsteonDimmer:1", "urn:schemas-upnp-org:device:InsteonFan:1"]        
}

def deviceDiscovery() {
	def options = [:]
	def devices = getVerifiedDevices()

	devices.each {
		def key = it.value.networkId
		def value = it.value.name
		options[key] = value
	}

	ssdpSubscribe()
	ssdpDiscover()
	verifyDevices()

 	return dynamicPage(name: "deviceDiscovery", title: "Insteon Device Discovery Started...", nextPage: "", refreshInterval: 5, install: true, uninstall: true) {
		section("Please wait while we discover your Insteon Hub devices. Discovery of all your devices may take several minutes, so please be patient.  Select your devices below once they have been discovered.") {
			input "selectedDevices", "enum", required: false, title: "Select Devices (${options.size() ?: 0} found)", multiple: true, options: options
		}
	}
}

def installed() {
	log.debug "Installed with settings: ${settings}"
	createAccessToken()
	initialize()
}

def updated() {
	log.debug "Updated with settings: ${settings}"
	unsubscribe()
	initialize()
}

def uninstalled() {
}

def initialize() {
	unsubscribe()
	unschedule()
	ssdpSubscribe()
	revokeAccessToken()
    createAccessToken()
	addSelectedDevices()
    removeUnselectedDevices()
    sendAccessTokenToChildDevices()
	runEvery5Minutes("ssdpDiscover")
}

void ssdpSubscribe() {
	getSearchTargets().each { subscribe(location, "ssdpTerm.${it}", ssdpHandler) }
}

void ssdpDiscover() {
	getSearchTargets().each { udn -> sendHubCommand(new physicalgraph.device.HubAction("lan discovery ${udn}", physicalgraph.device.Protocol.LAN)) }
}  

def getDevices() {
	if (!state.devices) {
		state.devices = [:]
	}
	state.devices
}

def getVerifiedDevices() {
	getDevices().findAll { it.value.verified == true }
}

Map verifiedDevices() {
	log.debug("verifiedDevices")
	def devices = getVerifiedDevices()
	def map = [:]
	devices.each {
		def key = it.value.networkId
		def value = it.value.name
		map[key] = value
	}
	map
}

def ssdpHandler(event) {
	def parsedEvent = parseLanMessage(event?.description)
	def hub = event?.hubId
	def devices = getDevices()
	def ssdpUSN = parsedEvent?.ssdpUSN?.toString()
	parsedEvent << [
        "hub": hub,
        "lastHeardAboutAt": now()
    ]
    if (!devices[ssdpUSN]) {
    	devices[ssdpUSN] = [:]
    }
    devices[ssdpUSN] << parsedEvent
    
    //log.trace("Received SSDP event message ${deviceProperties}")
   
    def dni = ssdpUSN.split(':')[1] + ssdpUSN.split(':')[3] + ssdpUSN.split(':')[5]
    def child = getChildDevice(dni)
    if (child) {
        child.sync(parsedEvent.mac, parsedEvent.networkAddress, parsedEvent.deviceAddress)
    }
}

void verifyDevices() {
	def currentTime = now()
    if (state.lastVerificationTime == null || (currentTime - state.lastVerificationTime) > (24 * 60 * 60 * 1000)) {
    	log.debug("Resetting device verification")
    	getDevices().each { d -> d.value.verified = false }
    }
	def devices = getDevices().findAll { it.value.verified != true }
	devices.each {
		int port = convertHexToInt(it.value.deviceAddress)
		String ip = convertHexToIP(it.value.networkAddress)
		String host = "${ip}:${port}"
		sendHubCommand(
        	new physicalgraph.device.HubAction(
            	"""GET ${it.value.ssdpPath} HTTP/1.1\r\nHOST: ${host}\r\n\r\n""",
                physicalgraph.device.Protocol.LAN,
                host,
                [callback: deviceDescriptionHandler]
            )
        )
	}
	state.lastVerificationTime = currentTime
}

void deviceDescriptionHandler(physicalgraph.device.HubResponse hubResponse) {
	def deviceDescription = hubResponse.json.device
    //log.trace("Retrieved device description ${deviceDescription}")
	def devices = getDevices()
	def device = devices.find { it.key.contains(deviceDescription?.udn) }
	if (device) {
		device.value << [
            insteonId: deviceDescription?.insteon_id,
            type: deviceDescription?.type,
        	networkId: deviceDescription?.network_id,
            name: deviceDescription?.name,
            label: deviceDescription?.label,
            description: deviceDescription?.description,
            model: deviceDescription?.model,
            deviceHandler: deviceDescription?.device_handler,
            verified: true
        ]
	}
}

def addSelectedDevices() {
	if (!selectedDevices) {
    	return
    }
    
	def devices = getDevices()

	selectedDevices.each { dni ->
		def selectedDevice = devices.find { it.value.networkId == dni }
		def d
		if (selectedDevice) {
			d = getChildDevices()?.find {
				it.deviceNetworkId == dni
			}
		}

		if (!d) {
        	def deviceHandler
            if (selectedDevice?.value?.type == 'switch') {
            	deviceHandler = 'Insteon Switch'
            } else if (selectedDevice?.value?.type == 'dimmer') {
            	deviceHandler = 'Insteon Dimmer'
            } else if (selectedDevice?.value?.type == 'fan') {
            	deviceHandler = 'Insteon Fan Controller'
            } else {
            }
			log.debug "Creating ${deviceHandler} [${selectedDevice.value.insteonId}]"
			addChildDevice("TenStartups", deviceHandler, selectedDevice.value.networkId, selectedDevice?.value.hub, [
            	"name": selectedDevice?.value?.name,
				"label": selectedDevice?.value?.name,
				"data": [
					"mac": selectedDevice.value.mac,
					"ip": selectedDevice.value.networkAddress,
					"port": selectedDevice.value.deviceAddress,
                    "insteonId": selectedDevice.value.insteonId
				],
                completedSetup: true
			])
		}
	}
}

def removeUnselectedDevices() {
	def unselected = getDevices()
    unselected.each { device ->
    	def selected = selectedDevices.find { dni -> device.value.networkId == dni }
    	def child = getChildDevices().find { it.deviceNetworkId == device.value.networkId }
        if (child && !selected) {
            deleteChildDevice(device.value.networkId)
        }
    }
}

def sendAccessTokenToChildDevices() {
	getChildDevices().each { device ->
        sendHubCommand(
        	new physicalgraph.device.HubAction(
                method: "PATCH",
                path: "/api/smart_things/token/${state.accessToken}",
                headers: [HOST: "${device.getDataValue("ip")}:${device.getDataValue("port")}"]
            )
        )
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
    	httpError(404, "Device ${request.JSON.device.network_id} not found")
    }
    child.sync(request.JSON.device.mac, request.JSON.device.ip, request.JSON.device.port)
    if (request.JSON.device.name) {
    	child.name = request.JSON.device.name
    }
    if (request.JSON.device.label) {
        child.label = request.JSON.device.label
    }
    child.processStatusUpdate(request.JSON.data)
    return [ status: 'ok' ]
}

private Integer convertHexToInt(hex) {
	Integer.parseInt(hex,16)
}

private String convertHexToIP(hex) {
	[convertHexToInt(hex[0..1]),convertHexToInt(hex[2..3]),convertHexToInt(hex[4..5]),convertHexToInt(hex[6..7])].join(".")
}
