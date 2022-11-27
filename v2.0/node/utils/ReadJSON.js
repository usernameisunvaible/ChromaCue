const fs = require('fs');

//Read a json
const ReadJSON = (path) => {
    try {
        let fullpath =  path;
        if (fs.existsSync(fullpath)) {
            let obj = fs.readFileSync(fullpath, 'utf8');
            let ret = JSON.parse(obj);
            return ret;
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

module.exports = ReadJSON;