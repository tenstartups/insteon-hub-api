/**
 *  Insteon Switch
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
import groovy.json.JsonSlurper

metadata {
    definition (name: "Insteon Switch", author: "marclennox", namespace: "TenStartups") {
        capability "Switch"
        capability "Refresh"
    }

    // simulator metadata
    simulator {
    }

    // UI tile definitions
    tiles(scale:2) {
       multiAttributeTile(name:"switch", type: "lighting", width: 6, height: 4, canChangeIcon: true){
            tileAttribute ("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "on", label:'${name}', action:"switch.off", icon:"st.switches.switch.on", backgroundColor:"#79b821", nextState:"turningOff"
                attributeState "off", label:'${name}', action:"switch.on", icon:"st.switches.switch.off", backgroundColor:"#ffffff", nextState:"turningOn"
                attributeState "turningOn", label:'${name}', action:"switch.off", icon:"st.switches.switch.on", backgroundColor:"#79b821", nextState:"turningOff"
                attributeState "turningOff", label:'${name}', action:"switch.on", icon:"st.switches.switch.off", backgroundColor:"#ffffff", nextState:"turningOn"
            }
        }

        standardTile("refresh", "device.switch", width: 2, height: 2, inactiveLabel: false, decoration: "flat") {
            state "default", label:'', action:"refresh.refresh", icon:"st.secondary.refresh"
        }

        main(["switch"])
        details(["switch", "refresh"])
    }

}

def insteonId() {
  return getDataValue("insteonId")
}

def installed() {
    log.debug "[${insteonId()}] Installed with settings: ${settings}"
}

def updated() {
    log.debug "[${insteonId()}] Updated with settings: ${settings}"
}

def sendCommand(String commandPath, Map queryParams = [:]) {
	new physicalgraph.device.HubAction(
        method: "POST",
        path: "/api/switch/${insteonId()}/command/${commandPath}",
        headers: [HOST: "${getDataValue("ip")}:${getDataValue("port")}"]
    )
}

def on() {
    log.debug "[${insteonId()}] Turning switch ON..."
    sendCommand("on")
}

def off() {
    log.debug "[${insteonId()}] Turning switch OFF..."
    sendCommand("off")
}

def refresh()
{
    log.debug "[${insteonId()}] Refreshing switch status..."
    sendCommand("refresh")
}

def sync(mac, ip, port) {
	if (mac && mac != getDataValue("mac")) {
		updateDataValue("mac", mac)
	}
	if (ip && ip != getDataValue("ip")) {
		updateDataValue("ip", ip)
	}
	if (port && port != getDataValue("port")) {
		updateDataValue("port", port)
	}
}

def processStatusUpdate(data) {
    if (data.status != null) {
	    log.debug "[${insteonId()}] Switch is ${data.status.toUpperCase()}"
	    sendEvent(name: "switch", value: data.status)
    }
}