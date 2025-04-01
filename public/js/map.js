mapboxgl.accessToken = 'MAP_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 10
});

console.log(coordinates);

const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);