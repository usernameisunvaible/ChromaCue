const effectsList = require("./effectsList")
const icueSkd = require('cue-sdk')
const Chroma = require("../razerSdk/index")
const razerIds = require("../../razerIds");
const utils = require("../utils/index")
const path = require("../../absPath.js");

module.exports = class eff {
    init(devices, effect)
    {
        if (devices == null)
            devices = utils.ReadJSON(path() + "devices.json").devices
        this.counter = 0
        this.speed = 100

        this.leds = []
        if (devices) {
            for (let i = 0; i < devices.length; ++i) {
                if (devices[i].effect == "sync") {
                    this.leds.push({"id" : devices[i].id,"pos" : devices[i].pos,  "cueIndex" : devices[i].cueIndex, "leds" : devices[i].leds})
                }
            }
        }
        // console.log(this.leds)
        if (this.leds.length == 0) {
            this.active = false
        } else {
            this.active = true
        }
    
        this.effect = "wave"
        if (effect && effectsList.indexOf(effect) != -1)
            this.effect = effect
        
        this.color_change()
        this.wave()
    }

    setColor(color, devices)
    {
        
        if (Array.isArray(devices) == false)
            devices = [devices]
        for (let i  = 0; i < devices.length; ++i) {
            for (let k = 0; k < devices[i].ledId.length; ++k) {
                if (devices[i].ledId[k] >= 1800) {
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
            }
        }
        icueSkd.CorsairSetLedsColorsFlushBuffer()
        
    }

    addDevice(device)
    {
        if (device)
            this.leds.push(device)
    }

    removeDevice(device)
    {
        for (let i = 0; i < this.leds.length; ++i) {
            if (this.leds[i].id == device.id) {
                this.leds.splice(i, 1)
                for (let j = 0; j < device.leds.length; ++j)
                    this.setColor(device.leds[j].color, [{"ledId" : [device.leds[j].ledId], "cueIndex" : device.cueIndex}])
            }
        }
    }

    change(effect)
    {
        if (effect && effectsList.indexOf(effect) != -1)
            this.effect = effect
    }

    getRGBwithX(x)
    {
        if (x < 256) 
            return {"r" : 255, "g": 0, "b" : x % 256}
        if (x >= 256 && x < 512) 
            return {"r" : 255 - (x % 256), "g": 0, "b" : 255}
        if (x >= 512 && x < 768)
            return {"r" : 0, "g": x % 256, "b" : 255}
        if (x >= 768 && x < 1024)
            return {"r" : 0, "g": 255, "b" : 255 - (x % 256)}
        if (x >= 1024 && x < 1280)
            return {"r" : x % 256, "g": 255 , "b" : 0}
        if (x >= 1280 && x < 1536)
            return {"r" : 255 , "g": 255 - (x % 256), "b" : 0}
    }

    wave()
    {
        this.counter = 0
        setInterval(() => {
            if (this.active && this.effect == "wave") {
                for (let i = 0; i < this.leds.length ; ++i) {
                    for (let j = 0; j < this.leds[i].leds.length; ++j)
                        this.setColor(this.getRGBwithX((this.leds[i].pos.x + this.leds[i].leds[j].left + this.counter) % 1536) , [{"ledId" : [this.leds[i].leds[j].ledId], "cueIndex" : this.leds[i].cueIndex}])
                }
                this.counter += 10
            } else {
                return
            }
        }, this.speed)
    }

    color_change()
    {
        this.counter = 0
        setInterval(() => {
            if (this.active && this.effect == "color change") {
                for (let i = 0; i < this.leds.length ; ++i) {
                    for (let j = 0; j < this.leds[i].leds.length; ++j)
                        this.setColor(this.getRGBwithX(this.counter % 1536) , [{"ledId" : [this.leds[i].leds[j].ledId], "cueIndex" : this.leds[i].cueIndex}])
                }
                this.counter += 10
            } else {
                return
            }
        }, this.speed)
    }
}