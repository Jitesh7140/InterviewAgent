const express = require("express");
const route = express.Router();
const UserController = require("../controller/UserController");
const isAuth = require("../middlewares/isAuth")
 
route.get("/getUser",isAuth, UserController.getUser);



module.exports = route;
