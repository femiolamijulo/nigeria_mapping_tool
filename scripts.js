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

export { resetHighlighting, mergeGeometries, clearLayers };