document.addEventListener("DOMContentLoaded", () => {
    // Log values received from EJS
    console.log(" mapToken from map.js:", mapToken);
    console.log(" coordinates from map.js:", coordinates);

    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 10
    });

    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
});