const express = require("express");
const route = express.Router();
const interviewController = require("../controller/InterViewController");
const isAuth = require("../middlewares/isAuth")
const upload = require("../middlewares/multer");    
 
route.post("/resume",isAuth,upload.single("resume"), interviewController.analyzResume);
route.post("/generate-questions",isAuth,interviewController.generateQuestions);
route.post("/submit-answer",isAuth,interviewController.submitAnswer);
route.post("/finish",isAuth,interviewController.finishInterview);



module.exports = route;
