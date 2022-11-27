const utils = require("../../utils/index")

const listGet = (req, res) => {
    try {
        res.status(200)
        res.send({"msg" : "list get", "data" : [
            "/",
            "/devices"
            ]})
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = listGet;