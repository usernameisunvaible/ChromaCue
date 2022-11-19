const utils = require("../utils/index")
const sdk = require('cue-sdk')
const Chroma = require("../razerSdk/index")
const razerIds = require("../../razerIds");

const setColor = (color, ledId) => {

    for (let i  = 0; i < ledId.length; ++i) {
        if (ledId[i] >= 1800) {
            for (let j = 0; j < razerIds.length; ++j) {
                if (ledId[i] == razerIds[j].id) {
                    // console.log("oi")
                    razerIds[j].select.setColor(Chroma.colors.rgb(color.r, color.g, color.b))
                    // Chroma.effects.mouse.setColor(Chroma.colors.rgb(color.r, color.g, color.b))
                }
            }
        } else {
            sdk.CorsairSetLedsColors([{ledId : ledId[i], r : color.r, g : color.g, b : color.b}])
        }
    }
    sdk.CorsairSetLedsColorsFlushBuffer()
}

module.exports = setColor