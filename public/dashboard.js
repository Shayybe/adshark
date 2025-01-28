document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    
    logoutButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                window.location.href = '/login';
            } else {
                Toast.show("Failed to logout. Please try again.");
            }
        } catch (error) {
            Toast.show("An error occurred during logout. Please try again.");
        }
    });
});

// Define showTab globally
function showTab(targetId) {
    const tabContents = document.querySelectorAll('.tab-content');
    const links = document.querySelectorAll('.sidebar a');

    // Hide all tab contents
    tabContents.forEach(content => {
        if (content.id === targetId) {
            content.style.display = 'block'; // Show the selected tab
        } else {
            content.style.display = 'none'; // Hide other tabs
        }
    });

    // Remove the 'active' class from all links
    links.forEach(link => {
        link.classList.remove('active');
    });

    // Add the 'active' class to the clicked link
    const activeLink = document.querySelector(`.sidebar a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Hide dateDiv for specific tabs
    const dateDiv = document.getElementById('dateDiv');
    if (dateDiv) {
        if (
            targetId === 'dashboard' || 
            targetId === 'newCampaign' || 
            targetId === 'support'
        ) {
            dateDiv.style.display = 'none';
        } else {
            dateDiv.style.display = 'block';
        }
    }

    // Additional logic for specific tabs
    if (targetId === 'campaign') {
        fetchCampaignData();
    } else if (targetId === 'performance' || targetId === 'datatable') {
        fetchData();
    }
}

function setDefaultDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

async function fetchData() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const loadingDiv = document.getElementById('loading');

    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        const result = await window.apiModule.fetchWithConfig(
            `/api/performance-report?startDate=${startDate}&endDate=${endDate}&groupBy=date`
        );

        if (!result.data?.items) {
            throw new Error('No data available');
        }

        updateChart(result.data.items);
        updateTable(result.data.items);
        updateSummaryStats(result.data.items);
    } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show(error.message || "Please log in to view campaign data");
        
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
            window.location.href = '/login';
        }
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

async function fetchCampaignData() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const loadingDiv = document.getElementById('loading');

    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        const result = await window.apiModule.fetchWithConfig(
            `/api/performance-report-campaign?startDate=${startDate}&endDate=${endDate}`
        );

        if (!result.data?.items?.length) {
            throw new Error('No campaign data available');
        }

        populateCampaignTable(result.data.items);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        Toast.show(error.message || "Error fetching campaign data");
        
        const campaignTableBody = document.getElementById('campaignTableBody');
        if (campaignTableBody) {
            campaignTableBody.innerHTML = `
                <div class="campaign-card empty">
                    <p>No campaigns found. Create a new campaign to get started!</p>
                </div>
            `;
        }

        if (error.message.includes('token') || error.message.includes('unauthorized')) {
            window.location.href = '/login';
        }
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

function updateTable(data) {
    const tbody = document.querySelector('#dataTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        const ctr = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : '0.00';

        row.innerHTML = `
            <td>${item.date || item.campaign}</td>
            <td>${item.impressions?.toLocaleString() || 0}</td>
            <td>${item.clicks?.toLocaleString() || 0}</td>
            <td>$${parseFloat(item.spend || 0).toFixed(2)}</td>
            <td>${ctr}%</td>
        `;
        tbody.appendChild(row);
    });
}

function updateSummaryStats(data) {
    const summaryStatsDiv = document.getElementById('summaryStats');
    if (!summaryStatsDiv) return;

    const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
    const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
    const totalSpend = data.reduce((sum, item) => sum + parseFloat(item.spend || 0), 0);
    const avgCTR = (totalClicks / totalImpressions * 100 || 0).toFixed(2);

    summaryStatsDiv.innerHTML = `
        <div class="stat-card">
            <h3>Total Impressions</h3>
            <p>${totalImpressions.toLocaleString()}</p>
        </div>
        <div class="stat-card">
            <h3>Total Clicks</h3>
            <p>${totalClicks.toLocaleString()}</p>
        </div>
        <div class="stat-card">
            <h3>Total Spend</h3>
            <p>$${totalSpend.toFixed(2)}</p>
        </div>
        <div class="stat-card">
            <h3>Average CTR</h3>
            <p>${avgCTR}%</p>
        </div>
    `;
}

function populateCampaignTable(campaigns) {
    const tableBody = document.getElementById('campaignTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    campaigns.forEach(campaign => {
        const card = document.createElement('div');
        card.className = 'campaign-card';

        // Format metrics with proper precision
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth status when page loads
    try {
        await window.apiModule.checkAuthStatus();
    } catch (error) {
        console.error('Auth check failed:', error);
        return; // Stop initialization if auth fails
    }

    // Initialize rest of the dashboard
    initializeDashboard();
});
function initializeDashboard() {
    const links = document.querySelectorAll('.sidebar a');
    
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showTab(targetId);
        });
    });

    setDefaultDates();
    showTab('dashboard');
}

// Mobile menu handlers
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener("click", () => {
    sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    sideMenu.style.display = "none";
});

// Add event listeners for date inputs
document.getElementById('startDate').addEventListener('change', () => {
    const activeTab = document.querySelector('.tab-content[style="display: block"]')?.id;
    if (activeTab === 'performance' || activeTab === 'datatable') {
        fetchData();
    } else if (activeTab === 'campaign') {
        fetchCampaignData();
    }
});

document.getElementById('endDate').addEventListener('change', () => {
    const activeTab = document.querySelector('.tab-content[style="display: block"]')?.id;
    if (activeTab === 'performance' || activeTab === 'datatable') {
        fetchData();
    } else if (activeTab === 'campaign') {
        fetchCampaignData();
    }
});

function showTab(targetId) {
    const tabContents = document.querySelectorAll('.tab-content');
    const links = document.querySelectorAll('.sidebar a');

    // Hide all tab contents
    tabContents.forEach(content => {
        if (content.id === targetId) {
            content.style.display = 'block'; // Show the selected tab
        } else {
            content.style.display = 'none'; // Hide other tabs
        }
    });

    // Remove the 'active' class from all links
    links.forEach(link => {
        link.classList.remove('active');
    });

    // Add the 'active' class to the clicked link
    const activeLink = document.querySelector(`.sidebar a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Hide dateDiv for specific tabs
    if (
        targetId === 'dashboard' || 
        targetId === 'newCampaign' || 
        targetId === 'support' ||
        targetId === 'traffic'
    ) {
        document.getElementById('dateDiv').style.display = 'none';
    } else {
        document.getElementById('dateDiv').style.display = 'block';
    }

    // Additional logic for specific tabs
    if (targetId === 'campaign') {
        fetchCampaignData();
    } else if (targetId === 'performance' || targetId === 'datatable') {
        fetchData();
    } else if (targetId === 'traffic') {
     
        window.trafficModule.fetchTrafficData();
    } else if (targetId === 'newCampaign') {
        // Pre-fill campaign form if coming from traffic chart
        const selectedCountry = sessionStorage.getItem('selectedCountry');
        const recommendedCPM = sessionStorage.getItem('recommendedCPM');
        
        if (selectedCountry) {
            const countryOptions = document.querySelectorAll('.country-option');
            countryOptions.forEach(option => {
                if (option.textContent.includes(selectedCountry.split(' - ')[0])) {
                    option.click();
                }
            });
        }

        if (recommendedCPM) {
            const budgetInput = document.getElementById('budget');
            if (budgetInput) {
                budgetInput.value = parseFloat(recommendedCPM.replace('$', ''));
            }
        }

        // Clear stored data    
        sessionStorage.removeItem('selectedCountry');
        sessionStorage.removeItem('recommendedCPM');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.material-icons-sharp');

        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');

            // Slide toggle answer
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.textContent = 'expand_more';
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.textContent = 'expand_less';
            }

            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.material-icons-sharp');
                    otherAnswer.style.maxHeight = null;
                    otherIcon.textContent = 'expand_more';
                }
            });
        });
    });
});