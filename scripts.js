// This file should only contain functions that aren't in other modules

// Keep the resetHighlighting function
function resetHighlighting() {
    if (stateLayer) {
        stateLayer.setStyle({
            color: '#3388ff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2,
            fillColor: '#add8e6'
        });
    }
}

// Add utility function for merging geometries
function mergeGeometries(features) {
    // Simple merge - this would need a proper implementation
    // based on your GeoJSON structure
    return {
        type: 'MultiPolygon',
        coordinates: features.map(f => f.geometry.coordinates)
    };
}

// Utility to clear map layers
function clearLayers() {
    if (stateLayer) {
        stateLayer.clearLayers();
    }
}

// Function to update the map with search results
function updateMapForSearchResults(features) {
    clearLayers();
    
    const searchLayer = L.geoJSON(features, {
        style: {
            color: '#e74c3c',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.4,
            fillColor: '#f39c12'
        },
        onEachFeature: (feature, layer) => {
            layer.bindTooltip(`<div class="custom-tooltip"><b>${feature.properties.wardname}</b></div>`, {
                sticky: true,
                direction: 'top',
                offset: [0, -5],
                opacity: 1,
                className: 'custom-tooltip'
            });
        }
    }).addTo(window.map);
    
    window.map.fitBounds(searchLayer.getBounds());
}

export { resetHighlighting, mergeGeometries, clearLayers, updateMapForSearchResults };