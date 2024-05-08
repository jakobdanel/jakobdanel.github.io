// Define the coordinates of the map's center
var mapCenter = [51.9619, 7.6257];

// Create the map
var map = L.map('map').setView(mapCenter, 13);

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

Stadia_AlidadeSmoothDark.addTo(map);

// Function to add markers to the map
function addMarkers(kiosks) {
    kiosks.forEach(function (kiosk, index) {
        var coordinates = kiosk.geometry.coordinates.reverse(); // Leaflet uses [lat, lng] format
        var name = kiosk.properties.name || 'Unnamed Kiosk'; // Check if kiosk has a name

        // Create a marker and bind a popup with kiosk information
        var marker = L.marker(coordinates)
            .addTo(map)
            .bindPopup('<b>' + name + '</b><br>' + getKioskInfo(kiosk.properties));

        // Add a label showing the index of the marker with custom styling
        let position = kiosk.properties.position;
        var label = L.divIcon({
            className: 'marker-label',
            html: '<span style="font-size: 20px; color: red; bold;">' + (position+1).toString() + '</span>'
        });
        marker.setIcon(label);
    });
}



// Function to get kiosk information for popup
function getKioskInfo(properties) {
    var info = '';
    for (var key in properties) {
        if (key !== 'name' && key !== 'amenity' && key !== 'shop' && key !== 'type') {
            info += key + ': ' + properties[key] + '<br>';
        }
    }
    return info;
}

// Read data from the static JSON file
fetch('kiosks_filtered.geojson')
    .then(response => response.json())
    .then(data => {
        const tsp = new TravellingSalesman(data);
        let result = tsp.solve("node/629637881");
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < data.features.length; j++) {
                if (data.features[j].id === result[i].id) {
                    data.features[j].properties.position = i;
                }
            }
        }
        console.log(data);
        addMarkers(data.features);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
