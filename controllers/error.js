/*exports.geterror=(req,res,next)=>{
    res.status(404).render('error',{pageTitle:'Page Not Found',
        isLoggedIn: req.isLoggedIn,
        user:req.sesion.user
    });
        
};*/
exports.geterror = (req, res, next) => {
    res.render('error', {
        user: req?.user || null
    });
};