const utils = require("../../utils/index")

const listPut = (req, res) => {
    try {
        res.status(200)
        res.send({"msg" : "list put", "data" : [
            "/",
            "/leds"
            ]})
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = listPut;