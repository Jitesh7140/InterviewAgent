const express = require("express");
const route = express.Router();
const interviewController = require("../controller/InterViewController");
const isAuth = require("../middlewares/isAuth")
const upload = require("../middlewares/multer");
 
route.post("/resume",isAuth,upload.single("resume"), interviewController.analyzResume);



module.exports = route;
