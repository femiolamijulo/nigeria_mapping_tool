import { filterStates, filterLGAs, filterWards, getLGAsByState, getWardsByLGA } from './filters.js';

let map, wardGeoJSON, stateLayer, lgaLayer, wardLayer;
let currentState = null;
let currentLGA = null;

// Initialize the map and search functionality
async function initializeMap() {
    // Create map centered on Nigeria
    map = L.map('map').setView([9.0820, 8.6753], 6);
    
    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Load GeoJSON data
    try {
        const response = await fetch('ward_geojson.geojson');
        wardGeoJSON = await response.json();
        
        // Initialize search controls
        initializeSearchControls();
        
        // Display states by default
        displayStates();
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
    }
}

// Initialize search controls (state, LGA, ward dropdowns)
function initializeSearchControls() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <select id="state-select">
                <option value="">-- Select State --</option>
            </select>
            <select id="lga-select" disabled>
                <option value="">-- Select LGA --</option>
            </select>
            <select id="ward-select" disabled>
                <option value="">-- Select Ward --</option>
            </select>
            <button id="reset-search">Reset</button>
        </div>
    `;
    
    document.body.appendChild(searchContainer);
    
    // Populate state dropdown
    const stateSelect = document.getElementById('state-select');
    const states = filterStates(wardGeoJSON.features);
    states.sort((a, b) => a.name.localeCompare(b.name));
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.name;
        option.textContent = state.name;
        stateSelect.appendChild(option);
    });
    
    // Add event listeners
    stateSelect.addEventListener('change', handleStateChange);
    document.getElementById('lga-select').addEventListener('change', handleLGAChange);
    document.getElementById('ward-select').addEventListener('change', handleWardChange);
    document.getElementById('reset-search').addEventListener('click', resetSearch);
}

// Handle state selection change
function handleStateChange() {
    const stateSelect = document.getElementById('state-select');
    const lgaSelect = document.getElementById('lga-select');
    const wardSelect = document.getElementById('ward-select');
    
    // Clear previous selections
    lgaSelect.innerHTML = '<option value="">-- Select LGA --</option>';
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    wardSelect.disabled = true;
    
    currentState = stateSelect.value;
    
    if (currentState) {
        // Enable LGA select and populate options
        lgaSelect.disabled = false;
        const lgas = getLGAsByState(wardGeoJSON.features, currentState);
        lgas.sort((a, b) => a.name.localeCompare(b.name));
        
        lgas.forEach(lga => {
            const option = document.createElement('option');
            option.value = lga.name;
            option.textContent = lga.name;
            lgaSelect.appendChild(option);
        });
        
        // Update map to show selected state
        displaySelectedState(currentState);
    } else {
        // Reset to showing all states
        lgaSelect.disabled = true;
        displayStates();
    }
}

// Handle LGA selection change
function handleLGAChange() {
    const lgaSelect = document.getElementById('lga-select');
    const wardSelect = document.getElementById('ward-select');
    
    // Clear previous selections
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    
    currentLGA = lgaSelect.value;
    
    if (currentLGA) {
        // Enable ward select and populate options
        wardSelect.disabled = false;
        const wards = getWardsByLGA(wardGeoJSON.features, currentLGA, currentState);
        
        wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.properties.wardname;
            option.textContent = ward.properties.wardname;
            wardSelect.appendChild(option);
        });
        
        // Update map to show selected LGA
        displaySelectedLGA(currentLGA);
    } else {
        // Reset to showing selected state
        wardSelect.disabled = true;
        displaySelectedState(currentState);
    }
}

// Handle ward selection change
function handleWardChange() {
    const wardSelect = document.getElementById('ward-select');
    const selectedWard = wardSelect.value;
    
    if (selectedWard) {
        // Update map to show selected ward
        displaySelectedWard(selectedWard);
    } else {
        // Reset to showing selected LGA
        displaySelectedLGA(currentLGA);
    }
}

// Reset search and map display
function resetSearch() {
    document.getElementById('state-select').value = '';
    document.getElementById('lga-select').value = '';
    document.getElementById('ward-select').value = '';
    
    document.getElementById('lga-select').disabled = true;
    document.getElementById('ward-select').disabled = true;
    
    currentState = null;
    currentLGA = null;
    
    displayStates();
}

// Display functions for map
function displayStates() {
    clearLayers();
    
    stateLayer = L.geoJSON(null, {
        style: {
            color: '#3388ff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>${feature.properties.statename}</b>`);
        }
    }).addTo(map);
    
    // Create state polygons by merging ward geometries
    const states = filterStates(wardGeoJSON.features);
    states.forEach(state => {
        const stateFeatures = filterWards(wardGeoJSON.features, { statename: state.name });
        if (stateFeatures.length > 0) {
            const stateGeojson = {
                type: 'Feature',
                properties: { statename: state.name, statecode: state.code },
                geometry: mergeGeometries(stateFeatures)
            };
            stateLayer.addData(stateGeojson);
        }
    });
    
    // Fit map to all states
    stateLayer.getBounds().isValid() && map.fitBounds(stateLayer.getBounds());
}

// Helper function to display selected entities and additional UI handlers
function displaySelectedState(stateName) {
    // Implementation similar to displayStates but filtered to the selected state
}

function displaySelectedLGA(lgaName) {
    // Implementation to show only the selected LGA
}

function displaySelectedWard(wardName) {
    // Implementation to show only the selected ward
}

// Helper function to clear map layers
function clearLayers() {
    if (stateLayer) map.removeLayer(stateLayer);
    if (lgaLayer) map.removeLayer(lgaLayer);
    if (wardLayer) map.removeLayer(wardLayer);
}

// Helper function to merge geometries for state/LGA display
function mergeGeometries(features) {
    // Implementation to merge multiple geometries into one
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);