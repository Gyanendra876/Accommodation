const path=require('path');
const express=require('express');
const authRouter=express.Router();
const authcontroller= require("../controllers/authcontroller")
authRouter.get("/login",authcontroller.getLogin);
authRouter.post("/login",authcontroller.postLogin);
authRouter.post("/logout",authcontroller.postLogout);
authRouter.get("/Signup",authcontroller.getSignup);
authRouter.post("/Signup",authcontroller.postSignup);

module.exports=authRouter; 