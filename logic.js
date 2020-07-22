var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  //console.log(data.features)
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function MagnitudeColor(Magnitude){
    var color = null;
    switch(true){
      case Magnitude <= 2.5:
        color = '#548000'
        break;
      case Magnitude >= 2.5 && Magnitude <= 5.4:
        color = '#8E9F00'
        break;
      case Magnitude >= 5.5 && Magnitude <= 6.0:
        color = '#DFA300'
        break;
      case Magnitude >= 6.1 && Magnitude <= 6.9:
        color = '#FF8200'
        break;
      case Magnitude >= 7.0 && Magnitude <= 7.9:
        color = '#FF6822'
        break;
      case Magnitude >= 8.0:
        color = '#FE0000'
        break;
    }
    console.log(color)
    return color
  }

  function createCircleMarker( feature, latlng ){
    // Change the values of these options to change the symbol's appearance
    let options = {
      radius: feature.properties.mag * 5,
      fillColor: MagnitudeColor(feature.properties.mag),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    return L.circleMarker( latlng, options ).bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");;
  }
  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    //onEachFeature: onEachFeature
    pointToLayer: createCircleMarker
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,2.5,5.4,6.0,6.9,8.0];
    var colors = ['#548000','#8E9F00','#DFA300','#FF8200','#FF6822','#FE0000'];

    div.innerHTML = '<h1> Manitute scale </h1>'
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
          limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
}
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}
 
