const Chroma = require("./node/razerSdk/index.js")
module.exports = [
    {device : "RAZER MOUSE", leds : [{ ledId: 1800, top: 50, left: 40, "color" : {"r" : 255, "g" : 0, "b" : 0}}], select : Chroma.effects.mouse}
];