const express = require('express');


const get_route = express.Router()
get_route.get("/", require("./listGet"));
get_route.get("/devices", require("./devices"));

module.exports = get_route;