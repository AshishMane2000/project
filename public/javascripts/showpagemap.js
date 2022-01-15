 



// const goodCampground = JSON.parse(campground);

// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
//     center: goodCampground.geometry.coordinates, // starting position [lng, lat]
//     zoom: 5 // starting zoom
// });

// const Marker = new mapboxgl.Marker()
//     .setLngLat(goodCampground.geometry.coordinates)
//     .setPopup(
//         new mapboxgl.Popup({ offset: 25 })
//             .setHTML(
//                 `<h6>${goodCampground.title}</h6><p>${goodCampground.location}</p>`
//             )
//     )
//     .addTo(map)
    

 
 
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center:  campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


const Marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${ campground.title}</h6><p>${campground.location}</p>`
            )
    )
    .addTo(map)
    