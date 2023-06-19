const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let map = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json(url).then(function(data) {
    console.log(data);
    mapFeatures(data.features);
});

function mapFeatures(features) {
    for (let feature in features) {
        let long = features[feature].geometry.coordinates[0];
        let lat = features[feature].geometry.coordinates[1];
        let depth = features[feature].geometry.coordinates[2];
        let magnitude = features[feature].properties.mag;
        let place = features[feature].properties.place;
        let title = features[feature].properties.title;
        let latLong = [lat, long];

    L.circle(latLong, {
        fillOpacity: 0.75,
        stroke: true,
        weight: 0.5,
        color: "black",
        fillColor: getColor(depth),
        radius: magnitude * 15000
    })
        .bindPopup(`<h2>${place}</h2><hr><p>${title}</p><br><p>Location: (${lat.toFixed(3)}, ${long.toFixed(3)})</p><br><p>Depth: ${depth}</p><br><p>Magnitude: ${magnitude}</p`)
        .addTo(map);
    };
};

const getColor = (d) => {
    return d > 90 ? "#EE6055" : 
    d > 70 ? "#FF9B85": 
    d > 50 ? "#FFD97D": 
    d > 30 ? "#FFCF56" : 
    d > 10 ? "#AAF683" : "#60D394";
};

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend');
    const grades = [-10, 10, 30, 50, 70, 90];
    const labels = ['<strong>Depth</strong>'];
    let from, to;
    let fillIn = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0";

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        div.innerHTML +=
        labels.push('<i style="background:' + getColor(from + 1) + '">' + fillIn + '</i>' +
        from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

