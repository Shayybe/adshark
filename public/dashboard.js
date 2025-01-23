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
                console.error('Logout failed');
                Toast.show("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error('Error during logout:', error);
            Toast.show("An error occurred during logout. Please try again.");
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const tabContents = document.querySelectorAll('.tab-content');
    const dateDiv = document.getElementById('dateDiv');

    function showTab(targetId) {
        tabContents.forEach(content => {
            if (content.id === targetId) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });

  
        if (targetId === 'campaign') { 
            dateDiv.style.display = 'none';
        } else {
            dateDiv.style.display = 'block';
        }
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('href').substring(1);
            showTab(targetId);
        });
    });

    const firstTab = links[0].getAttribute('href').substring(1);
    showTab(firstTab);
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
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');

    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';

    try {
        console.log(`Fetching data from: http://www.adshark.net/performance-report?startDate=${startDate}&endDate=${endDate}`);
        const response = await fetch(
            `http://www.adshark.net/performance-report?startDate=${startDate}&endDate=${endDate}&groupBy=date`,
            { credentials: 'include' }
          );
        if (!response.ok) {
            throw new Error('Failed to retrive.');
        }
        
        const result = await response.json();
        console.log('API Response:', result);

        if (!result.data || !result.data.items) {
            throw new Error('No data available');
        }

        updateChart(result.data.items);
        updateTable(result.data.items);
        updateSummaryStats(result.data.items);
    } catch (error) {
        console.error('Error fetching data:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
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

function updateChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date || item.campaign),
            datasets: [
                {
                    label: 'Impressions',
                    data: data.map(item => item.impressions),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Clicks',
                    data: data.map(item => item.clicks),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Impressions'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Clicks'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

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