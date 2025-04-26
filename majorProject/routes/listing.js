const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const listingValidate=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
     next(new ExpressError(400,error));
  }else{
    next();
  }
};

// index route 
router.get("/", wrapAsync(async (req, res, next) => {
  let alllisting = await listing.find({});
  if (alllisting.length === 0) {
    next(new ExpressError(404, "No listings found!"));
  }
  res.render("./listings/index.ejs", { alllisting });
}));


//create route
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("./listings/new.ejs");

});
// show route
router.get("/:id",wrapAsync(async(req,res,next)=>{
  let {id}=req.params;
  const listingById=await listing.findById(id).populate("reviews");
  if (!listingById) {
    next(new ExpressError(404 ,"Listing not found!"));
  }
  res.render("./listings/show.ejs",{listingById});
}));


router.post("/",isLoggedIn,listingValidate,wrapAsync(async(req,res,next)=>{
  const  newListing=new listing(req.body.listing);
   await newListing.save();
   req.flash("success","New Listing created");
   res.redirect("/listing");
}));


// //edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res,next)=>{
  let {id}=req.params;
  const listingById=await listing.findById(id);
  if (!listingById) {
    next(new ExpressError(404 ,"Listing not found!"));
  }
  res.render("./listings/edit.ejs",{listingById});
}));


router.put("/:id",isLoggedIn, listingValidate,wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (!updatedListing) {
    return next(new ExpressError(404, "Listing not found!"));
  }
  req.flash("success","listing updated");
  res.redirect(`/listing/${id}`);
}));


//delete route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return next(new ExpressError(404, "Listing not found!"));
  }
  req.flash("success","Listing deleted");
  res.redirect("/listing");
}));

module.exports=router;