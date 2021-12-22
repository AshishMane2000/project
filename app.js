if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}
// console.log(process.env.CLOUDINARY_SECRET)
// console.log(process.env.CLOUDINARY_KEY)
 
const express = require('express')
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash=require('connect-flash')
const campgroundsroutes = require('./routes/campgrounds')
const reviewsroutes = require('./routes/reviews')
const userroutes = require('./routes/user')
const passport = require('passport')
const localstrategy = require('passport-local')
const User = require('./models/user')

var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()))//method coming from passport

passport.serializeUser(User.serializeUser())//save user
passport.deserializeUser(User.deserializeUser())//unsave user

const mongoose = require('mongoose')
const Campground = require('./models/campground');
const { Strategy } = require('passport-local');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true,
    // useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})
app.engine('ejs', ejsMate) 
app.set('view engine', 'ejs') 
app.set('views', path.join(__dirname, 'views')) 
app.use(express.urlencoded({ extended: true }))
 
app.get('/', (req, res) => {
    res.render('home')
})

app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.use('/',userroutes)
app.use('/campgrounds', campgroundsroutes)
app.use('/campgrounds/:id/reviews', reviewsroutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 400))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

