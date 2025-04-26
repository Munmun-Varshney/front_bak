const express=require("express");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const expressSession=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const flash=require("connect-flash");
const app=express();
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
let MONGO_URL="mongodb+srv://varshneydeeksha71:munmun@cluster0.4qjgo.mongodb.net/wondolust?retryWrites=true&w=majority&appName=Cluster0";
async function main(){
       await mongoose.connect(MONGO_URL)
       
}
main()
.then(() => console.log('Connected! to db'))
.catch((err)=>console.log(err));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}

app.use(expressSession(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});


const listingRouter=require("./routes/listing.js");
app.use("/listing",listingRouter);

const reviewRouter=require("./routes/review.js");
app.use("/listing/:id/review",reviewRouter);

const userRouter=require("./routes/user.js");
app.use("/",userRouter);

app.use((err,req,res,next)=>{
  let{status=500,message="something went wrong!"}=err;
  // let message="something went wrong!";
 res.render("./listings/error.ejs",{status,message});
});


app.listen(8080,()=>{
    console.log("working");
});
app.get("/",(req,res)=>{
    res.redirect("/listing");
});