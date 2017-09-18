/**
 *  Insteon Fan
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
    definition (name: "Insteon Fan", author: "marclennox", namespace: "TenStartups") {
        capability "Light"
        capability "Actuator"
        capability "Switch"
        capability "Sensor"
        capability "Refresh"
        
        command "low_Speed"
        command "med_Speed"
        command "high_Speed"
        command "fan_off"

        attribute "fanSpeed", "string"
    }
	tiles(scale: 2) {
    	
        standardTile("fanSpeed", "fanSpeed", decoration: "flat", width: 4, height: 4) {
        	state "Fan_Off", label: "OFF", backgroundColor:"#ffffff", icon:"st.thermostat.fan-auto"
            state "on01", label: "LOW", backgroundColor: "#F2F5A9", icon:"st.thermostat.fan-auto"
            state "on02", label: "MED", backgroundColor: "#ACFA58", icon:"st.thermostat.fan-auto"
            state "on03", label: "HIGH", backgroundColor: "#2ECCFA", icon:"st.thermostat.fan-auto"
            }
        standardTile("offSpeed", "fanSpeed", decoration: "flat", width:2, height: 2) {
        	state "Fan_Off", label: "OFF", action: "fan_off", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ff9602"//, nextState: "on01" //"turningOn"
            state "on01", label: "OFF", action: "fan_off", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on02", label: "OFF", action: "fan_off", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on03", label: "OFF", action: "fan_off", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            }
        standardTile("01Speed", "fanSpeed", decoration: "flat", width:2, height:2) { 
            state "on01", label: "LOW", action: "low_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#79b821"//, nextState: "on02" //"turningOff"
            state "Fan_Off", label:"LOW", action: "low_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on02", label:"LOW", action: "low_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on03", label:"LOW", action: "low_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
		}
        standardTile("02Speed", "fanSpeed", decoration: "flat", width: 2, height: 2) {
            state "on02", label: "MED", action: "med_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#79b821"//, nextState: "on03" //"turningOff"
            state "Fan_Off", label: "MED", action: "med_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on01", label: "MED", action: "med_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on03", label: "MED", action: "med_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"            
		}
        standardTile("03Speed", "fanSpeed", decoration: "flat", width: 2, height: 2) {
            state "on03", label: "HIGH", action: "high_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#79b821"//, nextState: "off" //"turningOff"
            state "Fan_Off", label: "HIGH", action: "high_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on01", label: "HIGH", action: "high_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"
            state "on02", label: "HIGH", action: "high_Speed", icon:"st.samsung.da.RAC_4line_02_ic_fan", backgroundColor:"#ffffff"            
		}

        standardTile("refresh", "fanSpeed", width: 2, height: 2, inactiveLabel: false, decoration: "flat") {
            state "default", label:'', action:"refresh.refresh", icon:"st.secondary.refresh"
        }
        main(["fanSpeed"])
        	details(["fanSpeed", "offSpeed", "01Speed", "02Speed", "03Speed", "refresh"])
		}

	// simulator metadata
    simulator {
    }
 
} // end Metadata

def insteonId() {
  return getDataValue("insteonId")
}

def installed() {
    log.debug "[${insteonId()}] Installed with settings: ${settings}"
}

def updated() {
    log.debug "[${insteonId()}] Updated with settings: ${settings}"
}

def sendCommand(String commandPath) {
	def command = new physicalgraph.device.HubAction(
    	[
            method: "POST",
            path: "/api/fan/${insteonId()}/${commandPath}",
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
    if (response.result?.status != null) {
	    log.debug "[${insteonId()}] Dimmer is ${response.result?.status.toUpperCase()}"
	    sendEvent(name: "switch", value: response.result?.status)
    }
    if (response.result?.level != null) {
	    log.debug "[${insteonId()}] Dimmer is at ${response.result?.level}%"
	    sendEvent(name: "level", value: response.result?.level, unit: "%")
    }
}

def on() {
    log.debug "[${insteonId()}] Turning fan light ON..."
    sendCommand("on")
}

def off() {
    log.debug "[${insteonId()}] Turning fan light OFF..."
    sendCommand("off")
}

def setLevel(level) {
    log.debug "[${insteonId()}] Setting fan light level to ${level}%..."
    sendCommand("level/${level}")
}

def refresh()
{
    log.debug "[${insteonId()}] Refreshing fan status..."
    sendCommand("status")
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
    if (event.status != null) {
	    log.debug "[${insteonId()}] Dimmer turned ${event.status.toUpperCase()}"
	    sendEvent(name: "switch", value: event.status)
    }
    if (event.level != null) {
	    log.debug "[${insteonId()}] Dimmer set to ${event.level}%"
	    sendEvent(name: "level", value: event.level, unit: "%")
    }
}






def fan_off() {
//def fan_Off() {
    log.debug ("Fan Set OFF")
    sendCmd("11", "00", "1F") // (command_Code, Level, SubDevice)
    sendEvent(name: "fanSpeed", value: "Fan_Off", isStateChange: true);
}

def low_Speed() {
    log.debug "Fan Set Low"
    sendCmd("11", "55", "1F")
//        sendEvent(name: "currentSpeed", value: "LOW", isStateChange: true);
        sendEvent(name: "fanSpeed", value: "on01", isStateChange: true)
}

def med_Speed() {
    log.debug "Fan Set Medium"
    sendCmd("11", "A9", "1F")
    sendEvent(name: "fanSpeed", value: "on02", isStateChange: true);
}

def high_Speed() {
    log.debug "Fan Set High"
    sendCmd("11", "FF", "1F")
    sendEvent(name: "fanSpeed", value: "on03", isStateChange: true);
}

/*
def setLevel(value) {

    // log.debug "setLevel >> value: $value"
    
    // Max is 255
    def percent = value / 100
    def realval = percent * 255
    def valueaux = realval as Integer
    def level = Math.max(Math.min(valueaux, 255), 0)
    if (level > 0) {
        sendEvent(name: "switch", value: "on")
    } else {
        sendEvent(name: "switch", value: "off")
    }
    log.debug "dimming to $level"
    dim(level,value)
}

def dim(level, real) {
    String hexlevel = level.toString().format( '%02x', level.toInteger() )
    sendCmd("11",hexlevel , "0F")
    sendEvent(name: "level", value: real, unit: "%")
}
*/

