var fs=require('fs');

const CpPast = (source, out, outName) => {
    let dir = "userData/matiere/"
    fs.copyFile(dir + source, dir + out + outName, (err) => {
        if (err) 
            throw err;
    });
}

module.exports = CpPast;