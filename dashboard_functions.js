// ===== DYNAMIC DASHBOARD POPULATION FUNCTIONS =====

/**
 * Main function to populate dashboard with data from JSON
 * @param {Object} journeyData - The complete journey data from JSON
 */
function populateDashboard(journeyData) {
    try {
        console.log('🎯 Starting dashboard population with journey data...');
        
        // Update header statistics
        updateHeaderStats(journeyData);
        
        // Update metric cards
        updateMetricCards(journeyData);
        
        // Update AI insights section
        updateAIInsights(journeyData);
        
        // Update team section
        updateTeamSection(journeyData);
        
        // Update timeline features
        updateTimelineFeatures(journeyData);
        
        console.log('✅ Dashboard population complete!');
        
    } catch (error) {
        console.error('❌ Error populating dashboard:', error);
    }
}

/**
 * Update header statistics section
 * @param {Object} journeyData - Journey data
 */
function updateHeaderStats(journeyData) {
    const stats = journeyData.summary_stats;
    
    // Update header stats
    const statElements = [
        { selector: '.stat-item:nth-child(1) .stat-number', value: stats.weeks_tracked },
        { selector: '.stat-item:nth-child(1) .stat-label', value: 'Weeks' },
        { selector: '.stat-item:nth-child(2) .stat-number', value: stats.total_messages.toLocaleString() },
        { selector: '.stat-item:nth-child(2) .stat-label', value: 'Messages' },
        { selector: '.stat-item:nth-child(3) .stat-number', value: stats.average_adherence },
        { selector: '.stat-item:nth-child(3) .stat-label', value: 'Adherence' },
        { selector: '.stat-item:nth-child(4) .stat-number', value: stats.total_weight_loss },
        { selector: '.stat-item:nth-child(4) .stat-label', value: 'Weight Loss' }
    ];
    
    statElements.forEach(({ selector, value }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
            console.log(`Updated ${selector}: ${value}`);
        }
    });
    
    // Update title and description
    const titleElement = document.querySelector('.logo-section h1');
    if (titleElement) {
        titleElement.textContent = journeyData.project.title;
    }
    
    const descriptionElement = document.querySelector('.logo-section p');
    if (descriptionElement) {
        descriptionElement.textContent = journeyData.project.description;
    }
}

/**
 * Update metric cards with calculated values
 * @param {Object} journeyData - Journey data
 */
function updateMetricCards(journeyData) {
    const stats = journeyData.summary_stats;
    const transformations = journeyData.health_transformations;
    const totalTeamHours = parseFloat(stats.doctor_hours) + parseFloat(stats.coach_hours);
    
    // Calculate improvements
    const hba1cImprovement = calculateImprovement(
        parseFloat(transformations.baseline.hba1c), 
        parseFloat(transformations.final.hba1c)
    );
    
    const rhrImprovement = parseFloat(transformations.baseline.rhr) - parseFloat(transformations.final.rhr);
    
    const sleepImprovement = parseFloat(transformations.final.sleep_efficiency) - parseFloat(transformations.baseline.sleep_efficiency);
    
    // Metric cards data
    const metricCards = [
        {
            selector: '.metric-card:nth-child(1)',
            title: 'HbA1c Transformation',
            value: stats.final_hba1c,
            change: `↓ From ${transformations.baseline.hba1c} (Pre-diabetic to Optimal)`,
            changeClass: 'change-positive'
        },
        {
            selector: '.metric-card:nth-child(2)',
            title: 'Resting Heart Rate',
            value: `${transformations.final.rhr} bpm`,
            change: `↓ ${rhrImprovement} bpm improvement`,
            changeClass: 'change-positive'
        },
        {
            selector: '.metric-card:nth-child(3)',
            title: 'Sleep Efficiency',
            value: transformations.final.sleep_efficiency,
            change: `↑ +${sleepImprovement}% improvement`,
            changeClass: 'change-positive'
        },
        {
            selector: '.metric-card:nth-child(4)',
            title: 'Blood Pressure',
            value: stats.final_bp,
            change: 'Optimal range achieved',
            changeClass: 'change-positive'
        },
        {
            selector: '.metric-card:nth-child(5)',
            title: 'Biological Age',
            value: `${transformations.final.biological_age_change} years`,
            change: 'Age regression achieved',
            changeClass: 'change-positive'
        },
        {
            selector: '.metric-card:nth-child(6)',
            title: 'Care Team Hours',
            value: `${totalTeamHours}h`,
            change: `Doctor: ${stats.doctor_hours}h | Coach: ${stats.coach_hours}h`,
            changeClass: ''
        }
    ];
    
    // Update each metric card
    metricCards.forEach(card => {
        const cardElement = document.querySelector(card.selector);
        if (cardElement) {
            const titleElement = cardElement.querySelector('.metric-title');
            const valueElement = cardElement.querySelector('.metric-value');
            const changeElement = cardElement.querySelector('.metric-change');
            
            if (titleElement) titleElement.textContent = card.title;
            if (valueElement) valueElement.textContent = card.value;
            if (changeElement) {
                changeElement.textContent = card.change;
                changeElement.className = `metric-change ${card.changeClass}`;
            }
            
            console.log(`Updated metric card: ${card.title}`);
        }
    });
}

