/**
 * Sidebar component for Nigeria Map Tool
 * Handles the collapsible sidebar and search filters
 */
import { filterStates, filterLGAs, filterWards, getLGAsByState, getWardsByLGA } from './scripts/filters.js';

function initializeSidebar() {
    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">Map Filters</div>
        <div class="search-box">
            <input type="text" id="search-input" placeholder="Type to search...">
            <div class="dropdown-container">
                <select id="state-select">
                    <option value="">-- Select State --</option>
                </select>
                <select id="lga-select" disabled>
                    <option value="">-- Select LGA --</option>
                </select>
                <select id="ward-select" disabled>
                    <option value="">-- Select Ward --</option>
                </select>
            </div>
            <button id="reset-search">Reset Filters</button>
        </div>
    `;
    
    // Create toggle button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    document.body.appendChild(sidebar);
    document.body.appendChild(toggleButton);
    
    // Toggle sidebar functionality
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        
        // Change icon based on sidebar state
        if (sidebar.classList.contains('open')) {
            toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            toggleButton.style.left = '310px';
        } else {
            toggleButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            toggleButton.style.left = '10px';
        }
    });
    
    // Show sidebar by default on larger screens
    if (window.innerWidth > 768) {
        sidebar.classList.add('open');
        toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        toggleButton.style.left = '310px';
    }
    
    // Populate state dropdown when data is available
    if (wardGeoJSON && wardGeoJSON.features) {
        populateStateDropdown();
        
        // Add event listeners for dropdowns
        document.getElementById('state-select').addEventListener('change', handleStateChange);
        document.getElementById('lga-select').addEventListener('change', handleLGAChange);
    }
    
    // Add text search event listener
    document.getElementById('search-input').addEventListener('input', handleSearchInput);
    
    // Add reset button functionality
    document.getElementById('reset-search').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('state-select').value = '';
        document.getElementById('lga-select').value = '';
        document.getElementById('ward-select').value = '';
        document.getElementById('lga-select').disabled = true;
        document.getElementById('ward-select').disabled = true;
        
        resetHighlighting();
    });
}

function populateStateDropdown() {
    const stateSelect = document.getElementById('state-select');
    const states = filterStates(wardGeoJSON.features);
    
    // Sort states alphabetically
    states.sort((a, b) => a.name.localeCompare(b.name));
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.name;
        option.textContent = state.name;
        stateSelect.appendChild(option);
    });
}

function handleStateChange(e) {
    const stateName = e.target.value;
    const lgaSelect = document.getElementById('lga-select');
    const wardSelect = document.getElementById('ward-select');
    
    // Reset lower level filters
    lgaSelect.innerHTML = '<option value="">-- Select LGA --</option>';
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    wardSelect.disabled = true;
    
    if (!stateName) {
        lgaSelect.disabled = true;
        return;
    }
    
    // Enable LGA select and populate
    lgaSelect.disabled = false;
    
    const lgas = getLGAsByState(wardGeoJSON.features, stateName);
    
    // Sort LGAs alphabetically
    lgas.sort((a, b) => a.name.localeCompare(b.name));
    
    lgas.forEach(lga => {
        const option = document.createElement('option');
        option.value = lga.name;
        option.textContent = lga.name;
        lgaSelect.appendChild(option);
    });
    
    // Update map to highlight the selected state
    updateMapForState(stateName);
}

function handleLGAChange(e) {
    const lgaName = e.target.value;
    const stateName = document.getElementById('state-select').value;
    const wardSelect = document.getElementById('ward-select');
    
    // Reset ward filter
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    
    if (!lgaName) {
        wardSelect.disabled = true;
        return;
    }
    
    // Enable ward select and populate
    wardSelect.disabled = false;
    
    const wards = getWardsByLGA(wardGeoJSON.features, lgaName, stateName);
    
    // Sort wards alphabetically
    wards.sort((a, b) => a.properties.wardname.localeCompare(b.properties.wardname));
    
    wards.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward.properties.wardname;
        option.textContent = ward.properties.wardname;
        wardSelect.appendChild(option);
    });
    
    // Update map to highlight the selected LGA
    updateMapForLGA(lgaName, stateName);
}

function updateMapForState(stateName) {
    clearLayers();
    
    stateLayer = L.geoJSON(null, {
        style: {
            color: '#ff4500',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.4,
            fillColor: '#ff7f50'
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>${feature.properties.statename}</b>`);
        }
    }).addTo(map);
    
    const stateFeatures = filterWards(wardGeoJSON.features, { statename: stateName });
    if (stateFeatures.length > 0) {
        const stateGeojson = {
            type: 'Feature',
            properties: { statename: stateName },
            geometry: mergeGeometries(stateFeatures)
        };
        stateLayer.addData(stateGeojson);
    }
}

function updateMapForLGA(lgaName, stateName) {
    // Similar implementation to updateMapForState but for LGA level
    // You'll need to implement this based on your requirements
}

// Use this handleSearchInput that leverages the filters.js functionality
function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (!searchTerm || searchTerm.length < 3) {
        // Reset highlighting if search is cleared or too short
        resetHighlighting();
        return;
    }
    
    // Search and highlight matching features
    clearLayers();
    
    // Create layers with different styling for matched features
    stateLayer = L.geoJSON(null, {
        style: feature => {
            const stateName = feature.properties.statename.toLowerCase();
            const isMatch = stateName.includes(searchTerm);
            return {
                color: isMatch ? '#ff4500' : '#3388ff',
                weight: isMatch ? 3 : 2,
                opacity: 1,
                fillOpacity: isMatch ? 0.4 : 0.2,
                fillColor: isMatch ? '#ff7f50' : '#add8e6'
            };
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>${feature.properties.statename}</b>`);
        }
    }).addTo(map);
    
    // Use filterStates from filters.js to filter states that match the search term
    const states = filterStates(wardGeoJSON.features, { name: searchTerm });
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
}

export { initializeSidebar };
