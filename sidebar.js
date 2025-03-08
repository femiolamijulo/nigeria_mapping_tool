/**
 * Sidebar component for Nigeria Map Tool
 * Handles the collapsible sidebar and search filters
 */
import { filterStates, filterLGAs, filterWards, getLGAsByState, getWardsByLGA } from './scripts/filters.js';
import { zoomToFeature, clearLayers, mergeGeometries, updateMapForSearchResults } from './scripts.js';

function initializeSidebar() {
    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">Map Filters</div>
        <div class="dropdown-container">
            <div style="position: relative;">
                <select id="state-select">
                    <option value="">-- Select State --</option>
                </select>
                <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #3498db;">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            </div>
            
            <div style="position: relative;">
                <select id="lga-select" disabled>
                    <option value="">-- Select LGA --</option>
                </select>
                <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #3498db;">
                    <i class="fas fa-map"></i>
                </div>
            </div>
            
            <div style="position: relative;">
                <select id="ward-select" disabled>
                    <option value="">-- Select Ward --</option>
                </select>
                <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #3498db;">
                    <i class="fas fa-thumbtack"></i>
                </div>
            </div>
            
            <button id="reset-search">Reset Filters</button>
        </div>
        <div class="filter-info" style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 6px; font-size: 13px; color: #7f8c8d; border-left: 3px solid #3498db;">
            <p style="margin: 0; padding: 0;"><i class="fas fa-info-circle" style="margin-right: 5px; color: #3498db;"></i> Select filters above or use the search box to explore Nigeria's regions.</p>
        </div>
    `;
    
    // Create toggle button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.body.appendChild(sidebar);
    document.body.appendChild(toggleButton);
    
    // Toggle sidebar functionality
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleButton.classList.toggle('open');
        
        // Change icon based on sidebar state
        if (sidebar.classList.contains('open')) {
            toggleButton.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Add transition effect
        toggleButton.style.transition = 'left 0.3s ease';
    });
    
    // Show sidebar by default on larger screens
    if (window.innerWidth > 768) {
        sidebar.classList.add('open');
        toggleButton.classList.add('open');
        toggleButton.innerHTML = '<i class="fas fa-times"></i>';
    }
    
    // Create search box on the map
    createMapSearchBox();
    
    // Populate state dropdown when data is available
    if (window.wardGeoJSON && window.wardGeoJSON.features) {
        populateStateDropdown();
        
        // Add event listeners for dropdowns
        addDropdownListeners();
    } else {
        // Listen for the dataLoaded event if data is not available yet
        document.addEventListener('dataLoaded', () => {
            populateStateDropdown();
            addDropdownListeners();
            
            // Add subtle animation to show dropdowns are now active
            const stateSelect = document.getElementById('state-select');
            stateSelect.style.transition = 'all 0.3s ease';
            stateSelect.style.borderColor = '#3498db';
            setTimeout(() => {
                stateSelect.style.borderColor = '#ddd';
            }, 700);
        });
    }
    
    // Add reset button functionality
    document.getElementById('reset-search').addEventListener('click', () => {
        // Add button press animation
        const resetButton = document.getElementById('reset-search');
        resetButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resetButton.style.transform = '';
        }, 150);
        
        // Reset all filters
        document.getElementById('search-input').value = '';
        document.getElementById('state-select').value = '';
        document.getElementById('lga-select').value = '';
        document.getElementById('ward-select').value = '';
        document.getElementById('lga-select').disabled = true;
        document.getElementById('ward-select').disabled = true;
        
        // Reset map
        window.resetHighlighting();
        
        // Show success notification
        showNotification('Map reset successfully', 'success');
    });
}

function addDropdownListeners() {
    document.getElementById('state-select').addEventListener('change', handleStateChange);
    document.getElementById('lga-select').addEventListener('change', handleLGAChange);
    document.getElementById('ward-select').addEventListener('change', handleWardChange);
}

// Create search box as a map control
function createMapSearchBox() {
    const searchControl = L.control({position: 'topright'});
    
    searchControl.onAdd = function(map) {
        const searchBox = document.createElement('div');
        searchBox.className = 'map-search-box';
        searchBox.innerHTML = `<input type="text" id="search-input" placeholder="Search for states, LGAs...">`;
        return searchBox;
    };
    
    searchControl.addTo(window.map);
    
    // Add text search event listener
    setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearchInput);
            
            // Add clear button functionality
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    window.resetHighlighting();
                }
            });
        }
    }, 200);
}

// Show a notification message
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.map-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'map-notification';
    
    // Set icon and color based on type
    let icon, color;
    switch(type) {
        case 'success':
            icon = 'check-circle';
            color = '#27ae60';
            break;
        case 'error':
            icon = 'exclamation-triangle';
            color = '#e74c3c';
            break;
        case 'warning':
            icon = 'exclamation-circle';
            color = '#f39c12';
            break;
        case 'info':
        default:
            icon = 'info-circle';
            color = '#3498db';
    }
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        color: '#333',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        zIndex: '2000',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Poppins', sans-serif",
        borderLeft: `4px solid ${color}`,
        maxWidth: '300px',
        animation: 'slideIn 0.3s ease-out forwards'
    });
    
    notification.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right: 10px; color: ${color};"></i>
        <span>${message}</span>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after a delay
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function populateStateDropdown() {
    const stateSelect = document.getElementById('state-select');
    const states = filterStates(window.wardGeoJSON.features);
    
    // Clear any existing options except the first one
    while (stateSelect.options.length > 1) {
        stateSelect.remove(1);
    }
    
    // Sort states alphabetically
    states.sort((a, b) => a.name.localeCompare(b.name));
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.name;
        option.textContent = state.name;
        stateSelect.appendChild(option);
    });
    
    // Add animation feedback to show dropdown is populated
    stateSelect.classList.add('populated');
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
        window.resetHighlighting();
        return;
    }
    
    // Enable LGA select and populate
    lgaSelect.disabled = false;
    
    const lgas = getLGAsByState(window.wardGeoJSON.features, stateName);
    
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
    
    // Zoom and center the map on the selected state
    const stateFeature = window.wardGeoJSON.features.find(feature => feature.properties.statename === stateName);
    if (stateFeature) {
        zoomToFeature(stateFeature);
    }
    
    // Show notification
    showNotification(`Selected state: ${stateName}`, 'info');
}

function handleLGAChange(e) {
    const lgaName = e.target.value;
    const stateName = document.getElementById('state-select').value;
    const wardSelect = document.getElementById('ward-select');
    
    // Reset ward filter
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    
    if (!lgaName) {
        wardSelect.disabled = true;
        window.resetHighlighting();
        return;
    }
    
    // Enable ward select and populate
    wardSelect.disabled = false;
    
    const wards = getWardsByLGA(window.wardGeoJSON.features, lgaName, stateName);
    
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
    
    // Zoom and center the map on the selected LGA
    const lgaFeature = window.wardGeoJSON.features.find(feature => feature.properties.lganame === lgaName && feature.properties.statename === stateName);
    if (lgaFeature) {
        zoomToFeature(lgaFeature);
    }
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
    
    const stateFeatures = filterWards(window.wardGeoJSON.features, { statename: stateName });
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
        window.resetHighlighting();
        return;
    }
    
    // Search and highlight matching features
    window.clearLayers();
    
    // Use filterStates from filters.js to filter states that match the search term
    const states = filterStates(window.wardGeoJSON.features, { name: searchTerm });
    const lgas = filterLGAs(window.wardGeoJSON.features, { name: searchTerm });
    const wards = filterWards(window.wardGeoJSON.features, { wardname: searchTerm });
    
    const searchResults = [...states, ...lgas, ...wards];
    
    if (searchResults.length > 0) {
        const features = searchResults.map(result => {
            return window.wardGeoJSON.features.find(feature => {
                return feature.properties.wardname === result.wardname ||
                       feature.properties.lganame === result.name ||
                       feature.properties.statename === result.name;
            });
        }).filter(feature => feature);
        
        window.updateMapForSearchResults(features);
        showNotification(`Found ${features.length} matching results`, 'success');
    } else if (searchTerm.length > 2) {
        showNotification('No matching results found', 'warning');
    }
}

// Add a handler for ward selection
function handleWardChange(e) {
    const wardName = e.target.value;
    const lgaName = document.getElementById('lga-select').value;
    const stateName = document.getElementById('state-select').value;
    
    if (wardName) {
        showNotification(`Selected ward: ${wardName}`, 'info');
        
        // Zoom and center the map on the selected ward
        const wardFeature = window.wardGeoJSON.features.find(feature => feature.properties.wardname === wardName && feature.properties.lganame === lgaName && feature.properties.statename === stateName);
        if (wardFeature) {
            zoomToFeature(wardFeature);
        }
    }
}
