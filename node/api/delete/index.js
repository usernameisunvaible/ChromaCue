const express = require('express');

const delete_route = express.Router()
delete_route.delete("/", require("./listDelete"));
delete_route.delete("/close", require("./close"));


module.exports = delete_route;