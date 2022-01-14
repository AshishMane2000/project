const express = require('express')
const router = express.Router();
const ExpressError = require('../utils/ExpressError')
 
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const { isloggedin, validateCampground, isAuthor } = require('../middleware')
const { campgroundSchema } = require('../schemas.js');

const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const {storage}=require('../cloudinary');
const campground = require('../models/campground');
const upload = multer({ storage})

  
router.get('/:id/create-checkout-session',isloggedin,campgrounds.checkout);



 router.route('/')
    .get( catchAsync(campgrounds.index))
    .post(  isloggedin, upload.array('image'), validateCampground,catchAsync(campgrounds.createCampground))
    
router.get('/new', isloggedin, campgrounds.renderNewForm)
 
 router.get('/paymentsuccessfull',(req,res)=>{
    res.render('campgrounds/paymentsuccess')
    
 })
 router.post('/search',async(req,res)=>{
     const searchterm = req.body.search;
      const campgrounds = await Campground.find( {title: {$regex: searchterm, $options: "i"} })
     res.render('campgrounds/showsearched', {campgrounds, searchterm})
 })

router.route('/:id')
    .get(  catchAsync(campgrounds.showCampground))
    .put(  isloggedin, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
    .delete( isloggedin, isAuthor, catchAsync(campgrounds.deleteCampground))
  
router.get('/:id/edit', isloggedin, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;