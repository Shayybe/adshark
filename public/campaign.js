const API_ENDPOINTS = {
    local: 'http://localhost:3000',
    production: 'https://www.adshark.net'
};

const BASE_URL = window.location.hostname === 'localhost' ? API_ENDPOINTS.local : API_ENDPOINTS.production;

async function fetchCampaignData() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const loadingDiv = document.getElementById('loading');

    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        const response = await fetch(
            `${BASE_URL}/performance-report-campaign?startDate=${startDate}&endDate=${endDate}`,
            { 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to retrieve campaign data.');
        }

        const result = await response.json();

        if (!result.data || !result.data.items || result.data.items.length === 0) {
            throw new Error('No campaign data available');
        }

        populateCampaignTable(result.data.items);
    } catch (error) {
        Toast.show(error.message, 'error');
        const campaignTableBody = document.getElementById('campaignTableBody');
        if (campaignTableBody) {
            campaignTableBody.innerHTML = `
                <div class="campaign-card empty">
                    <p>No campaigns found. Create a new campaign to get started!</p>
                </div>
            `;
        }
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

function populateCampaignTable(campaigns) {
    const tableBody = document.getElementById('campaignTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    campaigns.forEach(campaign => {
        const card = document.createElement('div');
        card.className = 'campaign-card';

        // Format numbers with proper precision
        const impressions = parseInt(campaign.impressions || 0).toLocaleString();
        const clicks = parseInt(campaign.clicks || 0).toLocaleString();
        const ctr = ((campaign.clicks / campaign.impressions) * 100 || 0).toFixed(2);
        const cpm = parseFloat(campaign.cpm || 0).toFixed(2);
        const spent = parseFloat(campaign.spent || 0).toFixed(2);
        const conversions = parseInt(campaign.conversions || 0).toLocaleString();
        const i2c = parseFloat(campaign.i2c || 0).toFixed(3);

        card.innerHTML = `
            <span>${campaign.campaign}</span>
            <span>${impressions}</span>
            <span>${conversions}</span>
            <span>${clicks}</span>
            <span>${ctr}%</span>
            <span>$${cpm}</span>
            <span>$${spent}</span>
            <span>${i2c}</span>
        `;

        tableBody.appendChild(card);
    });
}

// Export functions for use in dashboard.js
window.campaignModule = {
    fetchCampaignData,
    populateCampaignTable
};