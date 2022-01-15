const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.createCampground = async (req, res, next) => {
     const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
     req.flash('success', 'Successfully made new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { campground })
}
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Campground Not Found !')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...images)
    await campground.save();
    if (req.body.deleteImages) {
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground Deleted!')
    res.redirect('/campgrounds')
}
const stripe = require('stripe')('sk_test_51KGFPpSGSehivkjOtCNGwJePOzN0OCNxCPQfyI7NMf5JJFhvHevkxhPoDiBRg0oMMy0GeJy4ivLh4Az6phLgT10M00gUslTLx3')

module.exports.checkout= async (req, res) => {
    const result = await Campground.findById(req.params.id);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'INR',
          product_data: {
            name: result.title,
             
          },
          unit_amount: result.price*100,
        },
        quantity:1
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/campgrounds/paymentsuccessfull',
    cancel_url: 'https://example.com/cancel',
  });

  res.redirect(303, session.url);
//   res.send("successssssssssss");
}