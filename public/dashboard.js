const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://www.adshark.net';

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


function setDefaultDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

async function fetchData(startDate, endDate) {
    if (!startDate || !endDate) {
        if (document.body.getAttribute('data-active-tab') === 'performance') {
            startDate = document.getElementById('startDate').value;
            endDate = document.getElementById('endDate').value;
        } else if (document.body.getAttribute('data-active-tab') === 'datatable') {
            startDate = document.getElementById('startDateTable').value;
            endDate = document.getElementById('endDateTable').value;
        }
    }

    // console.log('Fetching data...'); 
    // console.log('Start Date:', startDate); 
    // console.log('End Date:', endDate); 

    try {
        const response = await fetch(
            `${BASE_URL}/performance-report?startDate=${startDate}&endDate=${endDate}&groupBy=date`,
            { credentials: 'include' }
        );

        // console.log('Response received:', response); 

        if (!response.ok) {
            const errorText = await response.text(); 
            // console.error('Response not OK. Status:', response.status, 'Error Text:', errorText); 
            throw new Error('Failed to retrieve data');
        }

        const result = await response.json();
        // console.log('Parsed JSON result:', result); 

        if (!result.data || !result.data.items) {
            // console.error('No data available in result:', result); 
            throw new Error('No data available');
        }

        // console.log('Updating chart, table, and summary stats with data:', result.data.items); 
        updateChart(result.data.items);
        updateTable(result.data.items);
        updateSummaryStats(result.data.items);
    } catch (error) {
        Toast.show("Complete date fields!");
    } finally {
    }
}

async function fetchCampaignData() {
    const startDate = document.getElementById('startDateCamp').value;
    const endDate = document.getElementById('endDateCamp').value;
    const loadingDiv = document.getElementById('loading');

    // console.log('Fetching campaign data...'); 
    // console.log('Start Date:', startDate);
    // console.log('End Date:', endDate);

    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        const response = await fetch(
            `${BASE_URL}/performance-report-campaign?startDate=${startDate}&endDate=${endDate}`,
            { credentials: 'include' }
        );

        if (!response.ok) {
            const errorText = await response.text(); 
            // console.error('Response not OK. Status:', response.status, 'Error Text:', errorText); 
            throw new Error('Fill date fields');
        }

        const result = await response.json();
        
        if (!result.data?.items?.length) {
            throw new Error('No campaign data available');
        }

        populateCampaignTable(result.data.items);
    } catch (error) {
        // console.error('Error occurred:', error); 
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
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showTab(targetId);
        });
    });

    // Set up date inputs
    setDefaultDates();

    // Show dashboard/welcome page by default
    showTab('dashboard');
});

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
    const paymentForm = document.getElementById('paymentForm');

    // Hide payment form unless explicitly showing it
    if (paymentForm && targetId !== 'payment') {
        paymentForm.classList.add('hidden');
    }

    tabContents.forEach(content => {
        content.style.display = content.id === targetId ? 'block' : 'none';
    });

    links.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    document.body.setAttribute('data-active-tab', targetId);

    const dateDiv = document.getElementById('dateDiv');
    if (dateDiv) {
        const hideDateTabs = ['dashboard', 'newCampaign', 'support', 'traffic'];
        dateDiv.style.display = hideDateTabs.includes(targetId) ? 'none' : 'block';
    }

    // Handle tab-specific actions
    switch (targetId) {
        case 'campaign':
            fetchCampaignData();
            break;
        case 'performance':
        case 'datatable':
            fetchData();
            break;
        case 'traffic':
            window.trafficModule?.fetchTrafficData();
            break;
        case 'newCampaign':
            handleNewCampaignTab();
            break;
        case 'payment':
            if (paymentForm) {
                paymentForm.classList.remove('hidden');
            }
            break;
    }
}

function handleNewCampaignTab() {
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

    sessionStorage.removeItem('selectedCountry');
    sessionStorage.removeItem('recommendedCPM');
}

function handleDateChange() {
    const activeTab = document.body.getAttribute('data-active-tab');
    let startDate, endDate;

    switch (activeTab) {
        case 'performance':
            startDate = document.getElementById('startDate').value;
            endDate = document.getElementById('endDate').value;
            fetchData(startDate, endDate);
            break;
        case 'datatable':
            startDate = document.getElementById('startDateTable').value;
            endDate = document.getElementById('endDateTable').value;
            fetchData(startDate, endDate);
            break;
        case 'campaign':
            fetchCampaignData();
            break;
    }
}
function setupDateListeners() {
    const startDateCamp = document.getElementById('startDateCamp');
    const endDateCamp = document.getElementById('endDateCamp');
    if (startDateCamp && endDateCamp) {
        startDateCamp.addEventListener('change', handleDateChange);
        endDateCamp.addEventListener('change', handleDateChange);
    }

    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate && endDate) {
        startDate.addEventListener('change', handleDateChange);
        endDate.addEventListener('change', handleDateChange);
    }

    const startDateTable = document.getElementById('startDateTable');
    const endDateTable = document.getElementById('endDateTable');
    if (startDateTable && endDateTable) {
        startDateTable.addEventListener('change', handleDateChange);
        endDateTable.addEventListener('change', handleDateChange);
    }
}

document.getElementById('startDate').addEventListener('change', handleDateChange);
document.getElementById('endDate').addEventListener('change', handleDateChange);
document.getElementById('startDateTable').addEventListener('change', handleDateChange);
document.getElementById('endDateTable').addEventListener('change', handleDateChange);

document.addEventListener('DOMContentLoaded', setupDateListeners);
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