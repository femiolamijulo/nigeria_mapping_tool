import { initializeSidebar } from './sidebar.js';
import { resetHighlighting, mergeGeometries, clearLayers, updateMapForSearchResults } from './scripts.js';
import { showNotification } from './utils.js';
import MapManager from './MapManager.js';

/**
 * Map-related functionality for Nigeria Map Tool
 */

// Initialize the map using MapManager
const mapManager = MapManager.getInstance();
const map = mapManager.getMap();

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    
    // Load your GeoJSON data here
    fetch('ward_geojson.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.features || !Array.isArray(data.features)) {
                throw new Error("Invalid GeoJSON structure: 'features' is missing or not an array.");
            }

            mapManager.setWardGeoJSON(data);
            document.dispatchEvent(new CustomEvent('dataLoaded'));

            document.getElementById('loading-overlay').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('loading-overlay').style.display = 'none';
            }, 300);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            document.getElementById('loading-overlay').innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="color: #e74c3c; font-size: 24px;"><i class="fas fa-exclamation-triangle"></i></div>
                    <p>Error loading map data: ${error.message}</p>
                    <button onclick="location.reload()">Reload</button>
                </div>`;
        });
});