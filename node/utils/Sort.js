const compare = require('alphanumeric-sort').compare;

//Sort an array and get an array of the index in order
const Sort = (arr, key = "index") => {

    try {
        let out = []
        let arrCp = []

        if (key == "array") {
            arr.sort(compare);
            return arr;
        }
        if (key == "index") {
            for (let i = 0; i < arr.length; ++i) {
                arrCp.push(arr[i]);
            }
            arr.sort(compare);
            for (let i = 0; i < arr.length; ++i) {
                out.push(arrCp.indexOf(arr[i]))
            }
            return out;
        }
    } catch (err) {
        throw err;
    }
    
}

module.exports = Sort;