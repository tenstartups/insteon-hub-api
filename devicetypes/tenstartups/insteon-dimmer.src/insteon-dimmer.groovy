/**
 *  Insteon Dimmer
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
    definition (name: "Insteon Dimmer", author: "marclennox", namespace: "TenStartups") {
        capability "Switch"
        capability "Switch Level"
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
            
           tileAttribute ("device.level", key: "SLIDER_CONTROL") {
               attributeState "level", action:"switch level.setLevel"
           }

        }
        
        standardTile("refresh", "device.switch", width: 2, height: 2, inactiveLabel: false, decoration: "flat") {
            state "default", label:'', action:"refresh.refresh", icon:"st.secondary.refresh"
        }

        valueTile("level", "device.level", inactiveLabel: false, decoration: "flat", width: 2, height: 2) {
            state "level", label:'${currentValue} %', unit:"%", backgroundColor:"#ffffff"
        }

        main(["switch"])
        details(["switch", "level", "refresh"])
    }
}

def insteonId() {
  return getDataValue("insteonId")
}

def installed() {
    log.debug "[${insteonId()}] Installed with settings: ${settings}"
    refreshLoop()
}

def updated() {
    log.debug "[${insteonId()}] Updated with settings: ${settings}"
    refreshLoop()
}

def sendCommand(String commandPath) {
	def command = new physicalgraph.device.HubAction(
    	[
            method: "POST",
            path: "/api/dimmer/${insteonId()}/${commandPath}",
            headers: [
                HOST: "${getDataValue("ip")}:${getDataValue("port")}"
            ]
        ],
        null,
        [
            callback: commandResponseHandler
        ]
    )
    return command
}

void commandResponseHandler(physicalgraph.device.HubResponse hubResponse) {
    def response = hubResponse.json
	log.debug("[${insteonId()}] Received response ${response}")
    if (response.result?.status) {
	    log.debug "[${insteonId()}] Dimmer is ${response.result?.status.toUpperCase()}"
	    sendEvent(name: "switch", value: response.result?.status)
    }
    if (response.result?.level) {
	    log.debug "[${insteonId()}] Dimmer is at ${response.result?.level}%"
	    sendEvent(name: "level", value: response.result?.level, unit: "%")
    }
}

def on() {
    log.debug "[${insteonId()}] Turning dimmer ON..."
    sendCommand("on")
}

def off() {
    log.debug "[${insteonId()}] Turning dimmer OFF..."
    sendCommand("off")
}

def setLevel(level) {
    log.debug "[${insteonId()}] Setting dimmer level to ${level}%..."
    sendCommand("level/${level}")
}

def refresh()
{
    log.debug "[${insteonId()}] Refreshing dimmer status..."
    sendCommand("status")
}

def refreshLoop()
{
	def refreshSeconds = getDataValue("refreshSeconds").toInteger()
    if (refreshSeconds > 0) {
        refresh()
        log.debug "[${insteonId()}] Scheduling next refresh in ${refreshSeconds} seconds..."
        runIn(refreshSeconds, refreshLoop)
    }
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

def processEvent(event) {
	log.debug("[${insteonId()}] Received event ${event}")
    if (event.status) {
	    log.debug "[${insteonId()}] Dimmer turned ${event.status.toUpperCase()}"
	    sendEvent(name: "switch", value: event.status)
    }
    if (event.level) {
	    log.debug "[${insteonId()}] Dimmer set to ${event.level}%"
	    sendEvent(name: "level", value: event.level, unit: "%")
    }
}