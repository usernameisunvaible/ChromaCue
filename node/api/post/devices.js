const utils = require("../../utils/index")
const path = require("../../../absPath.js")

const sdk = require("../../sdk/index")

const devices = (req, res) => {
    try {
        const request =  req.body

        if (!request.name) {
            res.status(400)
            res.json({"msg": "bad request"})
        }

        let out = sdk.com.postDevice(request.name)
        if (out == "false") {
            res.status(400)
            res.json({"msg": "bad request"})
        } else if (out == "already exist") {
            res.status(400)
            res.json({"msg": "already exist"})
        } else if (out == "true"){
            res.status(201)
            res.send({"msg" : "devices created"})
        } else {
            res.status(403)
            res.send({"msg" : out})
        }
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = devices