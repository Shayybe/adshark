// config.js
const API_CONFIG = {
    getBaseUrl: () => {
        // Return production URL by default, use localhost only in development
        return window.location.hostname === 'localhost' 
            ? 'http://localhost:3000'
            : 'https://www.adshark.net';
    },
    
    // Common fetch options for all API calls
    getFetchOptions: () => ({
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    // Helper function to handle API responses
    handleApiResponse: async (response) => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'API request failed');
        }
        return response.json();
    }
};

// Fetch wrapper with error handling
async function fetchWithConfig(endpoint, options = {}) {
    const baseUrl = API_CONFIG.getBaseUrl();
    const defaultOptions = API_CONFIG.getFetchOptions();
    
    try {
        const response = await fetch(
            `${baseUrl}${endpoint}`,
            { ...defaultOptions, ...options }
        );
        return await API_CONFIG.handleApiResponse(response);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
window.apiModule = {
    fetchWithConfig,
    API_CONFIG
};