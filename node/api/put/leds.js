const utils = require("../../utils/index")

const sdk = require("../../sdk/index")

const leds = (req, res) => {
    try {
        const request = req.body

        if (!request.leds || !request.color) {
            res.status(400)
            res.json({"msg": "bad request"})
        } else {
            sdk.com.setColor(request.color, request.leds)
            res.status(200)
            res.send({"msg" : "color applied"})
        }
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = leds