
const express=require('express');

const hostRouter=express.Router();
const homescontroller= require("../controllers/hostcontrollers")
hostRouter.get("/add-home",homescontroller.getAddHome);

hostRouter.post("/add-home",homescontroller.postAddHome);
hostRouter.get("/hosthome_list",homescontroller.getHostHomes);
hostRouter.get("/edit-home/:homeId",homescontroller.getEditHome);
hostRouter.post("/delete-item/:homeId",homescontroller.postDeleteHome);
hostRouter.post("/edit-home",homescontroller.postEditHome )


module.exports=hostRouter;
