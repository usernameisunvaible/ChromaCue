const utils = require("../../utils/index")
const sdk = require("../../sdk/index")

const effect = (req, res) => {
    try {
        const request = req.body

        if (!request.id || !request.effect) {
            res.status(400)
            res.json({"msg": "bad request"})
            return 
        }
        const out = sdk.com.putEffect(request.id, request.effect)

        if (out == "false") {
            res.status(404)
            res.json({"msg": "not found"})
            return 
        }
        if (out == "no change") {
            res.status(304)
            res.json({"msg": "not change"})
            return 
        }

        if (out == "true") {
            res.status(200)
            res.json({"msg": "OK"})
            return 
        }

    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = effect