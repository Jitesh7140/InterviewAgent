const express = require("express");
const route = express.Router();
const AuthController = require("../controller/AuthController");

route.post("/googleAuth", AuthController.googleAuth);
route.get("/logout", AuthController.logout);



module.exports = route;
