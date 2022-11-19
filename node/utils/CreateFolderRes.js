const CreateFolder = require("./CreateFolder")


//Create a folder and send a good response in case of fail. return the dir path in case of success
const CreateFolderRes = (path, def, res ) => {
    let finalName = path;

    if (!path)
        finalName = def;
    finalName += "/"
    if (CreateFolder(finalName) == "already exist") {
        res.status(409)
        res.json({"msg": "already exist"})
        return "false"
    }
    return finalName
}

module.exports = CreateFolderRes;