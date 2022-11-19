const fs = require('fs');

//Read a json
const exist = (path) => {
    try {
        let fullpath = "userData/matiere/" + path;
        if (fs.existsSync(fullpath)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw err;
    }
}

module.exports = exist;