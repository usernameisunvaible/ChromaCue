//Remove from an array
const Remove = (arr, value) => {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

module.exports = Remove;