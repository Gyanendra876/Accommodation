const {check ,validationResult}=require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const user = require("../models/user");
const { use } = require("../routes/auth");
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isLoggedIn:false,
        errors :[],
        oldInput :{email:" "},
        user:{},
    });
     
};

exports.getSignup = (req, res, next) => {
    // req.isLoggedIn=true;
    //req.session.isLoggedIn=true;
    //res.cookie("isLoggedIn",true);
     res.render('auth/signup',{
        pageTitle:'Signup',
        isLoggedIn:false,
        errors :[],
        oldInput :{firstName: "",lastname:" ",email:" ",password: " ",userType :" "},
        user:{},
     });
      
 };
 exports.postSignup = [
    check('firstName')
    .trim()
    .isLength({min:2})
    .withMessage('First name must be at least 2 characters long')
    .matches(/^[a-zA-Z]+$/)
    .withMessage('First name must contain only letters'),
    check('lastname') 
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Last name must contain only letters'),   
    
    check("email")
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
    check("password")
    .isLength({min:8})
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)   
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/)   
    .withMessage('Password must contain at least one special character')
    .trim(),
    check("confirmpassword")
    .trim()
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    check("userType")
    .notEmpty()
    .withMessage('Please select a user type')
    .isIn(['host', 'guest'])
    .withMessage('Invalid user type selected'),
    check("terms")
    .notEmpty()
    .withMessage('Please accept the terms and conditions')
    .custom((value, {req}) => {
        if(value !== 'on'){
            throw new Error('You must accept the terms and conditions');
        }
        return true;
    }),


    (req, res, next) => {
    const {firstName,lastname,email,password,userType}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
            pageTitle:'Signup',
            isLoggedIn:false,
            errors:errors.array().map(error => error.msg),
            oldInput:{
                firstName:firstName,
                lastname:lastname,
                email:email,
                password:password,
                userType:userType
            },
            user:{},
        });
    }
    bcrypt.hash(password,12).then(hashedPassword => {
    const user= new User({firstName,lastname,email,password:hashedPassword,userType});
    return user.save();
    })
    .then(()=>{
        res.redirect('/login');
    }).catch(err =>{
        return res.status(422).render('auth/signup',{
            pageTitle:'Signup',
            isLoggedIn:false,
            errors:[err.message],
            oldInput:{
                firstName:firstName,
                lastname:lastname,
                email:email,
                password:password,
                userType:userType,
                user:{},
            }
        });
    });    
 }];
exports.postLogin = async (req, res, next) => {
    // req.isLoggedIn=true;
    const {email,password}=req.body;
    const user= await User.findOne({email:email})
    if(!user){
        return res.status(422).render("auth/login",{
        pageTitle:'Login',
        isLoggedIn:false,
        errors:["User Doesnot exists"],
        oldInput:{
            email:email,},
        user:{},
        });
    }
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(422).render("auth/login",{
            pageTitle:'Login',
            isLoggedIn:false,
            errors:["Password is incorrect"],
            oldInput:{email:email},
            user:{},
            });
    }
    req.session.isLoggedIn=true;
    req.session.user=user;
    await req.session.save(); 
    //res.cookie("isLoggedIn",true);
     res.redirect('/');
      
 };
exports.postLogout= (req, res, next) => {
    // req.isLoggedIn=true;

    req.session.destroy(() => {
        res.redirect('/login');
    })
    
      
 };
