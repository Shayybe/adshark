let chart = null;


function updateChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    // Handle both date-based and campaign-based data
    const labels = data.map(item => item.date || item.campaign);
    const impressions = data.map(item => item.impressions);
    const clicks = data.map(item => item.clicks);
    const spend = data.map(item => parseFloat(item.spend));

    // Sort data by date if dates are present
    if (data[0]?.date) {
        const sortedIndices = labels.map((_, i) => i)
            .sort((a, b) => new Date(labels[a]) - new Date(labels[b]));
        
        labels = sortedIndices.map(i => labels[i]);
        impressions = sortedIndices.map(i => impressions[i]);
        clicks = sortedIndices.map(i => clicks[i]);
        spend = sortedIndices.map(i => spend[i]);
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Impressions',
                    data: impressions,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y-impressions',
                    fill: true
                },
                {
                    label: 'Clicks',
                    data: clicks,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y-clicks',
                    fill: true
                },
                {
                    label: 'Spend ($)',
                    data: spend,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y-spend',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (context.dataset.label === 'Spend ($)') {
                                return label + ': $' + value.toFixed(2);
                            } else {
                                return label + ': ' + value.toLocaleString();
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                'y-impressions': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Impressions'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                'y-clicks': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Clicks'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                'y-spend': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Spend ($)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    console.log('Chart data:', data);

}

// Add this CSS to your styles
document.head.insertAdjacentHTML('beforeend', `
<style>
.chart-container {
    height: 400px;
    margin: 20px 0;
}
</style>
`);