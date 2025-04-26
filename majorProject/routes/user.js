const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{

        let {username,password,email}=req.body;
       const newUser=new User({email,username});
       let registeredUser=await User.register(newUser,password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to UrbanStay");
       res.redirect("/listing");
       });
       
       
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate('local', { 
    failureRedirect: '/login' , 
    failureFlash:true }),async(req,res)=>{
        req.flash("success","Welcome back to UrbanStay");
        let redirect=res.locals.redirectUrl||"/listing";
        res.redirect(redirect);
    });


router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listing");
    });
});
module.exports=router;