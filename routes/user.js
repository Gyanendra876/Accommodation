const path=require('path');
const express=require('express');
const userRouter=express.Router();
const homescontroller= require("../controllers/storescontroller")
const {registration}=require("./host")
userRouter.get("/",homescontroller.getIndex);
userRouter.get("/home_list",homescontroller.getHomePage);
userRouter.get("/favourite-list",homescontroller.getfavouritelist);
userRouter.get("/bookings",homescontroller.getbookings);
userRouter.post("/bookings",homescontroller.postbookings);
userRouter.get("/home_list/:homeId",homescontroller.getdetails);
userRouter.post("/favourite-list",homescontroller.postAddFavourites);
userRouter.post("/favorites/delete/:homeId",homescontroller.postRemoveFromFavourite);
userRouter.get('/booking/paid', homescontroller.markBookingPaid);


module.exports=userRouter; 