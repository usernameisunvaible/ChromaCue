const fs = require('fs');

//Create a folder
const CreateFolder = (path) => {
    try {
        let fullpath = "userData/matiere/" + path;
        if (!fs.existsSync(fullpath)) {
             fs.mkdirSync(fullpath);
            return "success"
        } else {
            return "already exist"
        }
      } catch (err) {
            throw err;
      }
}



module.exports = CreateFolder;