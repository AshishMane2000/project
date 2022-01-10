const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '619129724c8ed6fd3b597806',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: ' this is our basic project which inclues the create,read,update and delete operations',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [

                { "url": "https://res.cloudinary.com/dxhcqc4kz/image/upload/v1637373424/YelpCamp/saqgjztcbtbavw4cnfrs.jpg", "filename": "YelpCamp/saqgjztcbtbavw4cnfrs" },
                { "url": "https://res.cloudinary.com/dxhcqc4kz/image/upload/v1637373772/YelpCamp/kihnz6n23a6gyp66si8t.jpg", "filename": "YelpCamp/kihnz6n23a6gyp66si8t" }

            ]
        })
        await camp.save();
    }
}
seedDB().then(() => mongoose.connection.close)

