const icueSkd = require('cue-sdk')
const Chroma = require("../razerSdk/index")
const razerIds = require("../../razerIds");
const utils = require("../utils/index")
const path = require("../../absPath.js");
const self = require("./index")
const syncEffect = require("./syncEffects")

module.exports = class com {
    init(callback)
    {
        Chroma.util.init((con) => {
            this.chroma = con
            
            icueSkd.CorsairPerformProtocolHandshake()
            if (icueSkd.CorsairGetLastError() !== 0)
                this.icue = false
            else 
                this.icue = true
            

            this.reloadColors()
            
            const syncEff = utils.ReadJSON(path() + "devices.json").syncEffect
            this.syncEffect = new syncEffect()
            this.syncEffect.init(this.getDevices(false).devices, syncEff)


            if (callback)
                callback()
        })
    }
    
    reloadColors()
    {
        const registerDevices = utils.ReadJSON(path() + "devices.json")

        if (this.icue) {
            const deviceCount = icueSkd.CorsairGetDeviceCount()
            for (let di = 0; di < deviceCount; ++di) {
                const deviceInfo = icueSkd.CorsairGetDeviceInfo(di)
                for (let i = 0; i < registerDevices.devices.length; ++i) {
                    if (deviceInfo.deviceId == registerDevices.devices[i].id && registerDevices.devices[i].effect == "static") {
                        for (let j = 0; j < registerDevices.devices[i].leds.length; ++j) {
                            icueSkd.CorsairSetLedsColorsBufferByDeviceIndex(di, [{ledId :registerDevices.devices[i].leds[j].ledId, r : registerDevices.devices[i].leds[j].color.r , g : registerDevices.devices[i].leds[j].color.g , b : registerDevices.devices[i].leds[j].color.b}])
                        }
                    } 
                }   
            }
            icueSkd.CorsairSetLedsColorsFlushBuffer()
        }

        if (this.chroma) {
            setTimeout(() => {
                for (let i = 0; i < registerDevices.devices.length; ++i) {
                    if (registerDevices.devices[i].type == "razer" && registerDevices.devices[i].effect == "static") {
                        for (let j = 0; j < razerIds.length; ++j) {
                            for (let k = 0; k < razerIds[j].leds.length; ++k) {
                                for (let l = 0; l < registerDevices.devices[i].leds.length; ++l) {
                                    if (registerDevices.devices[i].leds[l].ledId == razerIds[j].leds[k].ledId) {
                                        console.log(registerDevices.devices[i].leds[l].color.r, registerDevices.devices[i].leds[l].color.g, registerDevices.devices[i].leds[l].color.b)
                                        razerIds[j].select.setColor(Chroma.colors.rgb(registerDevices.devices[i].leds[l].color.r, registerDevices.devices[i].leds[l].color.g, registerDevices.devices[i].leds[l].color.b))
                                    }
                                }
                            }
                        }
                    }
                }
            }, 1500)
        }        
    }


        

    setColor(color, devices)
    {
        if (Array.isArray(devices) == false)
            devices = [devices]
        const registerDevices = utils.ReadJSON(path() + "devices.json")
        for (let i  = 0; i < devices.length; ++i) {
            for (let k = 0; k < devices[i].ledId.length; ++k) {
                if (devices[i].ledId[k] >= 1800 && this.chroma) {
                    
                    for (let j = 0; j < razerIds.length; ++j) {
                        for (let e = 0; e < razerIds[j].leds.length; ++e) {
                            if (devices[i].ledId[k] == razerIds[j].leds[e].ledId) {
                                razerIds[j].select.setColor(Chroma.colors.rgb(color.r, color.g, color.b))
                            }
                        }
                    }
                } else {
                    icueSkd.CorsairSetLedsColorsBufferByDeviceIndex(devices[i].cueIndex,  [{ledId : devices[i].ledId[k], r : color.r, g : color.g, b : color.b}])
                }
                for (let n = 0; n < registerDevices.devices.length; ++n) {
                    for (let m = 0; m < registerDevices.devices[n].leds.length; ++m) {
                        if (devices[i].id ==  registerDevices.devices[n].id && devices[i].ledId[k] == registerDevices.devices[n].leds[m].ledId) {
                            registerDevices.devices[n].leds[m].color = color
                        }
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
            if (!devices[i].id || !devices[i].pos)
                return false
            let find = false;

            for (let j = 0; j < registerDevices.devices.length; ++j) {
                if (registerDevices.devices[j].id == devices[i].id) {
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

    getDevices(rewrite = true)
    {
        let registerDevices = utils.ReadJSON(path() + "devices.json")

        let outRegister = {"devices" : []}
        if (this.icue) {
            const deviceCount = icueSkd.CorsairGetDeviceCount()
            for (let di = 0; di < deviceCount; ++di) {
                const deviceInfo = icueSkd.CorsairGetDeviceInfo(di)
                let pass = false

                for (let i = 0; i < registerDevices.devices.length; ++i) {
                    if (deviceInfo.deviceId == registerDevices.devices[i].id) {
                        outRegister.devices.push({"name" : registerDevices.devices[i].name ,"leds" : registerDevices.devices[i].leds , "pos" : registerDevices.devices[i].pos,"effect" : registerDevices.devices[i].effect, "type" : registerDevices.devices[i].type, "id" : registerDevices.devices[i].id, "cueIndex" : di})
                        if (rewrite) {
                            registerDevices.devices[i].cueIndex = di
                        }
                        pass = true;
                    }
                }
                if (!pass) {
                    const ledPositions = icueSkd.CorsairGetLedPositionsByDeviceIndex(di)
                    let curent = {"name" : deviceInfo.model ,"leds" : [] , "pos" : {"x" : -1, "y" : -1},"effect" : "static", "type" : "corsair", "id" : deviceInfo.deviceId, "cueIndex" : di};

                    for (let i = 0; i < ledPositions.length; ++i)
                        curent.leds.push({"ledId" : ledPositions[i].ledId, "top" : ledPositions[i].top, "left" : ledPositions[i].left, "color" : {"r" : 255, "g" : 0, "b" : 0}})
                    outRegister.devices.push(curent)
                    if (rewrite)
                        registerDevices.devices.push(curent)
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

        if (rewrite)
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

        for (let i = 0; i < razerIds.length; ++i) {
            if (name == razerIds[i].device) {
                if (!this.chroma)
                    return "razer synapse not started"
                registerDevices.devices.push({"name" : name, "leds" : razerIds[i].leds, "effect" : "static" , "pos":{"x":-1,"y":-1}, "type" : "razer", "id" : utils.Guid()})
                find = true
                break
            }
        }
        if (!find)
            return "false"
        utils.WriteJSON(path() + "devices.json", registerDevices)
        return "true"
    }

    putEffect(id, effect)
    {
        const devices = utils.ReadJSON(path() + "devices.json")
        let find = false;
        let change = false;
        

        for (let i = 0; i < devices.devices.length; ++i) {
            if (id == devices.devices[i].id) {
                find = true;
                if (effect != devices.devices[i].effect) {
                    change = true
                    if (devices.devices[i].effect == "sync")
                        this.syncEffect.removeDevice(devices.devices[i])
                    if (effect == "sync")
                        this.syncEffect.addDevice({"id" : id, "pos" : devices.devices[i].pos, "cueIndex" : devices.devices[i].cueIndex, "leds" : devices.devices[i].leds})
                    devices.devices[i].effect =  effect;
                }
            }
        }
       

        if (!find)
            return "false"

        if (!change)
            return "no change"
        utils.WriteJSON(path() + "devices.json", devices)
        return "true"
    }
}