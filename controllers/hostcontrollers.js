/*const fav =new Favourite(homeId);
    fav.save().then(result =>{
        console.log('Fav added : ',result);

    }).catch(err =>{
        console.log("error",err);
    }).finally(() =>{
        res.redirect("/favourite-list");
    })*/
const Home=require("../models/home");
const user = require("../models/user");
const hostRouter = require("../routes/host");
exports.getAddHome = (req, res, next) => {
  

    console.log(req.url, req.method);
    res.render('host/edit-homes', { 
        pageTitle: 'ADD HOME',
        editing: false,
        isLoggedIn: req.isLoggedIn,
        user:req.session.user,

    
     });
};

exports.postAddHome = (req, res, next) => {
    const {houseName,pricepernight,Location,Rating,photourl,description}=req.body;
    const home=new Home({houseName,pricepernight,Location,Rating, photourl,description });
    home.save().then(()=>{
        console.log('HOME')
    });
    res.render('host/user2', { 
        pageTitle: 'HOME Added succesfully',
        isLoggedIn: req.isLoggedIn, 
        user:req.session.user});
};
exports.getHostHomes = (req, res, next) => {
    Home.find().then(Registration =>{
        res.render('host/hosthome_list', { Registration, pageTitle: 'Host_Homelist' ,isLoggedIn: req.isLoggedIn,user:req.session.user});
    })
};
exports.getEditHome =(req, res, next) => {
    const homeId=req.params.homeId;
    const editing =req.query.editing ==="true";
    console.log("params.homeId", homeId);
     console.log("query.editing", editing);
 
    Home.findById(homeId).then(home =>{
     ;
        if(!home){
            console.log("Home not found for editing");
            return res.redirect("/host/hosthome_list");
        }
        console.log("Home found for editing",home)
        console.log(req.url, req.method);
        res.render('host/edit-homes', { 
        pageTitle: 'Edit HOME' ,
        editing: editing,
        home: home, 
        isLoggedIn: req.isLoggedIn,
        user:req.session.user,
            
    });
    });
}
exports.postEditHome = (req, res, next) => {
   // debug
    const {houseName,pricepernight,Location,Rating,photourl,id,description}=req.body;
    Home.findById(id).then((home)=>{
    home.houseName=houseName;
    home.pricepernight=pricepernight;
    home.Location=Location;
    home.Rating=Rating;
    home.photourl=photourl;
    home.description=description;
    home.save().then(result =>{
        console.log('edited',result)
    }).catch(err =>{
        console.log("error while finding home");
    })
    res.redirect("/host/hosthome_list");
   }).catch(err =>{
    console.log("error while finding home",err);
   });
   
   
   
};

exports.postDeleteHome = (req, res, next) => {
    const homeId=req.params.homeId;
    console.log('come to delete',homeId);
    Home.findByIdAndDelete(homeId).then(() =>{
      res.redirect("/host/hosthome_list");
    }).catch(error =>{
        console.log('Error deleting',error);
    })
   
};   




