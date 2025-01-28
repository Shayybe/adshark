// config.js
const API_CONFIG = {
    getBaseUrl: () => {
        return window.location.hostname === 'localhost' 
            ? 'http://localhost:3000'
            : 'https://www.adshark.net';
    },
    
    // Get auth token from localStorage or cookie
    getAuthToken: () => {
        // Try to get token from localStorage
        const token = localStorage.getItem('authToken') || 
                     document.cookie.split('; ')
                     .find(row => row.startsWith('authToken='))
                     ?.split('=')[1];
        return token;
    },

    // Common fetch options with auth header
    getFetchOptions: () => {
        const token = API_CONFIG.getAuthToken();
        return {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                // Add CSRF token if it exists
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        };
    },

    handleApiResponse: async (response) => {
        if (response.status === 401) {
            // Handle unauthorized - redirect to login
            window.location.href = '/login';
            throw new Error('Please log in to continue');
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Request failed');
        }
        
        return response.json();
    }
};

async function fetchWithConfig(endpoint, options = {}) {
    const baseUrl = API_CONFIG.getBaseUrl();
    const defaultOptions = API_CONFIG.getFetchOptions();
    
    try {
        const response = await fetch(
            `${baseUrl}${endpoint}`,
            { 
                ...defaultOptions, 
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...(options.headers || {})
                }
            }
        );
        return await API_CONFIG.handleApiResponse(response);
    } catch (error) {
        console.error('API Error:', error);
        // If token is invalid, redirect to login
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
            window.location.href = '/login';
        }
        throw error;
    }
}

// Check auth status on page load
async function checkAuthStatus() {
    try {
        await fetchWithConfig('/auth/check');
    } catch (error) {
        if (error.message.includes('unauthorized')) {
            window.location.href = '/login';
        }
    }
}

// Export for use in other files
window.apiModule = {
    fetchWithConfig,
    API_CONFIG,
    checkAuthStatus
};