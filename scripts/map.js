/**
 * Map-related functionality for Nigeria Map Tool
 */

// Initialize the map
const map = L.map('map').setView([9.0820, 8.6753], 6);

// Load GeoJSON data
fetch('ward_geojson.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });

// This file can be used to add more map-specific functionality in the future
// Currently the search box functionality is handled in sidebar.js

export {};
