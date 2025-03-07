/**
 * filters.js
 * Provides filtering functionality for Nigeria's administrative divisions (states, local governments, wards).
 */

/**
 * Filter states based on provided criteria
 * @param {Array} states - Array of state objects
 * @param {Object} criteria - Filter criteria (e.g. {name: 'Lagos'})
 * @returns {Array} Filtered states
 */
function filterStates(states, criteria = {}) {
    if (!states || !Array.isArray(states)) return [];
    
    return states.filter(state => {
        return Object.entries(criteria).every(([key, value]) => {
            if (!value) return true;
            return state[key] && state[key].toLowerCase().includes(value.toLowerCase());
        });
    });
}

/**
 * Filter local governments based on provided criteria
 * @param {Array} lgas - Array of LGA objects
 * @param {Object} criteria - Filter criteria (e.g. {name: 'Ikeja', stateId: 24})
 * @returns {Array} Filtered local governments
 */
function filterLGAs(lgas, criteria = {}) {
    if (!lgas || !Array.isArray(lgas)) return [];
    
    return lgas.filter(lga => {
        return Object.entries(criteria).every(([key, value]) => {
            if (!value) return true;
            if (key === 'stateId') return lga[key] === value;
            return lga[key] && lga[key].toLowerCase().includes(value.toLowerCase());
        });
    });
}

/**
 * Filter wards based on provided criteria
 * @param {Array} wards - Array of ward objects
 * @param {Object} criteria - Filter criteria (e.g. {name: 'Ward 1', lgaId: 500, stateId: 24})
 * @returns {Array} Filtered wards
 */
function filterWards(wards, criteria = {}) {
    if (!wards || !Array.isArray(wards)) return [];
    
    return wards.filter(ward => {
        return Object.entries(criteria).every(([key, value]) => {
            if (!value) return true;
            if (key === 'lgaId' || key === 'stateId') return ward[key] === value;
            return ward[key] && ward[key].toLowerCase().includes(value.toLowerCase());
        });
    });
}

/**
 * Get all local governments within a state
 * @param {Array} lgas - Array of all LGAs
 * @param {number|string} stateId - ID of the state
 * @returns {Array} Local governments in the specified state
 */
function getLGAsByState(lgas, stateId) {
    return filterLGAs(lgas, { stateId });
}

/**
 * Get all wards within a local government
 * @param {Array} wards - Array of all wards
 * @param {number|string} lgaId - ID of the local government
 * @returns {Array} Wards in the specified local government
 */
function getWardsByLGA(wards, lgaId) {
    return filterWards(wards, { lgaId });
}

// Export all functions
export {
    filterStates,
    filterLGAs,
    filterWards,
    getLGAsByState,
    getWardsByLGA
};