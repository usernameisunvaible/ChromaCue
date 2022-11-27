const effectsList = require("./effectsList")

module.exports = class eff {
    init(devices, effect)
    {
        this.leds = []
        if (devices) {
            for (let i = 0; i < devices.length; ++i) {
                if (devices[i].effect == "sync") {
                    for (let j = 0 ; j < devices[i].leds.length; ++j) {
                        this.leds.push(devices[i].leds[j])
                    }
                }
            }
        }
        if (this.leds.length == 0) {
            this.active = false
        } else {
            this.active = true
        }
    
        this.effect = "wave"
        if (effect && effectsList.indexOf(effect) != -1)
            this.effect = effect
    }

    setColor(color, ledId)
    {
        if (Array.isArray(ledId) == false)
            ledId = [ledId]
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

    addLed()

    change(effect)
    {
        if (effect && effectsList.indexOf(effect) != -1)
            this.effect = effect
    }

    wave()
    {
        //wave annimation
    }

}