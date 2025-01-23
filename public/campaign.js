async function fetchCampaignData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');

    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';

    try {
        // console.log(`Fetching campaign data from: https://www.adshark.net/performance-report-campaign?startDate=${startDate}&endDate=${endDate}`);
        const response = await fetch(
            `https://www.adshark.net/performance-report-campaign?startDate=${startDate}&endDate=${endDate}`,
            { credentials: 'include' }
        );

        if (!response.ok) {
            throw new Error('Failed to retrieve campaign data.');
        }

        const result = await response.json();
        // console.log('API Response:', result); // Debugging log

        // Access the items array from the data object
        if (!result.data || !result.data.items || result.data.items.length === 0) {
            throw new Error('No campaign data available');
        }

        // Populate the table with campaign data
        populateCampaignTable(result.data.items);

        // Update summary stats
        // document.getElementById('itemCount').textContent = result.data.itemCount;
        // document.getElementById('lastUpdateTime').textContent = result.data.dbLastUpdateTime;
        // document.getElementById('dbDateTime').textContent = result.data.dbDateTime;
    } catch (error) {
        // console.error('Error fetching campaign data:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
}
  
function populateCampaignTable(campaigns) {
    // console.log('Campaigns Data:', campaigns); // Debugging log
    const tableBody = document.getElementById('campaignTableBody');
    tableBody.innerHTML = ''; // Clear existing cards

    campaigns.forEach(campaign => {
        const card = document.createElement('div');
        card.className = 'campaign-card';

        card.innerHTML = `
            <span>${campaign.campaign}</span>
            <span>${campaign.impressions.toLocaleString()}</span>
            <span>${campaign.conversions}</span>
            <span>${campaign.clicks.toLocaleString()}</span>
            <span>${campaign.ctr.toFixed(3)}</span>
            <span>${campaign.cpm.toFixed(3)}</span>
            <span>${campaign.spent.toFixed(2)}</span>
            <span>${campaign.i2c.toFixed(3)}</span>
        `;

        tableBody.appendChild(card);
    });
}