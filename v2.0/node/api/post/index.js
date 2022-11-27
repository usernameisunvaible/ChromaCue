const express = require('express');

const post_route = express.Router()
post_route.post("/", require("./listPost"));
// post_route.post("/leds", require("./postStaticColor"));
post_route.post("/devices", require("./devices"));
module.exports = post_route;