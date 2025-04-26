const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const review=require("../models/review.js");
const listing=require("../models/listing.js");



const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
     next(new ExpressError(400,error));
  }else{
    next();
  }
};



router.post("/",validateReview,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  console.log(id);
  let listingById=await listing.findById(id);
  let newReview=new review(req.body.review);
  listingById.reviews.push(newReview);
  
  await newReview.save();
  await listingById.save();
  req.flash("success","New review created");
  res.redirect(`/listing/${id}`);
}));

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
   await review.findByIdAndDelete(reviewId);
   await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   req.flash("success","review deleted");
   res.redirect(`/listing/${id}`);
}));

module.exports=router;
