const sort = require("./Sort")
const ListDir = require("./ListDir")
const ReadJSON = require("./ReadJSON")
const Remove = require("./Remove")

const sortdir = (path) => {

    try {
        let arr = []
        let out = []
        let list = ListDir(path)
        Remove(list, "__parameter__")
        let jsonParameter = ReadJSON(path + "/__parameter__/parameter.json")
        if (jsonParameter == null)
            return null
        let SortType = jsonParameter["defaultSort"]
        let OrderType = jsonParameter["defaultSortOrder"]
        let jsonArray = []
        let jsonTemp;
        for (let i = 0; i < list.length; ++i) {
            jsonTemp = ReadJSON(list[i] + "/__parameter__/parameter.json")
            if (jsonTemp == null)
                return null
            jsonArray.push({
                "creation" : jsonTemp["CreationTimeStamp"],
                "update" : jsonTemp["LastUpdateTimeStamp"],
                "name" : jsonTemp["Name"]
            })
        }

        for (let i = 0; i < jsonArray.length; ++i)
            arr.push(jsonArray[i][SortType])

        out = sort(arr)
        if (OrderType == "decrease")
            return out.reverse();
        else
            return out;
    } catch (err) {
        throw err;
    }
    
}
module.exports = sortdir;