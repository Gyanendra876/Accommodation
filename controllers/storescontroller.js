
const home = require("../models/home");
const Home=require("../models/home");
const User = require("../models/user");
exports.getIndex = (req, res, next) => {
    Home.find().then(Registration =>{
        res.render('store/index', { Registration, pageTitle: 'Staynest Home',isLoggedIn: req.isLoggedIn ,user:req.session.user});
    });
     
};

exports.getHomePage = (req, res, next) => {
    Home.find().then(Registration =>{
        res.render('store/home_list', { Registration, pageTitle: 'Staynest Home',isLoggedIn: req.isLoggedIn,user:req.session.user });
    });
     
};
exports.getbookings = async (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('bookings.home');
    res.render('store/bookings', { 
        bookings: user.bookings, 
        pageTitle: 'My bookings',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};
exports.postbookings = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    // Check if booking for this home already exists
     const alreadyBooked = user.bookings.some(b => b.home.toString() === homeId);
    if (!alreadyBooked) {
        user.bookings.push({ home: homeId, isPaid: false });
        console.log("Booking added to user");
        await user.save();
    }

    res.redirect("/bookings");
};
exports.markBookingPaid = async (req, res, next) => {
    const userId = req.session.user._id;
    const homeId = req.query.homeId;
    const paymentId = req.query.paymentId;
    const user = await User.findById(userId);

    const booking = user.bookings.find(b => b.home.toString() === homeId);
    if (booking) {
        booking.isPaid = true;
        booking.paymentId = paymentId;
        await user.save();
    }
    res.redirect('/bookings');
};
exports.getfavouritelist= async (req, res, next) => {
    const userId=req.session.user._id;
    const user =await User.findById(userId).populate('favourite');
    res.render('store/favourite-list',{
    favouriteHomes: user.favourite,
    pageTitle: 'My Favouritelist',
    isLoggedIn: req.isLoggedIn,
    user:req.session.user
});

};
exports.postAddFavourites= async(req,res,next)=>{
    const homeId=req.body.id;
    const userId=req.session.user._id;
    const user =await User.findById(userId);
    if(!user.favourite.includes(homeId)){
        user.favourite.push(homeId);
        await user.save();
    }
        res.redirect("/favourite-list");

   
   
};

exports.postRemoveFromFavourite=async(req,res,next)=>{
   const homeId=req.params.homeId;
   const userId=req.session.user._id;
   const user =await User.findById(userId);
   if(user.favourite.includes(homeId)){
       user.favourite=user.favourite.filter(fav => fav != homeId);
       await user.save();   
      
    }
    res.redirect("/favourite-list");
} 

exports.getdetails=(req, res, next) => {
    const homeId=req.params.homeId;
    Home.findById(homeId).then(home =>{
  
        if(!home){
            console.log("Home not Found")
            res.redirect("/home_list")
        }
        else{
        console.log("Home details Found ",home);
        res.render('store/home_detail', {home :home,pageTitle: 'Home Details',isLoggedIn: req.isLoggedIn,user:req.session.user });
        }
    });
 
};


