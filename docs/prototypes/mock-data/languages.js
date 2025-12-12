/**
 * Mock Languages Data
 * Supported languages for the application
 */

const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

// Default language
let currentLanguage = 'en';

/**
 * Get all supported languages
 * @returns {Array} Array of language objects
 */
function getSupportedLanguages() {
    return [...supportedLanguages];
}

/**
 * Get current language
 * @returns {Object} Current language object
 */
function getCurrentLanguage() {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
}

/**
 * Set current language
 * @param {string} languageCode - Language code (e.g., 'en', 'vi', 'ja')
 * @returns {Object} Updated language object
 */
function setCurrentLanguage(languageCode) {
    const language = supportedLanguages.find(lang => lang.code === languageCode);
    if (language) {
        currentLanguage = languageCode;
        // Store in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('appLanguage', languageCode);
        }
        return language;
    }
    return getCurrentLanguage();
}

/**
 * Get language by code
 * @param {string} code - Language code
 * @returns {Object|null} Language object or null
 */
function getLanguageByCode(code) {
    return supportedLanguages.find(lang => lang.code === code) || null;
}

// Initialize from localStorage if available
if (typeof localStorage !== 'undefined') {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.supportedLanguages = supportedLanguages;
    window.getSupportedLanguages = getSupportedLanguages;
    window.getCurrentLanguage = getCurrentLanguage;
    window.setCurrentLanguage = setCurrentLanguage;
    window.getLanguageByCode = getLanguageByCode;
}