def sendCmd(num, level, subCode)
{
    log.debug "Sending Command"

    httpGet("http://${settings.username}:${settings.password}@${settings.host}:${settings.port}//3?0262${settings.deviceid}${subCode}${num}${level}=I=3") {response -> 
        def content = response.data
        
         //log.debug "content: ${content}"
    }
    log.debug "Command Completed"
}

def getStatus() {

    def myURL = [
		uri: "http://${settings.username}:${settings.password}@${settings.host}:${settings.port}/3?0262${settings.deviceid}0F1903=I=3"
	]
    
    log.debug myURL
    httpPost(myURL)
	
    def buffer_status = runIn(2, getBufferStatus)
}

def getBufferStatus() {
	def buffer = ""
	def params = [
        uri: "http://${settings.username}:${settings.password}@${settings.host}:${settings.port}/buffstatus.xml"
    ]
    
    try {
        httpPost(params) {resp ->
            buffer = "${resp.responseData}"
            log.debug "Buffer: ${resp.responseData}"
        }
    } catch (e) {
        log.error "something went wrong: $e"
    }

	def buffer_end = buffer.substring(buffer.length()-2,buffer.length())
	def buffer_end_int = Integer.parseInt(buffer_end, 16)
    
    def parsed_buffer = buffer.substring(0,buffer_end_int)
    log.debug "ParsedBuffer: ${parsed_buffer}"
    
    def responseID = parsed_buffer.substring(22,28)
     
    
    if (responseID == settings.deviceid) {
        log.debug "Response is for correct device: ${responseID}"
        def status = parsed_buffer.substring(38,40)
        log.debug "Status: ${status}"
		def devCode = parsed_buffer.substring(12,16)
        def level = Math.round(Integer.parseInt(status, 16)*(100/255))
        log.debug "Level: ${level}"
        log.debug "device code: ${devCode}"
        
	if (devCode == "1901"){	//status of light 
        
        if (level == 0) {
            log.debug "Device is off..."
            sendEvent(name: "switch", value: "off")
            sendEvent(name: "level", value: level, unit: "%")
            }

        else if (level > 0) {
            log.debug "Device is on..."
            sendEvent(name: "switch", value: "on")
            sendEvent(name: "level", value: level, unit: "%")
        	}
        }
     else if (devCode == "1903") {	//status of fan
     		log.debug "fan status returned with ${devCode}"
        if (level == 00) {
        	log.debug "fan is Off"
            sendEvent(name: "fanSpeed", value: "off")
        }
        else if (level < 34) {
        	log.debug "fan is Low"
            sendEvent(name: "fanSpeed", value: "on01")
        }
        else if (level <99) {
        	log.debug "fan is Med"
            sendEvent(name: "fanSpeed", value: "on02")
       	}
        else if (level == 100) {
        	log.debug "Fan is High"
            sendEvent(name: "fanSpeed", value: "on03")
            }
     }
    } else {
    	log.debug "Response is for wrong device - trying again"
        getStatus()
    }
}