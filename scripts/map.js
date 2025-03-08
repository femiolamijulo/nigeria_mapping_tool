import { initializeSidebar } from './sidebar.js';
import { resetHighlighting, mergeGeometries, clearLayers, updateMapForSearchResults } from './scripts.js';

/**
 * Map-related functionality for Nigeria Map Tool
 */

// Make these functions available globally
window.resetHighlighting = resetHighlighting;
window.mergeGeometries = mergeGeometries;
window.clearLayers = clearLayers;
window.updateMapForSearchResults = updateMapForSearchResults;

// Ensure showNotification is defined
window.showNotification = function(message, type = 'info') {
    // ...existing code from sidebar.js...
};

// Initialize the map
const map = L.map('map', {
    zoomControl: true,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 120,
    attributionControl: true
}).setView([9.0820, 8.6753], 6);

window.map = map;  // Make map available globally

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Global variables
window.wardGeoJSON;
window.stateLayer;

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    
    // Load your GeoJSON data here
    fetch('ward_geojson.geojson')
        .then(response => response.json())
        .then(data => {
            window.wardGeoJSON = data;
            // Now trigger state dropdown population since data is available
            document.dispatchEvent(new CustomEvent('dataLoaded'));
            
            // Hide loading overlay
            document.getElementById('loading-overlay').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('loading-overlay').style.display = 'none';
            }, 300);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Hide loading overlay with an error message
            document.getElementById('loading-overlay').innerHTML = 
                '<div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">' +
                '<div style="color: #e74c3c; font-size: 24px;"><i class="fas fa-exclamation-triangle"></i></div>' +
                '<p>Error loading map data. Please try again later.</p>' +
                '<button onclick="location.reload()">Reload</button>' +
                '</div>';
        });
});