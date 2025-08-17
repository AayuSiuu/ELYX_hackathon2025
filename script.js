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
    
    // Prepare data for chart
    const milestones = journeyData.key_milestones;
    const weeks = milestones.map(m => `Week ${m.week}`);
    const hba1cValues = milestones.map(m => m.final_results ? parseFloat(m.final_results.hba1c) : null);
    const weightValues = milestones.map(m => m.final_results ? parseFloat(m.final_results.weight_loss.replace('kg', '')) : null);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'HbA1c (%)',
                    data: hba1cValues,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Weight Loss (kg)',
                    data: weightValues,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
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
                        text: 'HbA1c (%)'
                    },
                    min: 4.5,
                    max: 6.5
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Weight Loss (kg)'
                    },
                    min: 0,
                    max: 10,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
             plugins: {
        annotation: {
            annotations: {
                milestone1: {
                    type: 'line',
                    yMin: 5.1,
                    yMax: 5.1,
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        content: 'Target HbA1c',
                        enabled: true
                    }
                }
            }
        }
    }
        }
    });
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
