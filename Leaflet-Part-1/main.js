
// Create a map centered at a neutral location
let myMap = L.map("map").setView([0, 0], 2);

//Add a tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Store API endpoint as queryURL
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

//Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    plotEarthquakes(data);
})

//Function to get color based on depth
function getColor(depth) {
return depth > 500 ? '#800026' :
    depth > 300 ? '#BD0026' :
    depth > 200 ? '#E31A1C' :
    depth > 100 ? '#FC4E2A' :
    depth > 50  ? '#FD8D3C' :
    depth > 20  ? '#FEB24C' :
    depth > 10  ? '#FED976' :
                  '#FFEDA0';
};


//Function to plot earthquakes on the map
function plotEarthquakes(data) {
    //Loop through each feature in the GeoJSON data
    data.features.forEach(function(feature) {
        let coords = feature.geometry.coordinates;
        let lon = coords[0];
        let lat = coords[1];
        let depth = coords[2];
        let magnitude = feature.properties.mag;
        let place = feature.properties.place;

        // Create a popup with earthquake details
        let popupText = `<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${place}<br><b>Depth:</b> ${depth} km`;

        // Add a circle marker to the map
        L.circleMarker([lat, lon], {
            radius: magnitude * 2,
            color: getColor(depth),
            fillColor: getColor(depth),
            fillOpacity: 0.6
        }).bindPopup(popupText).addTo(myMap);
    });

}

//Add a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    var depths = [0, 10, 20, 50, 100, 200, 300, 500];
    var labels = [];

    //Loop through depth intervals to generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;

};

legend.addTo(myMap);