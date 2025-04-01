// filepath: c:\Major Projects\public\js\map.js

document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = mapToken; // Use the token passed from the server

    // Ensure coordinates is an array [lng, lat]
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        console.error("Invalid coordinates:", coordinates);
        return;
    }

    const map = new mapboxgl.Map({
        container: 'map', // Matches the id in your HTML
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates, // Use the coordinates passed from the server
        zoom: 10
    });

    // Add a marker at the location
    new mapboxgl.Marker()
        .setLngLat(coordinates) // Ensure coordinates is valid
        .addTo(map);
});