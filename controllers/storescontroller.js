
const home = require("../models/home");
const Home=require("../models/home");
const User = require("../models/user");
const SearchLog = require("../models/searchLog");

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


// 🔍 Search homes by location, price range, and rating
exports.searchHomes = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, minRating } = req.query;
    const filter = {};

    if (location && location.trim() !== "") {
      filter.Location = { $regex: location.trim(), $options: "i" };
    }

    if (minPrice) {
      filter.pricepernight = { ...filter.pricepernight, $gte: parseInt(minPrice) };
    }

    if (maxPrice) {
      filter.pricepernight = { ...filter.pricepernight, $lte: parseInt(maxPrice) };
    }

    if (minRating) {
      filter.Rating = { $gte: parseFloat(minRating) };
    }

    console.log("🔍 Filter Applied:", filter);

    const homes = await Home.find(filter);

    // ✅ Save search preferences for recommendation
    if (req.session && req.session.user) {
      req.session.lastSearch = { location, minPrice, maxPrice, minRating };
      console.log("✅ Saved user preferences:", req.session.lastSearch);
    }

    res.render("store/search", {
      pageTitle: "Search Results",
      Registration: homes,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });

  } catch (error) {
    console.error("❌ Error during search:", error);
    res.status(500).render("store/error", {
      pageTitle: "Error Searching Homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  }
};



exports.getRecommendedHomes = async (req, res) => {
  try {
    const userId = req.session.user?._id;

    if (!userId) {
      // Unauthenticated users → top-rated
      const homes = await Home.find().sort({ Rating: -1 }).limit(10);
      return res.render("store/recommended", {
        pageTitle: "Recommended Homes",
        homes,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        message: "Showing top-rated homes for new visitors."
      });
    }

    // Fetch user data + populate favourites/bookings
    const user = await User.findById(userId)
      .populate("favourite")
      .populate("bookings.home");

    const preferences = req.session.lastSearch || {};
    const bookedHomes = user.bookings.map(b => b.home).filter(Boolean);
    const favHomes = user.favourite;

    // --- Combine data for weights ---
    const bookingIds = new Set(bookedHomes.map(h => h._id.toString()));
    const favIds = new Set(favHomes.map(h => h._id.toString()));

    const allHomes = await Home.find();

    // Define weights
    const bookingWeight = 0.5;
    const favWeight = 0.3;
    const searchWeight = 0.2;

    const searchLoc = preferences.location ? preferences.location.toLowerCase() : "";

    // Calculate scores
    const scoredHomes = allHomes.map(home => {
      const id = home._id.toString();
      let bookingMatch = bookingIds.has(id) ? 1 : 0;
      let favMatch = favIds.has(id) ? 1 : 0;
      let searchMatch = 0;

      // Check if search preferences match
      if (searchLoc && home.Location.toLowerCase().includes(searchLoc)) searchMatch += 0.7;
      if (preferences.minPrice && home.pricepernight >= preferences.minPrice) searchMatch += 0.2;
      if (preferences.maxPrice && home.pricepernight <= preferences.maxPrice) searchMatch += 0.1;

      const score =
        bookingWeight * bookingMatch +
        favWeight * favMatch +
        searchWeight * searchMatch;

      return { home, score };
    });

    // Sort homes by score (descending)
    const homes = scoredHomes
      .sort((a, b) => b.score - a.score)
      .filter(h => h.score > 0)
      .slice(0, 10)
      .map(h => h.home);

    // --- Fallback: if no matches found ---
    if (homes.length === 0) {
      const fallback = await Home.find().sort({ Rating: -1 }).limit(10);
      return res.render("store/recommended", {
        pageTitle: "Recommended Homes",
        homes: fallback,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        message: "Showing top-rated homes (no personalized matches yet)."
      });
    }

    // --- Render personalized results ---
    res.render("store/recommended", {
      pageTitle: "Recommended Homes",
      homes,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      message: "Homes recommended based on your bookings, favourites, and searches."
    });
  } catch (error) {
    console.error("❌ Error loading recommended homes:", error);
    res.status(500).render("store/error", {
      pageTitle: "Error Loading Recommendations",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  }
};
