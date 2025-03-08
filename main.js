import { initializeSidebar } from './sidebar.js';
import { resetHighlighting, mergeGeometries, clearLayers, updateMapForSearchResults } from './scripts.js';
import { showNotification } from './utils.js';  // ✅ Import notification utility
import MapManager from './MapManager.js';  

// Initialize the MapManager Singleton
const mapManager = new MapManager();
const map = mapManager.getMap();

// Attach functions globally (if necessary)
window.resetHighlighting = resetHighlighting;
window.mergeGeometries = mergeGeometries;
window.clearLayers = clearLayers;
window.updateMapForSearchResults = updateMapForSearchResults;

// ✅ Remove unnecessary global variables
// window.wardGeoJSON;
// window.stateLayer;

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();

    // Load GeoJSON data using MapManager
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

            mapManager.setGeoJSON(data); // ✅ Store in MapManager instead of `window.wardGeoJSON`
            document.dispatchEvent(new CustomEvent('dataLoaded'));

            // Hide loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.style.opacity = 0;
            setTimeout(() => (loadingOverlay.style.display = 'none'), 300);
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

// ✅ Attach event listener correctly for FAB Reset Button
document.getElementById('fab-reset').addEventListener('click', () => {
    resetHighlighting();  // ✅ No need for `window.resetHighlighting()`
    showNotification('Map reset successfully', 'success');
});