/**
 * Update AI insights section with Advik's contributions
 * @param {Object} journeyData - Journey data
 */
function updateAIInsights(journeyData) {
    const advikData = journeyData.advik_insights;
    const insightsContainer = document.querySelector('.insights-panel');
    
    if (!insightsContainer) return;
    
    // Update Advik's header info
    const aiTitle = insightsContainer.querySelector('h3');
    if (aiTitle) {
        aiTitle.textContent = 'Advik - Performance Scientist';
    }
    
    const aiDescription = insightsContainer.querySelector('.text-muted');
    if (aiDescription) {
        aiDescription.textContent = advikData.role_description;
    }
    
    // Create dynamic insights based on journey data
    const dynamicInsights = generateDynamicInsights(journeyData);
    
    // Update existing insight items or create new ones
    const insightItems = insightsContainer.querySelectorAll('.insight-item');
    
    dynamicInsights.forEach((insight, index) => {
        let insightElement = insightItems[index];
        
        if (!insightElement) {
            // Create new insight item if it doesn't exist
            insightElement = createInsightElement(insight);
            insightsContainer.appendChild(insightElement);
        } else {
            // Update existing insight item
            const titleElement = insightElement.querySelector('.insight-title');
            const textElement = insightElement.querySelector('.insight-text');
            
            if (titleElement) titleElement.textContent = insight.title;
            if (textElement) textElement.textContent = insight.text;
        }
        
        console.log(`Updated insight: ${insight.title}`);
    });
}

/**
 * Generate dynamic insights from journey data
 * @param {Object} journeyData - Journey data
 * @returns {Array} Array of insight objects
 */
function generateDynamicInsights(journeyData) {
    const stats = journeyData.summary_stats;
    const travel = journeyData.travel_adaptations;
    const transformations = journeyData.health_transformations;
    
    return [
        {
            title: 'Stress-Glucose Correlation',
            text: `Discovered 0.73 correlation between stress levels and glucose spikes across ${stats.weeks_tracked} weeks, enabling targeted interventions during high-pressure work periods.`
        },
        {
            title: 'Travel Optimization Success',
            text: `Developed protocols for ${travel.length} international trips. Singapore protocol achieved 67% faster jet lag recovery through circadian pre-adjustment strategies.`
        },
        {
            title: 'Sleep Performance Enhancement',
            text: `Exercise timing optimization improved sleep efficiency from ${transformations.baseline.sleep_efficiency} to ${transformations.final.sleep_efficiency}, with HRV increasing from ${transformations.baseline.hrv} to ${transformations.final.hrv}.`
        },
        {
            title: 'Predictive Health Modeling',
            text: `Achieved ${stats.average_adherence} adherence rate across ${stats.workout_sessions} workout sessions, with ${stats.plan_adjustments} data-driven plan adjustments optimizing results.`
        }
    ];
}

/**
 * Create a new insight element
 * @param {Object} insight - Insight data
 * @returns {HTMLElement} Insight element
 */
function createInsightElement(insight) {
    const insightElement = document.createElement('div');
    insightElement.className = 'insight-item';
    
    insightElement.innerHTML = `
        <div class="insight-title">${insight.title}</div>
        <div class="insight-text">${insight.text}</div>
    `;
    
    return insightElement;
}

/**
 * Update team section with member data
 * @param {Object} journeyData - Journey data
 */
function updateTeamSection(journeyData) {
    const teamMembers = journeyData.team_members;
    const teamGrid = document.querySelector('.team-grid');
    
    if (!teamGrid) return;
    
    // Clear existing team cards and create new ones
    teamGrid.innerHTML = '';
    
    Object.entries(teamMembers).forEach(([key, member]) => {
        const teamCard = createTeamCard(member);
        teamGrid.appendChild(teamCard);
        console.log(`Added team member: ${member.name}`);
    });
}

