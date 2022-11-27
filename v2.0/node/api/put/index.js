const express = require('express');


const put_route = express.Router()
put_route.put("/", require("./listPut"));
put_route.put("/leds", require("./leds"));
put_route.put("/devices", require("./devices"));

module.exports = put_route;