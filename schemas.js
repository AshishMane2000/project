//this file includes joi validation schema...

const Joi = require('joi')
module.exports.campgroundSchema = Joi.object({
    //this is not mongoose schema its joi schema to validate
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
});
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
})