const icueSkd = require('cue-sdk')
const Chroma = require("../razerSdk/index")
const razerIds = require("../../razerIds");
const utils = require("../utils/index")
const path = require("../../absPath.js");
const { sync } = require('mkdirp');

module.exports = class com {
    init(callback)
    {
        Chroma.util.init((con) => {
            // this.chroma = con
            
            icueSkd.CorsairPerformProtocolHandshake()
            if (icueSkd.CorsairGetLastError() !== 0)
                this.icue = false
            else 
                this.icue = true



            this.chroma = true
            this.icue = true



            if (callback)
                callback()
        })
    }
    
    setColor(color, ledId)
    {
        if (Array.isArray(ledId) == false)
            ledId = [ledId]
        const registerDevices = utils.ReadJSON(path() + "devices.json")
        for (let i  = 0; i < ledId.length; ++i) {
            if (ledId[i] >= 1800 && this.chroma) {
                for (let j = 0; j < razerIds.length; ++j) {
                    if (ledId[i] == razerIds[j].id)
                        razerIds[j].select.setColor(Chroma.colors.rgb(color.r, color.g, color.b))
                }
            } else {
                icueSkd.CorsairSetLedsColors([{ledId : ledId[i], r : color.r, g : color.g, b : color.b}])
            }
            for (let k = 0; k < registerDevices.devices.length; ++k) {
                for (let l = 0; l < registerDevices.devices[k].leds.length; ++l) {
                    if (ledId[i] == registerDevices.devices[k].leds[l].ledId) {
                        registerDevices.devices[k].leds[l].color = color
                    }
                }
            }
        }
        icueSkd.CorsairSetLedsColorsFlushBuffer()
        utils.WriteJSON(path() + "devices.json", registerDevices)
    }

    setDevices(devices)
    {
        const registerDevices = utils.ReadJSON(path() + "devices.json")
        for (let i = 0; i < devices.length; ++i) {
            if (!devices[i].name || !devices[i].pos)
                return false
            let find = false;

            for (let j = 0; i < registerDevices.devices.length; ++j) {
                if (registerDevices.devices[j].name == devices[i].name) {
                    find = true;
                    registerDevices.devices[j].pos = devices[i].pos;
                    break;
                }
            }
            if (!find)
                return false
        }
        utils.WriteJSON(path() + "devices.json", registerDevices)
        return true
    }

    getDevices()
    {
        const registerDevices = utils.ReadJSON(path() + "devices.json")


        return registerDevices


        let outRegister = {"devices" : []}
        let reWrite = false
        if (this.icue) {
            const deviceCount = icueSkd.CorsairGetDeviceCount()
            for (let di = 0; di < deviceCount; ++di) {
                const deviceInfo = icueSkd.CorsairGetDeviceInfo(di)
                let pass = false

                for (let i = 0; i < registerDevices.devices.length; ++i) {
                    if (deviceInfo.model == registerDevices.devices[i].name) {
                        outRegister.devices.push(registerDevices.devices[i])
                        pass = true;
                    }
                }
                if (!pass) {
                    const ledPositions = icueSkd.CorsairGetLedPositionsByDeviceIndex(di)
                    let curent = {"name" : deviceInfo.model ,"leds" : [] , "pos" : {"x" : -1, "y" : -1},"effect" : "static", "type" : "corsair"};

                    for (let i = 0; i < ledPositions.length; ++i)
                        curent.leds.push({"ledId" : ledPositions[i].ledId, "top" : ledPositions[i].top, "left" : ledPositions[i].left, "color" : {"r" : 255, "g" : 0, "b" : 0}})
                    
                    registerDevices.devices.push(curent)
                    outRegister.devices.push(curent)
                    reWrite = true
                }
                
            }
        }

        if (this.chroma) {
            for (let i = 0; i < registerDevices.devices.length; ++i) {
                for (let j = 0; j < razerIds.length; ++j) {
                    if (registerDevices.devices[i].name == razerIds[j].device) {
                        outRegister.devices.push(registerDevices.devices[i])
                    }
                }
            }
        }

        if (reWrite)
            utils.WriteJSON(path() + "devices.json", registerDevices)
        return outRegister
    }

    getAvaibleChromaDevices()
    {
        if (this.chroma) {
            return {"devices" :  razerIds}
        } else {
            return null
        }
    }

    postDevice(name)
    {
        const registerDevices = utils.ReadJSON(path() + "devices.json")
        let find = false;

        for (let i = 0; i < registerDevices.devices.length; ++i) {
            if (registerDevices.devices[i].name == name)
                return "already exist"
        }
        
        for (let i = 0; i < razerIds.length; ++i) {
            if (name == razerIds[i].device) {
                if (!this.chroma)
                    return "razer synapse not started"
                registerDevices.devices.push({"name" : name, "leds" : razerIds[i].leds, "effect" : "static" , "pos":{"x":-1,"y":-1}, "type" : "razer"})
                find = true
                break
            }
        }
        if (!find)
            return "false"
        utils.WriteJSON(path() + "devices.json", registerDevices)
        return "true"
    }

    putEffect(name, effect)
    {
        const devices = utils.ReadJSON(path() + "devices.json")
        let find = false;
        let change = false;
        

        for (let i = 0; i < devices.length; ++i) {
            if (name == devices[i].name) {
                find = true;
                if (effect != devices[i].effect) {
                    change = true
                    if (devices[i].effect == "sync")
                        //removefrom syncEffect List
                    if (effect == "sync")
                        //add in syncEffect list
                    devices[i].effect =  effect;
                }
            }
        }
       

        if (!find)
            return "false"

        if (!change)
            return "no chan"
        utils.WriteJSON(path() + "devices.json", devices)
        return "true"


        
    }
}