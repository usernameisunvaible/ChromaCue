// const utils = require("../../utils/index")
// const sdk = require('cue-sdk')
// const path = require("../../../absPath.js")

const sdk = require("../../sdk/index")


const getdevices = (req, res) => {
    try {
        const devices = sdk.com.getDevices()
        
        res.status(200)
        res.send({"msg" : "devices list" , "data" : devices.devices})
    } catch (err){
        console.log(err)
        res.status(500)
        res.json({"msg": "Internal server error"})
    }
}

module.exports = getdevices;