const utils = require("../../utils/index")

const listDelete = (req, res) => {
    try {
        res.status(200)
        res.send({"msg" : "list get", "data" : [
            "/",
            "/close"
            ]})
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = listDelete;