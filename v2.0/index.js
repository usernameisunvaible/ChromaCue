const express = require('express');
const app = express()


const post_route = require("./node/api/post")
const get_route = require("./node/api/get")
const delete_route = require("./node/api/delete")
const put_route = require("./node/api/put")

const sdk = require("./node/sdk/index")




sdk.com.init(() => {
    app.use(express.json())
    app.use("/", post_route)
    app.use("/", get_route)
    app.use("/", delete_route);
    app.use("/", put_route);
    app.use(express.static('static'));

    app.listen(8134, () => {
        console.log('Serveur à l écoute')
    })
})

// Chroma.util.init(() => {
    
//     
// })

