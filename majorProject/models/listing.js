const mongoose=require("mongoose");
const review = require("./review");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: { 
            type: String, 
            default: "https://plus.unsplash.com/premium_photo-1744390859956-f70a9b1ab26d?q=80&w=1496&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
            set :v=>v===""?"https://plus.unsplash.com/premium_photo-1744390859956-f70a9b1ab26d?q=80&w=1496&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
      },
    price:{
        type:Number,
        default:0,
    },
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;