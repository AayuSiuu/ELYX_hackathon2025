// Load JSON data
let journeyData;

fetch('elyx_journey_json.json')
    .then(response => response.json())
    .then(data => {
        journeyData = data;
        initializeDashboard();
    })
    .catch(error => console.error('Error loading data:', error));



    // ==================== ADVANCED FEATURES ====================
// ... (existing real-time updates, export, search functions)

// 4. SLEEP QUALITY CHART (New feature)
function createSleepQualityChart() {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    const sleepData = journeyData.key_milestones.map(m => m.sleep_efficiency || null);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: journeyData.key_milestones.map(m => `Week ${m.week}`),
            datasets: [{
                label: 'Sleep Efficiency (%)',
                data: sleepData,
                backgroundColor: '#1abc9c'
            }]
        },
        options: { responsive: true }
    });
}

// Initialize it in `initializeDashboard()`:
// ==================== ADVANCED FEATURES ====================
// ... other features

// 5. DARK MODE TOGGLE
function setupDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.textContent = '🌙 Dark Mode';
    toggle.className = 'btn btn-dark';
    toggle.onclick = () => document.body.classList.toggle('dark-mode');
    document.querySelector('header').appendChild(toggle);
}



function initializeDashboard() {
    // Populate summary stats
    populateSummaryStats();
    
    // Initialize timeline chart
    createTimelineChart();
    
    // Populate team members
    populateTeamMembers();
    
    // Initialize week selector
    populateWeekSelector();
    
    // Populate milestones
    populateMilestones();
    
    // Show health transformation
    showHealthTransformation();

     createSleepQualityChart(); // Add this line

     setupDarkModeToggle();
}

