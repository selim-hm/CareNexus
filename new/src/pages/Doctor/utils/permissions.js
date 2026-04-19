/**
 * Doctor Module Permissions
 * Standardizes access control for features within the Doctor/Nurse unified path.
 */

export const ROLES = {
    DOCTOR: 'doctor',
    NURSING: 'nursing'
};

const permissions = {
    [ROLES.DOCTOR]: {
        dashboard: true,
        orders: true,
        profile: true,
        settings: true,
        chat: true,
        reviews: true,
        medical_ai: true,
        knowledge_ai: true,
        feed: true,
        // Doctor specific features (to be added)
        clinical_notes: true,
        prescriptions: true
    },
    [ROLES.NURSING]: {
        dashboard: true,
        orders: true,
        profile: true,
        settings: true,
        chat: true,
        feed: true,
        reviews: false, // Maybe nurses don't have reviews?
        medical_ai: true,
        knowledge_ai: true,
        // Nurse specific features
        vitals_tracking: true,
        patient_care: true,
        clinical_notes: false // Only doctors can write notes?
    }
};

/**
 * Check if a role has access to a specific feature
 * @param {string} role - User role (doctor, nursing)
 * @param {string} feature - Feature key
 * @returns {boolean}
 */
export const canAccess = (role, feature) => {
    if (!role || !permissions[role]) return false;
    return !!permissions[role][feature];
};

/**
 * Filter an array of navigation items based on the user's role
 * @param {Array} navItems - Items with a 'feature' property
 * @param {string} role - User role
 * @returns {Array}
 */
export const filterNavItems = (navItems, role) => {
    return navItems.filter(item => {
        // If no feature is specified, assume it's public for both
        if (!item.feature) return true;
        return canAccess(role, item.feature);
    });
};
