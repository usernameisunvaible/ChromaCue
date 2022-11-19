const icueSkd = require('cue-sdk')
const Chroma = require("../razerSdk/index")
const razerIds = require("../../razerIds");
const utils = require("../utils/index")
const path = require("../../absPath.js")

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
            if (callback)
                callback()
        })
    }
    
    setColor(color, ledId)
    {
        for (let i  = 0; i < ledId.length; ++i) {
            if (ledId[i] >= 1800 && this.chroma) {
                for (let j = 0; j < razerIds.length; ++j) {
                    if (ledId[i] == razerIds[j].id)
                        razerIds[j].select.setColor(Chroma.colors.rgb(color.r, color.g, color.b))
                }
            } else {
                icueSkd.CorsairSetLedsColors([{ledId : ledId[i], r : color.r, g : color.g, b : color.b}])
            }
        }
        icueSkd.CorsairSetLedsColorsFlushBuffer()
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
        const newRegister = {"devices" : []}
        if (this.icue) {
            const deviceCount = icueSkd.CorsairGetDeviceCount()
            for (let di = 0; di < deviceCount; ++di) {
                const ledPositions = icueSkd.CorsairGetLedPositionsByDeviceIndex(di)
                const deviceInfo = icueSkd.CorsairGetDeviceInfo(di)
                let curent = {"name" : deviceInfo.model ,"leds" : ledPositions , "pos" : {"x" : -1, "y" : -1}};
                
                for (let i = 0; i < registerDevices.devices.length; ++i) {
                    if (deviceInfo.model == registerDevices.devices[i].name)
                        curent.pos = registerDevices.devices[i].pos
                }
                newRegister.devices.push(curent)
            }
        }

        if (this.chroma) {
            for (let i = 0; i < registerDevices.devices.length; ++i) {
                for (let j = 0; j < razerIds.length; ++j) {
                    if (registerDevices.devices[i].name == razerIds[j].device) {
                        newRegister.devices.push(registerDevices.devices[i])
                    }
                }
            }
        }

        utils.WriteJSON(path() + "devices.json", newRegister)
        return newRegister





        
        

        
        //     let curent = {"name" : "" ,"leds" : [] , "pos" : {"x" : -1, "y" : -1}};
        //     const deviceInfo = sdk.CorsairGetDeviceInfo(di)
        //     curent.name = deviceInfo.model
        //     for (let i = 0; i < registerDevices.devices.length; ++i) {
        //         if (registerDevices.devices[i].name == curent.name) {
        //             curent.pos = registerDevices.devices[i].pos
        //         }
        //     }
        //     const ledPositions = sdk.CorsairGetLedPositionsByDeviceIndex(di)
        //     for (let i = 0; i < ledPositions.length; ++i) {
        //         curent.leds.push(ledPositions[i].ledId);
        //     }
        //     devices.push(curent)
        // }

        // const razers = [{"name" : "NAGA PRO" ,"leds" : [1800]}]

        // for (let di = 0; di < razers.length; ++di) {
        //     let curent = {"name" : razers[di].name ,"leds" : razers[di].leds , "pos" : {"x" : -1, "y" : -1}};
        //     for (let i = 0; i < registerDevices.devices.length; ++i) {
        //         if (registerDevices.devices[i].name == curent.name) {
        //             curent.pos = registerDevices.devices[i].pos
        //         }
        //     }
        //     devices.push(curent)
        // }
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
                registerDevices.devices.push({"name" : name, "leds" : razerIds[i].leds, "pos":{"x":-1,"y":-1}})
                find = true
                break
            }
        }
        if (!find)
            return "false"
        utils.WriteJSON(path() + "devices.json", registerDevices)
        return "true"
    }


}