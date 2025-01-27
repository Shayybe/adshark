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
                // console.error('Logout failed');
                Toast.show("Failed to logout. Please try again.");
            }
        } catch (error) {
            // console.error('Error during logout:', error);
            Toast.show("An error occurred during logout. Please try again.");
        }
    });
});

// Define showTab globally
function showTab(targetId) {
    // console.log(`Showing tab: ${targetId}`); // Debugging
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
        targetId === 'campaign' || 
        targetId === 'newCampaign' || 
        targetId === 'support'
    ) {
        document.getElementById('dateDiv').style.display = 'none'; // Hide dateDiv for these tabs
    } else {
        document.getElementById('dateDiv').style.display = 'block'; // Show dateDiv for other tabs
    }

    // Additional logic for specific tabs
    if (targetId === 'campaign') {
        fetchCampaignData(); // Fetch campaign data if needed
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');

    // Add event listeners to sidebar links
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const targetId = link.getAttribute('href').substring(1); // Get the target tab ID
            showTab(targetId); // Show the selected tab
        });
    });

    // Show the default tab on page load
    const defaultTab = 'dashboard'; // Change this to your default tab ID
    showTab(defaultTab);
});


function setDefaultDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

async function fetchData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const loadingDiv = document.getElementById('loading');

    try {
        // console.log(`Fetching data from: https://www.adshark.net/performance-report?startDate=${startDate}&endDate=${endDate}`);
        const response = await fetch(
            // `http://localhost:3000/performance-report?startDate=${startDate}&endDate=${endDate}&groupBy=date`,
            `https://www.adshark.net/performance-report?startDate=${startDate}&endDate=${endDate}&groupBy=date`,
            { credentials: 'include' }
          );
        if (!response.ok) {
            // throw new Error('Failed to retrive.');
        }
        
        const result = await response.json();

        if (!result.data || !result.data.items) {
            throw new Error('No data available');
        }

        updateChart(result.data.items);
        updateTable(result.data.items);
        updateSummaryStats(result.data.items);
    } catch (error) {
        Toast.show(error.message, 'error');
    } finally {
        // loadingDiv.style.display = 'none';
    }
}


function updateTable(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        // Calculate CTR (Click-Through Rate)
        const ctr = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : '0.00';

        // Calculate CPC (Cost Per Click)
        // const cpc = item.clicks > 0 ? (parseFloat(item.spend || 0) / item.clicks).toFixed(2) : '0.00';

        // Add data to the table row
        row.innerHTML = `
            <td>${item.date || item.campaign}</td>
            <td>${item.impressions?.toLocaleString() || 0}</td>
            <td>${item.clicks?.toLocaleString() || 0}</td>
            <td>$${parseFloat(item.spend || 0).toFixed(2)}</td>
            <td>${ctr}%</td>
             
        `;
        // <td>$${cpc}</td>
        tbody.appendChild(row);
    });
}

function updateSummaryStats(data) {
    const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
    const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
    const totalSpend = data.reduce((sum, item) => sum + parseFloat(item.spend || 0), 0);
    const avgCTR = (totalClicks / totalImpressions * 100 || 0).toFixed(2);
    // const avgCPC = (totalSpend / totalClicks || 0).toFixed(2);

    const summaryStatsDiv = document.getElementById('summaryStats');
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

/* <div class="stat-card">
<h3>Average CPC</h3>
<p>$${avgCPC}</p>
</div> */

setDefaultDates();
fetchData();

document.getElementById('startDate').addEventListener('change', fetchData);
document.getElementById('endDate').addEventListener('change', fetchData);

document.querySelectorAll('.sidebar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
// Show Sidebar
menuBtn.addEventListener("click", () => {
    sideMenu.style.display = "block";
  });
  
  // Hide Sidebar
  closeBtn.addEventListener("click", () => {
    sideMenu.style.display = "none";
  });
  
