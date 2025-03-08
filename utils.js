// utils.js - Utility Functions for Reusability

/**
 * Displays a notification message with different types (success, error, warning, info)
 * @param {string} message - The notification message
 * @param {string} type - Type of notification ('success', 'error', 'warning', 'info')
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.map-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'map-notification';

    // Set icon and color based on type
    const typeConfig = {
        success: { icon: 'check-circle', color: '#27ae60' },
        error: { icon: 'exclamation-triangle', color: '#e74c3c' },
        warning: { icon: 'exclamation-circle', color: '#f39c12' },
        info: { icon: 'info-circle', color: '#3498db' }
    };
    
    const { icon, color } = typeConfig[type] || typeConfig.info;

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
        borderLeft: `4px solid ${color}`,
        maxWidth: '300px',
        animation: 'slideIn 0.3s ease-out forwards'
    });

    notification.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right: 10px; color: ${color};"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

export { showNotification };



