const express = require('express')
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const {validateReview,isloggedin,isreviewAuthor}=require('../middleware')

const { reviewSchema } = require('../schemas.js')
const Review = require('../models/review')
const Campground = require('../models/campground')
const reviews= require('../controllers/reviews')

router.post('/', isloggedin,validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isloggedin,isreviewAuthor, catchAsync(reviews.deleteReview))

 
module.exports=router;