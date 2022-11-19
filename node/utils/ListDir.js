const fs = require('fs');

//List all the dir/files of a dir
const ListDir = (path) => {
    try {
        let fullpath = "userData/matiere/" + path;
        
        if (fs.existsSync(fullpath)) {
            let ret = fs.readdirSync(fullpath);
            return ret;
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

module.exports = ListDir;