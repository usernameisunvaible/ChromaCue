const fsp = require('fs/promises');
const fs = require('fs');

//Write json in a file
const WriteJSON = (path, data) => {
    try {
        let fullpath = path;
       
        fsp.writeFile(fullpath, JSON.stringify(data));
        
    } catch (err) {
        throw err;
    }
}

module.exports = WriteJSON;