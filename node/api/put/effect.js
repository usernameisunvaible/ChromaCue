const utils = require("../../utils/index")
const sdk = require("../../sdk/index")

const effect = (req, res) => {
    try {
        const request = req.body

        if (!request.name || !request.effect) {
            res.status(400)
            res.json({"msg": "bad request"})
            return 
        }

        




        
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = effect