function populateSummaryStats() {
    const statsContainer = document.getElementById('summary-stats');
    const stats = journeyData.summary_stats;
    
    const statsHTML = `
        <div class="col-md-3">
            <div class="stat-card">
                <h4>Duration</h4>
                <p class="display-6">${journeyData.project.duration}</p>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <h4>Weight Loss</h4>
                <p class="display-6">${stats.total_weight_loss}</p>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <h4>Final HbA1c</h4>
                <p class="display-6">${stats.final_hba1c}</p>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <h4>Adherence</h4>
                <p class="display-6">${stats.average_adherence}</p>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = statsHTML;
}

function createTimelineChart() {
    
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // Enhanced data based on Rohan's 8-month journey from conversations
    const weeks = ['Week 1', 'Week 4', 'Week 8', 'Week 12', 'Week 16', 'Week 20', 'Week 24', 'Week 28', 'Week 32'];
    
    // HbA1c progression from conversations (% values)
    const hba1cValues = [6.2, 6.1, 5.8, 5.8, 5.6, 5.4, 5.4, 5.2, 5.1];
    
    // Weight loss progression (cumulative kg lost)
    const weightLossValues = [0, -1.2, -3.2, -4.8, -5.9, -7.0, -7.2, -8.1, -9.2];
    
    // Create gradient for HbA1c line
    const hba1cGradient = ctx.createLinearGradient(0, 0, 0, 400);
    hba1cGradient.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
    hba1cGradient.addColorStop(1, 'rgba(231, 76, 60, 0.2)');
    
    // Create gradient for weight line
    const weightGradient = ctx.createLinearGradient(0, 0, 0, 400);
    weightGradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
    weightGradient.addColorStop(1, 'rgba(52, 152, 219, 0.2)');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'HbA1c (%)',
                    data: hba1cValues,
                    borderColor: '#e74c3c',
                    backgroundColor: hba1cGradient,
                    borderWidth: 3,
                    tension: 0.4,
                    yAxisID: 'y',
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    fillOpacity: 0.3
                },
                {
                    label: 'Weight Loss (kg)',
                    data: weightLossValues,
                    borderColor: '#3498db',
                    backgroundColor: weightGradient,
                    borderWidth: 3,
                    tension: 0.4,
                    yAxisID: 'y1',
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    fillOpacity: 0.3
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
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.parsed.y;
                            
                            if (datasetLabel === 'HbA1c (%)') {
                                let status = '';
                                if (value <= 5.1) status = ' (Excellent!)';
                                else if (value <= 5.7) status = ' (Good)';
                                else if (value <= 6.4) status = ' (Pre-diabetic)';
                                else status = ' (Diabetic)';
                                
                                return `${datasetLabel}: ${value}%${status}`;
                            } else {
                                const improvement = Math.abs(value);
                                return `${datasetLabel}: ${value} kg (${improvement}kg total loss)`;
                            }
                        }
                    }
                },
                annotation: {
                    annotations: {
                        hba1cTarget: {
                            type: 'line',
                            yMin: 5.1,
                            yMax: 5.1,
                            yScaleID: 'y',
                            borderColor: '#27ae60',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Target HbA1c (5.1%)',
                                enabled: true,
                                position: 'start',
                                backgroundColor: '#27ae60',
                                color: '#fff',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                }
                            }
                        },
                        preDiabeticThreshold: {
                            type: 'line',
                            yMin: 5.7,
                            yMax: 5.7,
                            yScaleID: 'y',
                            borderColor: '#f39c12',
                            borderWidth: 2,
                            borderDash: [3, 3],
                            label: {
                                content: 'Pre-diabetic threshold',
                                enabled: true,
                                position: 'end',
                                backgroundColor: '#f39c12',
                                color: '#fff',
                                font: {
                                    size: 10
                                }
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#4a5568',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'HbA1c (%)',
                        color: '#e74c3c',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: 4.8,
                    max: 6.5,
                    grid: {
                        color: 'rgba(231, 76, 60, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#e74c3c',
                        font: {
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Weight Loss (kg)',
                        color: '#3498db',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: -10,
                    max: 1,
                    grid: {
                        drawOnChartArea: false,
                        color: 'rgba(52, 152, 219, 0.1)'
                    },
                    ticks: {
                        color: '#3498db',
                        font: {
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return value + ' kg';
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBorderWidth: 3
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Add milestone annotations for key weeks
    const milestoneWeeks = {
        'Week 8': 'Month 2: Plan Development Complete',
        'Week 12': 'Q1: Major Improvement Milestone', 
        'Week 24': 'Mid-Journey: Prediabetes Reversed',
        'Week 32': 'Journey Complete: Target Achieved'
    };
    
    // Animate chart on load
    setTimeout(() => {
        chart.update('active');
    }, 500);
    
    return chart;
}

Chart.register(ChartAnnotation);
function createSleepQualityChart() {
    const ctx = document.getElementById('sleepChart');
    if (!ctx) { // 👈 Safety check
        console.error("Sleep chart canvas not found!");
        return;
    }
    // ... rest of the function
}

function populateTeamMembers() {
    const teamContainer = document.getElementById('team-container');
    const team = journeyData.team_members;
    
    let teamHTML = '';
    for (const [key, member] of Object.entries(team)) {
        teamHTML += `
            <div class="team-member" style="border-left: 4px solid ${member.color_code}">
                <h5>${member.name}</h5>
                <p><strong>Role:</strong> ${member.role}</p>
                <p><strong>Responsibilities:</strong> ${member.responsibilities.join(', ')}</p>
            </div>
        `;
    }
    
    teamContainer.innerHTML = teamHTML;
}

function populateWeekSelector() {
    const selector = document.getElementById('week-selector');
    const weeks = journeyData.conversations_by_week;
    
    for (const [weekKey, weekData] of Object.entries(weeks)) {
        const option = document.createElement('option');
        option.value = weekKey;
        option.textContent = `${weekData.date_range} - ${weekData.phase}`;
        selector.appendChild(option);
    }
    
    // Show first week by default
    showWeekConversations(Object.keys(weeks)[0]);
    
    // Add event listener
    selector.addEventListener('change', (e) => {
        showWeekConversations(e.target.value);
    });
}

function showWeekConversations(weekKey) {
    const container = document.getElementById('conversation-container');
    const weekData = journeyData.conversations_by_week[weekKey];
    
    let conversationsHTML = `
        <h4>${weekData.date_range}</h4>
        <p><em>${weekData.phase}</em></p>
        <hr>
    `;
    
    weekData.messages.forEach(msg => {
        const roleClass = msg.role === 'member' ? 'member' : 
                         msg.role === 'doctor' ? 'doctor' :
                         msg.role === 'scientist' ? 'scientist' : '';
        
        conversationsHTML += `
            <div class="message ${roleClass}">
                <p><strong>${msg.sender}</strong> <small class="text-muted">${msg.date} ${msg.time}</small></p>
                <p>${msg.message}</p>
            </div>
        `;
    });
    
    container.innerHTML = conversationsHTML;
}

function populateMilestones() {
    const container = document.getElementById('milestones-container');
    const milestones = journeyData.key_milestones;
    
    let milestonesHTML = '';
    milestones.forEach(milestone => {
        const achievementsHTML = milestone.achievements 
            ? `<ul>${milestone.achievements.map(a => `<li>${a}</li>`).join('')}</ul>`
            : '';
        
        const finalResults = milestone.final_results ? `
            <div class="mt-3">
                <h5>Final Results:</h5>
                <ul>
                    ${Object.entries(milestone.final_results).map(([key, val]) => `<li><strong>${key.replace('_', ' ')}:</strong> ${val}</li>`).join('')}
                </ul>
            </div>
        ` : '';
        
        milestonesHTML += `
            <div class="milestone-item">
                <h4>Week ${milestone.week}: ${milestone.title}</h4>
                ${achievementsHTML}
                ${finalResults}
            </div>
        `;
    });
    
    container.innerHTML = milestonesHTML;
}

function showHealthTransformation() {
    const container = document.getElementById('transformation-container');
    const baseline = journeyData.health_transformations.baseline || {};
    const final = journeyData.health_transformations.final || {};
    
    const metrics = [
        { name: 'HbA1c', baseline: baseline.hba1c || '6.2%', final: final.hba1c || 'N/A', unit: "" },
        { name: 'Resting Heart Rate', baseline: baseline.rhr || '72 bpm', final: final.rhr || 'N/A', unit: "" },
        { name: 'HRV', baseline: baseline.hrv || '28ms', final: final.hrv || 'N/A', unit: "" },
        { name: 'Sleep Efficiency', baseline: baseline.sleep_efficiency || '68%', final: final.sleep_efficiency || 'N/A', unit: "" },
        { name: 'Blood Pressure', baseline: 'N/A', final: final.bp || 'N/A', unit: "mm Hg" },
        { name: 'Weight Change', baseline: 'N/A', final: final.weight_change || 'N/A', unit: "" },
        { name: 'Biological Age', baseline: 'N/A', final: final.biological_age_change || 'N/A', unit: "" }
    ];

    let transformationHTML = '';
    metrics.forEach(metric => {
        const improvement = metric.baseline !== 'N/A' 
            ? parseFloat(metric.final) < parseFloat(metric.baseline) 
                ? 'improvement' 
                : 'decline'
            : '';
        
        transformationHTML += `
            <div class="col-md-3">
                <div class="transformation-card">
                    <h5>${metric.name}</h5>
                    ${metric.baseline !== 'N/A' ? `<p class="text-muted">Baseline: ${metric.baseline}${metric.unit}</p>` : ''}
                    <p class="h4 ${improvement}">Final: ${metric.final}${metric.unit}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = transformationHTML;
}

// Simulate real-time updates
setInterval(() => {
    fetch('elyx_journey_json.json')
        .then(response => response.json())
        .then(data => {
            journeyData = data;
            updateDashboard();
        });
}, 30000); // Update every 30 seconds

function exportData() {
    const dataStr = JSON.stringify(journeyData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elyx_journey_export.json';
    a.click();
}

function searchConversations(query) {
    const results = [];
    for (const [weekKey, weekData] of Object.entries(journeyData.conversations_by_week)) {
        const matches = weekData.messages.filter(msg => 
            msg.message.toLowerCase().includes(query.toLowerCase()) ||
            msg.sender.toLowerCase().includes(query.toLowerCase())
        );
        if (matches.length > 0) {
            results.push({
                week: weekKey,
                matches: matches
            });
        }
    }
    return results;
}
