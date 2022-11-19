const ListDir = require("./ListDir")
const ReadJSON = require("./ReadJSON")
const Remove = require("./Remove")

const readdir = (path) => {

    try {
        let list = ListDir(path)
        if (list == null)
            return null
        Remove(list, "__parameter__")
        let jsonArray = []
        let jsonTemp;
        
        for (let i = 0; i < list.length; ++i) {
            jsonTemp = ReadJSON(list[i] + "/__parameter__/parameter.json")
            if (jsonTemp == null)
                return null
            jsonArray.push(jsonTemp)
        }

        return jsonArray
    } catch (err) {
        throw err;
    }
}
module.exports = readdir;