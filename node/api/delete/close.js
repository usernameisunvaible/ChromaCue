const utils = require("../../utils/index")
const Chroma = require("../../razerSdk/index")

const close = (req, res) => {
    try {
        setTimeout(utils.Exit, 1000, 0, Chroma.util.close())
        res.status(200)
        res.json({"msg": "application closed"})
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = close