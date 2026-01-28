/**
 * Data e Hora - Theme Management
 * Handles theme initialization and persistence across all pages
 * This script must be loaded in the <head> to prevent FOUC (Flash of Unstyled Content)
 */

(function() {
    /**
     * Get the current theme based on user preference
     * Supports: 'light', 'dark', 'auto' (time-based), 'default' (system preference)
     * @returns {string} The theme to apply ('light' or 'dark')
     */
    function getTheme() {
        const saved = localStorage.getItem('theme-pref') || 'default';
        
        // Direct theme selection
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        
        // Auto theme based on time of day (6am-6pm = light, otherwise dark)
        if (saved === 'auto') {
            const hours = new Date().getHours();
            return (hours < 6 || hours >= 18) ? 'dark' : 'light';
        }
        
        // Default: use system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Set background color immediately to prevent white flash
        document.documentElement.style.backgroundColor = theme === 'dark' ? '#020617' : '#f1f5f9';
    }
    
    // Initialize theme immediately
    const currentTheme = getTheme();
    applyTheme(currentTheme);
    
    // Export functions for use in other scripts
    window.themeManager = {
        getTheme: getTheme,
        applyTheme: applyTheme
    };
})();