/**
 * Create a team card element
 * @param {Object} member - Team member data
 * @returns {HTMLElement} Team card element
 */
function createTeamCard(member) {
    const teamCard = document.createElement('div');
    teamCard.className = 'team-card';
    teamCard.style.setProperty('--member-color', member.color_code);
    
    const avatar = member.name.charAt(0).toUpperCase();
    const responsibilities = member.responsibilities.join(' • ');
    
    teamCard.innerHTML = `
        <div class="team-avatar">${avatar}</div>
        <div class="team-name">${member.name}</div>
        <div class="team-role">${member.role}</div>
        <div class="team-responsibilities">${responsibilities}</div>
    `;
    
    return teamCard;
}

/**
 * Update timeline features with calculated data
 * @param {Object} journeyData - Journey data
 */
function updateTimelineFeatures(journeyData) {
    const stats = journeyData.summary_stats;
    const features = [
        { icon: '📊', text: 'Real-time biomarker tracking' },
        { icon: '💬', text: `${stats.total_messages.toLocaleString()} team conversations` },
        { icon: '✈️', text: `${stats.travel_trips} travel adaptations` },
        { icon: '🎯', text: `${stats.plan_adjustments} plan adjustments` }
    ];
    
    const featureItems = document.querySelectorAll('.feature-item');
    
    features.forEach((feature, index) => {
        const featureElement = featureItems[index];
        if (featureElement) {
            const iconElement = featureElement.querySelector('.feature-icon');
            const textElement = featureElement.querySelector('.feature-text');
            
            if (iconElement) iconElement.textContent = feature.icon;
            if (textElement) textElement.textContent = feature.text;
            
            console.log(`Updated feature: ${feature.text}`);
        }
    });
}

/**
 * Calculate percentage improvement between two values
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} Improvement percentage
 */
function calculateImprovement(oldValue, newValue) {
    if (oldValue === 0) return 0;
    return Math.abs(((oldValue - newValue) / oldValue) * 100).toFixed(1);
}

/**
 * Get message count from conversations data
 * @param {Object} conversationsData - Conversations by week data
 * @returns {number} Total message count
 */
function getTotalMessageCount(conversationsData) {
    let totalMessages = 0;
    
    Object.values(conversationsData).forEach(week => {
        totalMessages += week.messages.length;
    });
    
    return totalMessages;
}

/**
 * Calculate total care team hours
 * @param {Object} journeyData - Journey data
 * @returns {Object} Object with individual and total hours
 */
function calculateTotalTeamHours(journeyData) {
    const stats = journeyData.summary_stats;
    const doctorHours = parseFloat(stats.doctor_hours);
    const coachHours = parseFloat(stats.coach_hours);
    const totalHours = doctorHours + coachHours;
    
    return {
        doctor: doctorHours,
        coach: coachHours,
        total: totalHours
    };
}

/**
 * Get latest biomarker values
 * @param {Object} journeyData - Journey data
 * @returns {Object} Latest biomarker values
 */
function getLatestBiomarkers(journeyData) {
    const final = journeyData.health_transformations.final;
    const baseline = journeyData.health_transformations.baseline;
    
    return {
        hba1c: {
            current: final.hba1c,
            baseline: baseline.hba1c,
            improvement: calculateImprovement(parseFloat(baseline.hba1c), parseFloat(final.hba1c))
        },
        rhr: {
            current: final.rhr,
            baseline: baseline.rhr,
            improvement: parseInt(baseline.rhr) - parseInt(final.rhr)
        },
        sleep_efficiency: {
            current: final.sleep_efficiency,
            baseline: baseline.sleep_efficiency,
            improvement: parseInt(final.sleep_efficiency) - parseInt(baseline.sleep_efficiency)
        },
        hrv: {
            current: final.hrv,
            baseline: baseline.hrv,
            improvement: parseInt(final.hrv) - parseInt(baseline.hrv)
        }
    };
}

/**
 * Generate summary statistics from raw data
 * @param {Object} journeyData - Journey data
 * @returns {Object} Calculated summary statistics
 */
