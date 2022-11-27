
const Exit = (code = 0, callback) => {
    console.log('Exiting.')
    if (callback)
        callback()
    process.exit(code)
}

module.exports = Exit