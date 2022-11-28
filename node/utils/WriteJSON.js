const fsp = require('fs/promises');

//Write json in a file
const WriteJSON = (path, data) => {
    try {
        let fullpath = path;
       
        fsp.writeFile(fullpath ,JSON.stringify(data, null, "\t"));
        
    } catch (err) {
        throw err;
    }
}

module.exports = WriteJSON;