const utils = require("../../utils/index")

const sdk = require("../../sdk/index")

const devices = (req, res) => {
    try {
        const request = req.body

        if (!request.data) {
            res.status(400)
            res.json({"msg": "bad request"})
        } else {
            if (!sdk.com.setDevices(request.data)) {
                res.status(400)
                res.json({"msg": "bad request"})
            } else {
                res.status(200)
                res.send({"msg" : "devices changed"})
            }
        }
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = devices