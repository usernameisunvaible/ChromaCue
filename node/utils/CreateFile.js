const fs = require('fs/promises');

//Create a file
const CreateFile = (path) => {
    try {
        let fullpath = "userData/matiere/" + path;
        fs.writeFile(fullpath, "");
    } catch (err) {
        throw err;
    }
}

module.exports = CreateFile;