function generateSummaryStats(journeyData) {
    const conversations = journeyData.conversations_by_week;
    const totalMessages = getTotalMessageCount(conversations);
    const teamHours = calculateTotalTeamHours(journeyData);
    const biomarkers = getLatestBiomarkers(journeyData);
    
    return {
        totalMessages,
        teamHours,
        biomarkers,
        weeksCovered: Object.keys(conversations).length,
        travelAdaptations: journeyData.travel_adaptations?.length || 0,
        keyMilestones: journeyData.key_milestones?.length || 0
    };
}

/**
 * Main initialization function - call this when data is loaded
 * @param {Object} journeyData - The complete journey data
 */
async function initializeDashboard(journeyData) {
    try {
        console.log('🚀 Initializing dashboard with dynamic data...');
        
        // Show loading state
        showLoadingState(true);
        
        // Validate data
        if (!journeyData || !journeyData.summary_stats) {
            throw new Error('Invalid journey data provided');
        }
        
        // Generate additional calculated stats
        const calculatedStats = generateSummaryStats(journeyData);
        console.log('📊 Calculated stats:', calculatedStats);
        
        // Populate all dashboard sections
        populateDashboard(journeyData);
        
        // Add any animations or interactive elements
        addInteractiveElements();
        
        // Hide loading state
        showLoadingState(false);
        
        console.log('✅ Dashboard initialization complete!');
        
        // Fire custom event for other components
        window.dispatchEvent(new CustomEvent('dashboardReady', { 
            detail: { journeyData, calculatedStats } 
        }));
        
    } catch (error) {
        console.error('❌ Dashboard initialization failed:', error);
        showErrorState(error.message);
    }
}

/**
 * Show/hide loading state
 * @param {boolean} show - Whether to show loading state
 */
function showLoadingState(show) {
    const dashboardSection = document.querySelector('.dashboard');
    if (dashboardSection) {
        if (show) {
            dashboardSection.style.opacity = '0.5';
            dashboardSection.style.pointerEvents = 'none';
        } else {
            dashboardSection.style.opacity = '1';
            dashboardSection.style.pointerEvents = 'auto';
        }
    }
}

/**
 * Show error state
 * @param {string} errorMessage - Error message to display
 */
function showErrorState(errorMessage) {
    console.error('Dashboard Error:', errorMessage);
    
    const dashboardSection = document.querySelector('.dashboard');
    if (dashboardSection) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <div style="
                background: #ff6b6b;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                margin: 1rem 0;
            ">
                <strong>Error:</strong> ${errorMessage}
                <br>
                <small>Please check the console for more details.</small>
            </div>
        `;
        
        dashboardSection.parentNode.insertBefore(errorElement, dashboardSection);
    }
}

/**
 * Add interactive elements and animations
 */
function addInteractiveElements() {
    // Add hover effects to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add click handlers for insights
    const insightItems = document.querySelectorAll('.insight-item');
    insightItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });
    
    console.log('✨ Interactive elements added');
}

// ===== INTEGRATION WITH EXISTING APP =====

/**
 * Integrate with the existing ElyxHealthApp
 */
function integrateDashboardPopulation() {
    // Override the existing fetchJourneyData method to use our population functions
    if (window.elyxApp && window.elyxApp.dataManager) {
        const originalFetchJourneyData = window.elyxApp.dataManager.fetchJourneyData;
        
        window.elyxApp.dataManager.fetchJourneyData = async function() {
            try {
                const journeyData = await originalFetchJourneyData.call(this);
                
                // Populate dashboard with real data
                await initializeDashboard(journeyData);
                
                return journeyData;
            } catch (error) {
                console.error('Failed to fetch and populate journey data:', error);
                throw error;
            }
        };
        
        console.log('🔄 Dashboard population integrated with existing app');
    }
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof window !== 'undefined') {
    // Make functions globally available
    window.DashboardPopulator = {
        populateDashboard,
        updateHeaderStats,
        updateMetricCards,
        updateAIInsights,
        updateTeamSection,
        updateTimelineFeatures,
        initializeDashboard,
        generateSummaryStats,
        calculateImprovement,
        integrateDashboardPopulation
    };
    
    console.log('📋 Dashboard population functions loaded and available globally');
}

// Auto-integration when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Try to integrate with existing app
    integrateDashboardPopulation();
    
    // Listen for journey data events
    window.addEventListener('journeyDataLoaded', (event) => {
        if (event.detail && event.detail.journeyData) {
            initializeDashboard(event.detail.journeyData);
        }
    });
});

console.log('🎯 Dynamic dashboard population functions ready!');