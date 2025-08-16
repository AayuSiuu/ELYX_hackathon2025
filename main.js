

// ===== APPLICATION CONFIGURATION =====
// ===== APPLICATION CONFIGURATION =====
const CONFIG = {
  endpoints: {
    healthData: '/api/health-data',
    conversationData: '/api/conversations',
    biomarkers: '/api/biomarkers',
    teamData: '/api/team'
  },
  animations: {
    duration: 300,
    easing: 'ease-out',
    staggerDelay: 100
  },
  charts: {
    colors: {
      primary: '#00d4ff',
      secondary: '#1abc9c',
      accent: '#f39c12',
      danger: '#e74c3c',
      success: '#27ae60'
    },
    responsive: true,
    maintainAspectRatio: false
  },
  intervals: {
    realTimeUpdates: 30000,
    heartbeat: 5000
  }
};

// ===== MOCK DATA STORE =====
const MOCK_DATA = {
  healthMetrics: {
    hba1c: { current: 5.1, previous: 6.2, unit: '%', trend: 'down' },
    restingHR: { current: 58, previous: 72, unit: 'bpm', trend: 'down' },
    sleepEfficiency: { current: 83, previous: 68, unit: '%', trend: 'up' },
    bloodPressure: { current: '118/75', previous: '135/85', unit: 'mmHg', trend: 'down' },
    biologicalAge: { current: -3.4, previous: 0, unit: 'years', trend: 'down' },
    weight: { current: 76.8, previous: 86.0, unit: 'kg', trend: 'down' }
  },
  timelineData: [
    { week: 1, hba1c: 6.2, weight: 86.0, sleepScore: 68, stressLevel: 7.2 },
    { week: 4, hba1c: 6.0, weight: 84.5, sleepScore: 72, stressLevel: 6.8 },
    { week: 8, hba1c: 5.8, weight: 82.1, sleepScore: 76, stressLevel: 6.2 },
    { week: 12, hba1c: 5.6, weight: 80.3, sleepScore: 79, stressLevel: 5.8 },
    { week: 16, hba1c: 5.4, weight: 78.9, sleepScore: 81, stressLevel: 5.4 },
    { week: 20, hba1c: 5.3, weight: 77.8, sleepScore: 82, stressLevel: 5.1 },
    { week: 24, hba1c: 5.2, weight: 77.2, sleepScore: 83, stressLevel: 4.9 },
    { week: 28, hba1c: 5.1, weight: 76.9, sleepScore: 83, stressLevel: 4.7 },
    { week: 32, hba1c: 5.1, weight: 76.8, sleepScore: 83, stressLevel: 4.5 }
  ],
  conversationTopics: [
    { topic: 'Nutrition Planning', count: 234, sentiment: 'positive' },
    { topic: 'Exercise Optimization', count: 187, sentiment: 'positive' },
    { topic: 'Sleep Improvement', count: 156, sentiment: 'neutral' },
    { topic: 'Stress Management', count: 143, sentiment: 'positive' },
    { topic: 'Travel Adaptation', count: 89, sentiment: 'positive' },
    { topic: 'Lab Results Discussion', count: 76, sentiment: 'neutral' }
  ]
};

// ===== SIMPLE CACHE & HELPERS =====
const cache = {};
function setCache(key, data, ttl) {
  cache[key] = { data, expiry: Date.now() + ttl };
}
function getCache(key) {
  const c = cache[key];
  if (c && Date.now() < c.expiry) return c.data;
  return null;
}
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ===== DATA SERVICE =====
const DataService = {
  async fetchConversationData() {
    try {
      await delay(600); // simulate latency
      const data = {
        totalMessages: 1247,
        topics: MOCK_DATA.conversationTopics,
        recentMessages: [], // TODO: plug in generator
        sentimentTrend: [] // TODO: plug in generator
      };
      setCache('conversations', data, 2 * 60 * 1000);
      return data;
    } catch (error) {
      console.error('Failed to fetch conversation data:', error);
      throw error;
    }
  },

  async fetchJourneyData() {
    try {
      const cached = getCache('journeyData');
      if (cached) {
        console.log('📋 Using cached journey data');
        return cached;
      }

      console.log('🔄 Fetching journey data from file...');
      const response = await fetch('/elyx_journey_json.json'); // must be in /public/

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const journeyData = await response.json();

      console.log('✅ Journey data fetched successfully', journeyData);
      setCache('journeyData', journeyData, 10 * 60 * 1000);
      return journeyData;
    } catch (error) {
      console.error('❌ Failed to fetch journey data:', error);
      console.log('🔄 Using fallback mock data');
      const fallbackData = this.generateMockJourneyData();
      setCache('journeyData', fallbackData, 5 * 60 * 1000);
      return fallbackData;
    }
  },

  generateMockJourneyData() {
    return {
      project: {
        title: "Elyx Health Journey - Complete 8-Month Timeline",
        description: "8-Month Health Transformation: From Onboarding to Optimization",
        duration: "32 weeks",
        member: "Rohan"
      },
      summary_stats: {
        total_messages: 1247,
        doctor_hours: 38.5,
        coach_hours: 52.8,
        average_adherence: "67%",
        total_weight_loss: "-9.2kg",
        final_hba1c: "5.1%",
        weeks_tracked: 32,
        workout_sessions: 156,
        travel_trips: 12,
        diagnostic_tests: 8,
        plan_adjustments: 24,
        final_bp: "118/75"
      },
      health_transformations: {
        baseline: {
          hba1c: "6.2%",
          status: "Pre-diabetic",
          rhr: "72 bpm",
          hrv: "28ms",
          sleep_efficiency: "68%",
          medication: "Metformin 500mg daily"
        },
        final: {
          hba1c: "5.1%",
          status: "Optimal metabolic health",
          rhr: "58 bpm",
          hrv: "47ms",
          sleep_efficiency: "83%",
          bp: "118/75",
          weight_change: "-9.2kg",
          biological_age_change: "-3.4 years"
        }
      }
    };
  }
};

// Example usage:
DataService.fetchJourneyData().then(d => console.log("Journey loaded:", d));

    insights: [
        {
            title: 'Glucose-Stress Pattern',
            description: 'Identified strong correlation (0.73) between work stress and glucose spikes. Implemented breathing exercises during high-stress periods.',
            impact: 'High',
            category: 'Behavioral'
        },
        {
            title: 'Exercise Timing Optimization',
            description: 'Morning workouts improved sleep quality by 22% and HRV by 18% compared to evening sessions.',
            impact: 'Medium',
            category: 'Performance'
        },
        {
            title: 'Travel Protocol Success',
            description: 'Singapore business trip protocol reduced jet lag recovery time by 67% using circadian pre-adjustment.',
            impact: 'High',
            category: 'Lifestyle'
        }
    ]


// ===== APPLICATION STATE MANAGEMENT =====
class AppState {
    constructor() {
        this.data = {};
        this.ui = {
            activeTab: 'overview',
            selectedMetric: null,
            timeRange: '32-weeks',
            isLoading: false,
            errors: []
        };
        this.listeners = [];
    }
    
    setState(key, value) {
        const oldValue = this.getState(key);
        this.setNestedValue(this.data, key, value);
        this.notify(key, value, oldValue);
    }
    
    getState(key) {
        return this.getNestedValue(this.data, key);
    }
    
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }
    
    notify(key, newValue, oldValue) {
        this.listeners.forEach(callback => callback(key, newValue, oldValue));
    }
    
    setNestedValue(obj, key, value) {
        const keys = key.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    
    getNestedValue(obj, key) {
        return key.split('.').reduce((current, k) => current?.[k], obj);
    }
}

// ===== DATA MANAGEMENT =====
class DataManager {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.loadingStates = new Set();
    }
    
    async fetchHealthData() {
        try {
            this.setLoading('healthData', true);
            
            // Simulate API call with realistic delay
            await this.delay(800);
            
            // In a real application, this would be:
            // const response = await fetch(CONFIG.endpoints.healthData);
            // const data = await response.json();
            
            const data = {
                metrics: MOCK_DATA.healthMetrics,
                timeline: MOCK_DATA.timelineData,
                insights: MOCK_DATA.insights
            };
            
            this.setCache('healthData', data, 5 * 60 * 1000); // 5 minute cache
            return data;
        } catch (error) {
            console.error('Failed to fetch health data:', error);
            throw new Error('Unable to load health data. Please try again later.');
        } finally {
            this.setLoading('healthData', false);
        }
    }
    
    async fetchConversationData() {
        try {
            this.setLoading('conversations', true);
            await this.delay(600);
            
            const data = {
                totalMessages: 1247,
                topics: MOCK_DATA.conversationTopics,
                recentMessages: this.generateRecentMessages(),
                sentimentTrend: this.generateSentimentTrend()
            };
            
            this.setCache('conversations', data, 2 * 60 * 1000); // 2 minute cache
            return data;
        } catch (error) {
            console.error('Failed to fetch conversation data:', error);
            throw error;
        } finally {
            this.setLoading('conversations', false);
        }
    }
    
    generateRecentMessages() {
        const templates = [
            "Great progress on your morning routine! Your sleep score improved by 8% this week.",
            "I noticed your glucose levels were more stable during the Singapore trip. The pre-travel protocol worked well!",
            "Your resting heart rate hit a new low of 58 bpm. The cardio improvements are really showing.",
            "The stress management techniques are paying off - your HRV has improved significantly.",
            "Ready for today's workout? I've adjusted the intensity based on your recovery metrics."
        ];
        
        return templates.map((message, index) => ({
            id: `msg_${index}`,
            text: message,
            timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)),
            sender: 'ai',
            type: 'insight'
        }));
    }
    
    generateSentimentTrend() {
        return Array.from({ length: 32 }, (_, week) => ({
            week: week + 1,
            sentiment: Math.max(0.3, Math.min(1.0, 0.5 + (week * 0.015) + (Math.random() * 0.2 - 0.1))),
            engagement: Math.max(0.4, Math.min(1.0, 0.6 + (week * 0.01) + (Math.random() * 0.15 - 0.075)))
        }));
    }
    
    setCache(key, data, ttl) {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }
    
    getCache(key) {
        const expiry = this.cacheExpiry.get(key);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }
        return this.cache.get(key);
    }
    
    setLoading(key, isLoading) {
        if (isLoading) {
            this.loadingStates.add(key);
        } else {
            this.loadingStates.delete(key);
        }
        appState.setState('ui.isLoading', this.loadingStates.size > 0);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== UI COMPONENTS =====
class UIComponents {
    constructor() {
        this.components = {};
        this.animationQueue = [];
    }
    
    // Metric Card Component
    renderMetricCard(metric, data, container) {
        const card = document.createElement('div');
        card.className = `metric-card ${this.getMetricVariant(metric)} animate-fade-in`;
        card.setAttribute('data-metric', metric);
        
        const trendIcon = this.getTrendIcon(data.trend);
        const changeClass = data.trend === 'up' ? 'change-positive' : 'change-negative';
        
        // Handle special cases for display
        let displayValue = data.current;
        let changeText = '';
        
        if (metric === 'biologicalAge') {
            changeText = `${data.current > 0 ? '+' : ''}${data.current} years`;
        } else if (metric === 'weight') {
            const weightChange = data.current - data.previous;
            changeText = `${trendIcon} ${Math.abs(weightChange).toFixed(1)}kg change`;
        } else {
            changeText = `${trendIcon} From ${data.previous}${data.unit}`;
        }
        
        card.innerHTML = `
            <div class="metric-title">${this.formatMetricName(metric)}</div>
            <div class="metric-value">${displayValue}${data.unit}</div>
            <div class="metric-change ${changeClass}">
                ${changeText}
            </div>
        `;
        
        // Add click handler for detailed view
        card.addEventListener('click', () => this.showMetricDetail(metric, data));
        
        container.appendChild(card);
        return card;
    }
    
    // Timeline Visualization
    renderTimeline(data, container) {
        // Clear existing content
        container.innerHTML = '';
        
        const timelineWrapper = document.createElement('div');
        timelineWrapper.className = 'timeline-visualization';
        
        // Create SVG for the timeline
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '400');
        svg.setAttribute('viewBox', '0 0 1000 400');
        
        // Add timeline paths for different metrics
        this.addTimelinePath(svg, data, 'hba1c', '#00d4ff', 50);
        this.addTimelinePath(svg, data, 'weight', '#1abc9c', 150);
        this.addTimelinePath(svg, data, 'sleepScore', '#f39c12', 250);
        this.addTimelinePath(svg, data, 'stressLevel', '#e74c3c', 350, true); // inverted
        
        // Add interactive points
        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * 900 + 50;
            this.addInteractivePoint(svg, x, point, index);
        });
        
        timelineWrapper.appendChild(svg);
        
        // Add legend
        const legend = this.createTimelineLegend();
        timelineWrapper.appendChild(legend);
        
        container.appendChild(timelineWrapper);
        
        // Add interaction handlers
        this.addTimelineInteractions(svg, data);
    }
    
    addTimelinePath(svg, data, metric, color, yOffset, inverted = false) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Normalize data for this metric
        const values = data.map(d => d[metric]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        
        // Create path data
        let pathData = '';
        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * 900 + 50;
            let normalizedValue = range > 0 ? (point[metric] - min) / range : 0.5;
            if (inverted) normalizedValue = 1 - normalizedValue;
            const y = yOffset + (normalizedValue * 60);
            
            pathData += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
        });
        
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.8');
        path.classList.add('timeline-path');
        
        svg.appendChild(path);
    }
    
    addInteractivePoint(svg, x, data, index) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'timeline-point');
        group.setAttribute('data-week', data.week);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', 200);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#ffffff');
        circle.setAttribute('stroke', '#00d4ff');
        circle.setAttribute('stroke-width', '2');
        
        group.appendChild(circle);
        svg.appendChild(group);
        
        // Add hover effects
        group.addEventListener('mouseenter', (e) => {
            this.showTimelineTooltip(e, data, x, 200);
        });
        
        group.addEventListener('mouseleave', () => {
            this.hideTimelineTooltip();
        });
    }
    
    createTimelineLegend() {
        const legend = document.createElement('div');
        legend.className = 'timeline-legend';
        
        const metrics = [
            { name: 'HbA1c', color: '#00d4ff', unit: '%' },
            { name: 'Weight', color: '#1abc9c', unit: 'kg' },
            { name: 'Sleep Score', color: '#f39c12', unit: '%' },
            { name: 'Stress Level', color: '#e74c3c', unit: '/10' }
        ];
        
        metrics.forEach(metric => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color" style="background-color: ${metric.color}"></div>
                <span class="legend-text">${metric.name} (${metric.unit})</span>
            `;
            legend.appendChild(item);
        });
        
        return legend;
    }
    
    // Chat Interface
    renderChatMessage(message, container, animated = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        messageDiv.innerHTML = this.formatMessageContent(message.text);
        
        if (animated) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(10px)';
        }
        
        container.appendChild(messageDiv);
        
        if (animated) {
            setTimeout(() => {
                messageDiv.style.transition = 'all 0.3s ease';
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Auto-scroll to bottom
        container.scrollTop = container.scrollHeight;
        
        return messageDiv;
    }
    
    formatMessageContent(text) {
        // Convert markdown-like formatting
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
    
    // Insights Panel
    renderInsightsPanel(insights, container) {
        container.innerHTML = '';
        
        insights.forEach((insight, index) => {
            const item = document.createElement('div');
            item.className = 'insight-item animate-slide-up';
            item.style.animationDelay = `${index * 100}ms`;
            
            item.innerHTML = `
                <div class="insight-title">${insight.title}</div>
                <div class="insight-text">${insight.description}</div>
                <div class="insight-meta">
                    <span class="insight-impact impact-${insight.impact.toLowerCase()}">${insight.impact} Impact</span>
                    <span class="insight-category">${insight.category}</span>
                </div>
            `;
            
            container.appendChild(item);
        });
    }
    
    // Utility Methods
    getMetricVariant(metric) {
        const variants = {
            hba1c: 'success',
            restingHR: 'info',
            sleepEfficiency: 'warning',
            bloodPressure: 'primary',
            biologicalAge: 'success',
            weight: 'info'
        };
        return variants[metric] || 'primary';
    }
    
    getTrendIcon(trend) {
        return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    }
    
    formatMetricName(metric) {
        const names = {
            hba1c: 'HbA1c Level',
            restingHR: 'Resting Heart Rate',
            sleepEfficiency: 'Sleep Efficiency',
            bloodPressure: 'Blood Pressure',
            biologicalAge: 'Biological Age',
            weight: 'Weight'
        };
        return names[metric] || metric;
    }
    
    showMetricDetail(metric, data) {
        // Create modal for detailed metric view
        const modal = this.createModal();
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.formatMetricName(metric)} Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="metric-detail">
                        <div class="current-value">
                            <span class="value">${data.current}${data.unit}</span>
                            <span class="label">Current</span>
                        </div>
                        <div class="previous-value">
                            <span class="value">${data.previous}${data.unit}</span>
                            <span class="label">Previous</span>
                        </div>
                        <div class="improvement">
                            <span class="value">${this.calculateImprovement(data)}%</span>
                            <span class="label">Improvement</span>
                        </div>
                    </div>
                    <div class="metric-insights">
                        ${this.getMetricInsights(metric)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.showModal(modal);
    }
    
    calculateImprovement(data) {
        if (data.previous === 0) return 0;
        const improvement = Math.abs((data.current - data.previous) / data.previous * 100);
        return improvement.toFixed(1);
    }
    
    getMetricInsights(metric) {
        const insights = {
            hba1c: 'Excellent progress! Your HbA1c has moved from pre-diabetic to optimal range.',
            restingHR: 'Your cardiovascular fitness has improved significantly.',
            sleepEfficiency: 'Sleep quality improvements are supporting overall health.',
            bloodPressure: 'Blood pressure is now in the optimal range.',
            biologicalAge: 'You\'ve achieved biological age regression - fantastic!',
            weight: 'Steady, sustainable weight loss progress.'
        };
        return insights[metric] || 'Great progress on this metric!';
    }
    
    showTimelineTooltip(event, data, x, y) {
        let tooltip = document.getElementById('timeline-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'timeline-tooltip';
            tooltip.className = 'timeline-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.innerHTML = `
            <div class="tooltip-header">Week ${data.week}</div>
            <div class="tooltip-metrics">
                <div>HbA1c: ${data.hba1c}%</div>
                <div>Weight: ${data.weight}kg</div>
                <div>Sleep: ${data.sleepScore}%</div>
                <div>Stress: ${data.stressLevel}/10</div>
            </div>
        `;
        
        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 50 + 'px';
    }
    
    hideTimelineTooltip() {
        const tooltip = document.getElementById('timeline-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        return modal;
    }
    
    showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Add close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
    }
    
    hideModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    addTimelineInteractions(svg, data) {
        // Add zoom and pan functionality
        let isMouseDown = false;
        let startX = 0;
        let scrollLeft = 0;
        
        svg.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - svg.offsetLeft;
            scrollLeft = svg.scrollLeft;
        });
        
        svg.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        
        svg.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        svg.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - svg.offsetLeft;
            const walk = (x - startX) * 2;
            svg.scrollLeft = scrollLeft - walk;
        });
    }
}

// ===== EVENT MANAGEMENT =====
class EventManager {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

// ===== MAIN APPLICATION CLASS =====
class ElyxHealthApp {
    constructor() {
        this.dataManager = new DataManager();
        this.uiComponents = new UIComponents();
        this.eventManager = new EventManager();
        this.isInitialized = false;
        
        // Bind methods
        this.handleChatInput = this.handleChatInput.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateRealTimeData = this.updateRealTimeData.bind(this);
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Elyx Health Dashboard...');
            
            // Show loading state
            this.showGlobalLoading(true);
            
            // Initialize components
            await this.initializeComponents();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Elyx Health Dashboard initialized successfully!');
            
            // Hide loading state
            this.showGlobalLoading(false);
            
            // Trigger initial animations
            this.triggerInitialAnimations();
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeComponents() {
        // Initialize chat interface
        this.initializeChatInterface();
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize filters and controls
        this.initializeControls();
    }
    
    async loadInitialData() {
        try {
            // Load health data
            const healthData = await this.dataManager.fetchHealthData();
            appState.setState('healthData', healthData);
            
            // Load conversation data
            const conversationData = await this.dataManager.fetchConversationData();
            appState.setState('conversationData', conversationData);
            
            // Render initial UI
            this.renderDashboard();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError('Failed to load dashboard data. Please refresh the page.');
        }
    }
    
    renderDashboard() {
        const healthData = appState.getState('healthData');
        
        if (!healthData) return;
        
        // Render metric cards
        this.renderMetricCards(healthData.metrics);
        
        // Render timeline
        this.renderTimelineVisualization(healthData.timeline);
        
        // Render insights
        this.renderInsights(healthData.insights);
        
        // Update conversation interface
        this.updateConversationInterface();
    }
    
    renderMetricCards(metrics) {
        const dashboard = document.querySelector('.dashboard');
        if (!dashboard) return;
        
        // Clear existing metric cards (keep structure)
        const existingCards = dashboard.querySelectorAll('.metric-card');
        existingCards.forEach(card => {
            if (card.dataset.metric) {
                card.remove();
            }
        });
        
        // Render new metric cards
        Object.entries(metrics).forEach(([metric, data]) => {
            this.uiComponents.renderMetricCard(metric, data, dashboard);
        });
    }
    
    renderTimelineVisualization(timelineData) {
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) return;
        
        this.uiComponents.renderTimeline(timelineData, timelineContainer);
    }
    
    renderInsights(insights) {
        const insightsContainer = document.querySelector('.insights-panel .insight-item')?.parentElement;
        if (!insightsContainer) return;
        
        // Remove existing insights
        const existingInsights = insightsContainer.querySelectorAll('.insight-item');
        existingInsights.forEach(item => item.remove());
        
        this.uiComponents.renderInsightsPanel(insights, insightsContainer);
    }
    
    initializeChatInterface() {
        const chatInput = document.querySelector('.chat-input input');
        const chatButton = document.querySelector('.chat-input button');
        const chatMessages = document.querySelector('.chat-messages');
        
        if (!chatInput || !chatButton || !chatMessages) return;
        
        // Set up input handlers
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleChatInput();
            }
        });
        
        chatButton.addEventListener('click', this.handleChatInput);
        
        // Load initial AI message
        const initialMessage = {
            sender: 'ai',
            text: "Hello! I'm your AI health assistant. I can help you understand Rohan's journey data, explain biomarker trends, or discuss optimization strategies. What would you like to explore?",
            timestamp: new Date()
        };
        
        this.uiComponents.renderChatMessage(initialMessage, chatMessages, false);
    }
    
    async handleChatInput() {
        const chatInput = document.querySelector('.chat-input input');
        const chatMessages = document.querySelector('.chat-messages');
        const userMessage = chatInput.value.trim();
        
        if (!userMessage || !chatMessages) return;
        
        // Clear input
        chatInput.value = '';
        
        // Add user message
        const userMsg = {
            sender: 'user',
            text: userMessage,
            timestamp: new Date()
        };
        
        this.uiComponents.renderChatMessage(userMsg, chatMessages);
        
        // Show typing indicator
        this.showTypingIndicator(chatMessages);
        
        try {
            // Simulate AI response delay
            await this.dataManager.delay(1500 + Math.random() * 1000);
            
            // Generate AI response
            const aiResponse = this.generateAIResponse(userMessage);
            
            // Remove typing indicator
            this.hideTypingIndicator(chatMessages);
            
            // Add AI response
            const aiMsg = {
                sender: 'ai',
                text: aiResponse,
                timestamp: new Date()
            };
            
            this.uiComponents.renderChatMessage(aiMsg, chatMessages);
            
            // Log interaction
            this.logChatInteraction(userMessage, aiResponse);
            
        } catch (error) {
            this.hideTypingIndicator(chatMessages);
            console.error('Chat error:', error);
            
            const errorMsg = {
                sender: 'ai',
                text: "I'm experiencing some technical difficulties. Please try again in a moment.",
                timestamp: new Date()
            };
            
            this.uiComponents.renderChatMessage(errorMsg, chatMessages);
        }
    }
    
    generateAIResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Pattern matching for different types of queries
        if (input.includes('hba1c') || input.includes('diabetes') || input.includes('glucose')) {
            return `Rohan's HbA1c improvement from 6.2% to 5.1% was achieved through:\n\n• **CGM-guided nutrition optimization** - Real-time glucose monitoring helped identify trigger foods\n• **Stress management protocols** - We discovered a 0.73 correlation between stress and glucose spikes\n• **Consistent exercise routine** - 156 workout sessions over 32 weeks\n• **Sleep quality improvement** - Better sleep directly impacted glucose regulation\n• **Personalized meal timing** - Optimized around his work schedule and travel\n\nThe key was the integrated approach rather than focusing on just one factor.`;
        }
        
        if (input.includes('weight') || input.includes('loss') || input.includes('kg')) {
            return `Rohan achieved a sustainable 9.2kg weight loss through:\n\n• **Metabolic optimization** - Focus on improving metabolic health first\n• **Strength training** - Preserved muscle mass during weight loss\n• **Nutrition coaching** - 234 nutrition-focused conversations with our team\n• **Travel adaptations** - Maintained progress through 12 business trips\n• **Behavioral changes** - Long-term lifestyle modifications vs. quick fixes\n\nThe weight loss was a byproduct of improved overall health, not the primary focus.`;
        }
        
        if (input.includes('sleep') || input.includes('recovery') || input.includes('rest')) {
            return `Rohan's sleep efficiency improved from 68% to 83% through:\n\n• **Exercise timing optimization** - Morning workouts improved sleep quality by 22%\n• **Circadian rhythm management** - Especially important for his frequent travel\n• **Sleep environment optimization** - Temperature, lighting, and noise control\n• **Stress reduction techniques** - Lower cortisol levels improved sleep depth\n• **HRV monitoring** - Used heart rate variability to guide recovery protocols\n\nBetter sleep was foundational to all his other improvements.`;
        }
        
        if (input.includes('travel') || input.includes('singapore') || input.includes('jet lag')) {
            return `Our Singapore travel protocol was highly successful:\n\n• **Pre-travel circadian adjustment** - Started 3 days before departure\n• **Strategic light exposure** - Used light therapy to shift his internal clock\n• **In-flight movement strategy** - Specific exercises to maintain circulation\n• **Arrival day optimization** - Immediate light exposure and activity timing\n• **Nutrition timing** - Meal scheduling to support circadian adaptation\n\nResult: 67% reduction in jet lag recovery time compared to his previous business trips.`;
        }
        
        if (input.includes('stress') || input.includes('work') || input.includes('pressure')) {
            return `Stress management was crucial for Rohan's success:\n\n• **Stress-glucose correlation discovery** - 0.73 correlation coefficient identified\n• **Breathing techniques** - Implemented during high-pressure work periods\n• **HRV biofeedback** - Real-time stress monitoring and management\n• **Work schedule optimization** - Better planning around stressful periods\n• **Recovery protocols** - Active recovery strategies post-stress\n\nManaging stress wasn't just about feeling better - it directly improved his biomarkers.`;
        }
        
        if (input.includes('team') || input.includes('doctor') || input.includes('coach')) {
            return `Rohan worked with our integrated care team:\n\n• **Dr. Warren** (38.5 hours) - Medical oversight and lab interpretation\n• **Carla** (Nutritionist) - Meal planning and nutrition optimization\n• **Rachel** (Personal Trainer) - Workout design and form coaching\n• **Advik** (Performance Scientist) - Data analysis and insights\n• **Ruby** (Concierge) - Care coordination and travel planning\n• **Neel** (Relationship Manager) - Journey oversight\n\nTotal team investment: 91.3 hours of expert guidance over 32 weeks.`;
        }
        
        if (input.includes('data') || input.includes('tracking') || input.includes('monitor')) {
            return `We tracked comprehensive health data for Rohan:\n\n• **Continuous Glucose Monitor** - 24/7 glucose tracking\n• **Heart Rate Variability** - Sleep and stress monitoring\n• **Activity tracking** - Steps, workouts, and movement patterns\n• **Sleep metrics** - Efficiency, deep sleep, and recovery\n• **Lab biomarkers** - Regular blood work and health panels\n• **Subjective measures** - Mood, energy, and wellbeing scores\n\nThis data enabled personalized interventions and real-time adjustments.`;
        }
        
        if (input.includes('exercise') || input.includes('workout') || input.includes('fitness')) {
            return `Rohan's exercise program was carefully optimized:\n\n• **156 total workout sessions** over 32 weeks\n• **Morning timing preference** - Improved sleep quality by 22%\n• **Strength training focus** - Preserved muscle during weight loss\n• **Cardiovascular improvements** - Resting HR dropped from 72 to 58 bpm\n• **Recovery monitoring** - HRV-guided training intensity\n• **Travel adaptations** - Bodyweight routines for business trips\n\nConsistency and smart programming were key to his success.`;
        }
        
        // Default response for unmatched queries
        const defaultResponses = [
            "That's an interesting question! Based on Rohan's 32-week journey, I can share insights about his remarkable transformation. His success came from the integration of personalized nutrition, optimized exercise timing, stress management, and continuous data monitoring. What specific aspect would you like to explore?",
            
            "Great question! Rohan's journey shows how personalized health optimization works. With 1,247 team interactions, 91.3 hours of expert guidance, and continuous biomarker tracking, we achieved remarkable results across all health metrics. Which area interests you most?",
            
            "I'd be happy to help explain that! Rohan's transformation involved multiple integrated strategies. From moving his HbA1c from pre-diabetic to optimal range, to achieving biological age regression, each improvement built on the others. What would you like to dive deeper into?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    showTypingIndicator(container) {
        const indicator = document.createElement('div');
        indicator.className = 'message ai typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    }
    
    hideTypingIndicator(container) {
        const indicator = container.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    logChatInteraction(userMessage, aiResponse) {
        // Log for analytics (in real app, would send to analytics service)
        console.log('Chat Interaction:', {
            timestamp: new Date().toISOString(),
            userMessage: userMessage.substring(0, 100), // Truncate for privacy
            responseGenerated: true,
            sessionId: this.getSessionId()
        });
    }
    
    initializeNavigation() {
        // Handle any navigation elements
        const navItems = document.querySelectorAll('[data-tab]');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });
    }
    
    switchTab(tab) {
        appState.setState('ui.activeTab', tab);
        
        // Update UI based on tab
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => {
            const sectionName = section.dataset.section;
            section.style.display = sectionName === tab ? 'block' : 'none';
        });
        
        // Update active navigation state
        const navItems = document.querySelectorAll('[data-tab]');
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tab);
        });
    }
    
    initializeControls() {
        // Time range selector
        const timeRangeSelect = document.querySelector('#timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                appState.setState('ui.timeRange', e.target.value);
                this.updateDataVisualization();
            });
        }
        
        // Metric filter buttons
        const metricFilters = document.querySelectorAll('.metric-filter');
        metricFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                const metric = e.target.dataset.metric;
                this.toggleMetricVisibility(metric);
            });
        });
        
        // Export button
        const exportBtn = document.querySelector('#exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportHealthData();
            });
        }
    }
    
    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', this.handleResize);
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseRealTimeUpdates();
            } else {
                this.resumeRealTimeUpdates();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // State change listeners
        appState.subscribe((key, newValue, oldValue) => {
            this.handleStateChange(key, newValue, oldValue);
        });
        
        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateVisualizationSizes();
            this.adjustMobileLayout();
        }, 250);
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus chat input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const chatInput = document.querySelector('.chat-input input');
            if (chatInput) {
                chatInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                this.uiComponents.hideModal(activeModal);
            }
        }
    }
    
    handleStateChange(key, newValue, oldValue) {
        console.log(`State changed: ${key}`, { newValue, oldValue });
        
        // Handle specific state changes
        switch (key) {
            case 'ui.activeTab':
                this.onTabChange(newValue, oldValue);
                break;
            case 'ui.timeRange':
                this.onTimeRangeChange(newValue, oldValue);
                break;
            case 'ui.isLoading':
                this.onLoadingStateChange(newValue);
                break;
        }
    }
    
    onTabChange(newTab, oldTab) {
        // Analytics
        this.trackEvent('tab_change', { from: oldTab, to: newTab });
        
        // Load tab-specific data if needed
        if (newTab === 'detailed-analytics' && !this.detailedAnalyticsLoaded) {
            this.loadDetailedAnalytics();
        }
    }
    
    onTimeRangeChange(newRange, oldRange) {
        this.updateDataVisualization();
        this.trackEvent('time_range_change', { from: oldRange, to: newRange });
    }
    
    onLoadingStateChange(isLoading) {
        this.showGlobalLoading(isLoading);
    }
    
    startRealTimeUpdates() {
        // Start heartbeat for real-time updates
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, CONFIG.intervals.heartbeat);
        
        // Start data updates
        this.updateInterval = setInterval(() => {
            this.updateRealTimeData();
        }, CONFIG.intervals.realTimeUpdates);
    }
    
    pauseRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    resumeRealTimeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
        }
    }
    
    async updateRealTimeData() {
        try {
            // Check if we need fresh data
            const lastUpdate = this.dataManager.getCache('healthData_timestamp');
            const now = Date.now();
            
            if (!lastUpdate || (now - lastUpdate) > CONFIG.intervals.realTimeUpdates) {
                // Simulate real-time updates with minor variations
                this.simulateRealTimeUpdates();
                this.dataManager.setCache('healthData_timestamp', now, CONFIG.intervals.realTimeUpdates);
            }
        } catch (error) {
            console.error('Real-time update failed:', error);
        }
    }
    
    simulateRealTimeUpdates() {
        const currentData = appState.getState('healthData');
        if (!currentData) return;
        
        // Simulate minor fluctuations in real-time metrics
        const updates = {};
        let hasUpdates = false;
        
        // Simulate heart rate variations
        if (Math.random() < 0.3) { // 30% chance of HR update
            const currentHR = currentData.metrics.restingHR.current;
            const variation = (Math.random() - 0.5) * 2; // ±1 bpm
            updates.restingHR = Math.max(55, Math.min(65, currentHR + variation));
            hasUpdates = true;
        }
        
        if (hasUpdates) {
            // Update state and UI
            Object.entries(updates).forEach(([metric, value]) => {
                appState.setState(`healthData.metrics.${metric}.current`, value);
            });
            
            // Update specific metric cards
            this.updateMetricCards(updates);
            
            // Show subtle notification
            this.showRealtimeUpdateNotification();
        }
    }
    
    updateMetricCards(updates) {
        Object.entries(updates).forEach(([metric, value]) => {
            const card = document.querySelector(`[data-metric="${metric}"] .metric-value`);
            if (card) {
                // Add pulse animation
                card.classList.add('pulse-update');
                
                // Update value
                setTimeout(() => {
                    const unit = metric === 'restingHR' ? 'bpm' : '';
                    card.textContent = `${value.toFixed(0)}${unit}`;
                    card.classList.remove('pulse-update');
                }, 150);
            }
        });
    }
    
    showRealtimeUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'realtime-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">📊</div>
                <div class="notification-text">Real-time data updated</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    sendHeartbeat() {
        // In a real application, this would ping the server
        // to maintain connection and sync status
        const status = {
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            isActive: !document.hidden,
            loadTime: Date.now() - this.initStartTime
        };
        
        // Log heartbeat (in real app, would send to server)
        console.log('Heartbeat:', status);
    }
    
    updateDataVisualization() {
        const timeRange = appState.getState('ui.timeRange');
        const healthData = appState.getState('healthData');
        
        if (!healthData) return;
        
        // Filter data based on time range
        const filteredData = this.filterDataByTimeRange(healthData.timeline, timeRange);
        
        // Re-render timeline
        this.renderTimelineVisualization(filteredData);
        
        // Update other visualizations as needed
        this.updateInsightsForTimeRange(timeRange);
    }
    
    filterDataByTimeRange(data, range) {
        switch (range) {
            case '8-weeks':
                return data.slice(-8);
            case '16-weeks':
                return data.slice(-16);
            case '32-weeks':
            default:
                return data;
        }
    }
    
    updateInsightsForTimeRange(timeRange) {
        // Update insights based on selected time range
        const insights = this.generateTimeRangeInsights(timeRange);
        const insightsContainer = document.querySelector('.insights-panel');
        
        if (insightsContainer) {
            this.renderInsights(insights);
        }
    }
    
    generateTimeRangeInsights(timeRange) {
        const baseInsights = appState.getState('healthData.insights') || [];
        
        // Filter or modify insights based on time range
        switch (timeRange) {
            case '8-weeks':
                return baseInsights.filter(insight => 
                    insight.category === 'Performance' || insight.category === 'Behavioral'
                );
            case '16-weeks':
                return baseInsights.filter(insight => insight.impact === 'High');
            case '32-weeks':
            default:
                return baseInsights;
        }
    }
    
    toggleMetricVisibility(metric) {
        const currentVisible = appState.getState(`ui.visibleMetrics.${metric}`) !== false;
        appState.setState(`ui.visibleMetrics.${metric}`, !currentVisible);
        
        // Update visualization
        const metricElements = document.querySelectorAll(`[data-metric="${metric}"]`);
        metricElements.forEach(element => {
            element.style.opacity = currentVisible ? '0.3' : '1';
            element.style.pointerEvents = currentVisible ? 'none' : 'auto';
        });
    }
    
    async exportHealthData() {
        try {
            const healthData = appState.getState('healthData');
            const conversationData = appState.getState('conversationData');
            
            const exportData = {
                generatedAt: new Date().toISOString(),
                timeRange: appState.getState('ui.timeRange'),
                metrics: healthData?.metrics,
                timeline: healthData?.timeline,
                insights: healthData?.insights,
                conversationSummary: {
                    totalMessages: conversationData?.totalMessages,
                    topicBreakdown: conversationData?.topics
                }
            };
            
            // Create and download file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `elyx-health-data-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            // Show success notification
            this.showNotification('Health data exported successfully!', 'success');
            
            // Track export event
            this.trackEvent('data_export', { format: 'json', dataPoints: Object.keys(exportData).length });
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Failed to export data. Please try again.', 'error');
        }
    }
    
    updateVisualizationSizes() {
        // Recalculate and update visualization dimensions
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            const svg = timelineContainer.querySelector('svg');
            if (svg) {
                const containerWidth = timelineContainer.offsetWidth;
                svg.setAttribute('width', containerWidth);
            }
        }
        
        // Update chart responsiveness
        this.triggerChartResize();
    }
    
    adjustMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        
        // Adjust chat interface for mobile
        const chatInterface = document.querySelector('.chat-interface');
        if (chatInterface) {
            chatInterface.style.height = isMobile ? '300px' : '500px';
        }
        
        // Adjust metric cards layout
        const dashboard = document.querySelector('.dashboard');
        if (dashboard && isMobile) {
            dashboard.style.gridTemplateColumns = '1fr';
        }
    }
    
    triggerChartResize() {
        // Trigger resize events for any charts that need it
        window.dispatchEvent(new Event('resize'));
    }
    
    showGlobalLoading(show) {
        let loader = document.getElementById('global-loader');
        
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'global-loading-overlay';
            loader.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading health data...</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
            if (!show) {
                setTimeout(() => {
                    if (loader && loader.style.display === 'none') {
                        loader.remove();
                    }
                }, 300);
            }
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 5 seconds
        const autoHide = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Manual close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideNotification(notification);
        });
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    showError(message) {
        console.error('Application Error:', message);
        this.showNotification(message, 'error');
    }
    
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.showError('An unexpected error occurred. Please refresh the page.');
        
        // Log error for monitoring
        this.logError(event.error);
    }
    
    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showError('A system error occurred. Please try again.');
        
        // Log error
        this.logError(event.reason);
    }
    
    handleInitializationError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'initialization-error';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>Unable to Load Dashboard</h2>
                <p>We're experiencing technical difficulties loading your health dashboard.</p>
                <p class="error-details">${error.message}</p>
                <button class="retry-button" onclick="location.reload()">Retry</button>
            </div>
        `;
        
        document.body.appendChild(errorContainer);
    }
    
    logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // In a real application, this would be sent to an error monitoring service
        console.log('Error logged:', errorLog);
    }
    
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            properties: {
                ...properties,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        // In a real application, this would be sent to an analytics service
        console.log('Event tracked:', event);
    }
    
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
        }
        return this.sessionId;
    }
    
    triggerInitialAnimations() {
        // Add staggered animations to metric cards
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-scale-in');
            }, index * 100);
        });
        
        // Animate insights panel
        setTimeout(() => {
            const insightsPanel = document.querySelector('.insights-panel');
            if (insightsPanel) {
                insightsPanel.classList.add('animate-slide-up');
            }
        }, 500);
        
        // Animate timeline
        setTimeout(() => {
            const timeline = document.querySelector('.timeline-container');
            if (timeline) {
                timeline.classList.add('animate-fade-in');
            }
        }, 800);
    }
    
    updateConversationInterface() {
        const conversationData = appState.getState('conversationData');
        if (!conversationData) return;
        
        // Update conversation stats in header if they exist
        const messageCountElement = document.querySelector('[data-stat="messages"] .stat-number');
        if (messageCountElement) {
            messageCountElement.textContent = conversationData.totalMessages.toLocaleString();
        }
        
        // Update any conversation visualization
        this.updateConversationVisualization(conversationData);
    }
    
    updateConversationVisualization(data) {
        // This could render conversation topic charts, sentiment analysis, etc.
        console.log('Conversation data ready for visualization:', data);
    }
    
    async loadDetailedAnalytics() {
        try {
            this.detailedAnalyticsLoaded = true;
            
            // Simulate loading detailed analytics
            await this.dataManager.delay(1000);
            
            // In real app, would fetch additional analytics data
            console.log('Detailed analytics loaded');
            
        } catch (error) {
            console.error('Failed to load detailed analytics:', error);
        }
    }
    
    // Cleanup method
    destroy() {
        // Clear intervals
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        
        // Clear cache
        this.dataManager.cache.clear();
        this.dataManager.cacheExpiry.clear();
        
        // Reset state
        this.isInitialized = false;
        
        console.log('🧹 Elyx Health Dashboard cleaned up');
    }
}

// ===== GLOBAL INSTANCES =====
const appState = new AppState();
const elyxApp = new ElyxHealthApp();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🎯 DOM Content Loaded - Starting Elyx Health Dashboard');
        
        // Record initialization start time
        elyxApp.initStartTime = Date.now();
        
        // Initialize the application
        await elyxApp.init();
        
        // Make app globally available for debugging
        if (typeof window !== 'undefined') {
            window.elyxApp = elyxApp;
            window.appState = appState;
        }
        
        console.log('🎉 Elyx Health Dashboard ready!');
        
    } catch (error) {
        console.error('💥 Failed to initialize Elyx Health Dashboard:', error);
        
        // Show fallback error UI
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div>
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Dashboard Unavailable</h1>
                    <p style="margin-bottom: 2rem; opacity: 0.8;">
                        We're experiencing technical difficulties loading the health dashboard.
                    </p>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(45deg, #1abc9c, #00d4ff);
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                    ">
                        Reload Page
                    </button>
                    <div style="margin-top: 2rem; font-size: 0.875rem; opacity: 0.6;">
                        Error: ${error.message}
                    </div>
                </div>
            </div>
        `;
    }
});

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format numbers with appropriate suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {number} Percentage change
 */
function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Generate a random ID string
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get browser information
 * @returns {Object} Browser info object
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }
    
    return { browser, version };
}

/**
 * Format date for display
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'medium') {
    const d = new Date(date);
    
    const options = {
        short: { month: 'short', day: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }
    };
    
    return d.toLocaleDateString('en-US', options[format] || options.medium);
}

/**
 * Format time for display
 * @param {Date|string|number} time - Time to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
function formatTime(time, includeSeconds = false) {
    const t = new Date(time);
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    };
    
    if (includeSeconds) {
        options.second = '2-digit';
    }
    
    return t.toLocaleTimeString('en-US', options);
}

/**
 * Calculate time ago from a given date
 * @param {Date|string|number} date - Date to calculate from
 * @returns {string} Time ago string
 */
function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top in pixels
 */
function scrollToElement(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            textArea.remove();
            return successful;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Download data as file
 * @param {string} data - Data to download
 * @param {string} filename - Name of the file
 * @param {string} type - MIME type
 */
function downloadFile(data, filename, type = 'application/json') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// ===== PERFORMANCE MONITORING =====

/**
 * Simple performance monitor
 */
class PerformanceMonitor {
    constructor() {
        this.marks = new Map();
        this.measures = new Map();
    }
    
    mark(name) {
        this.marks.set(name, performance.now());
    }
    
    measure(name, startMark, endMark = null) {
        const startTime = this.marks.get(startMark);
        const endTime = endMark ? this.marks.get(endMark) : performance.now();
        
        if (startTime !== undefined && endTime !== undefined) {
            const duration = endTime - startTime;
            this.measures.set(name, duration);
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
            return duration;
        }
        
        return null;
    }
    
    getMeasure(name) {
        return this.measures.get(name);
    }
    
    getAllMeasures() {
        return Array.from(this.measures.entries()).map(([name, duration]) => ({
            name,
            duration
        }));
    }
    
    clear() {
        this.marks.clear();
        this.measures.clear();
    }
}

// Create global performance monitor
const performanceMonitor = new PerformanceMonitor();

// ===== ERROR BOUNDARY =====

/**
 * Global error boundary for unhandled errors
 */
class ErrorBoundary {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 5;
        this.setupGlobalHandlers();
    }
    
    setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'Global Error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });
    }
    
    handleError(error, context) {
        this.errorCount++;
        
        console.error(`${context}:`, error);
        
        // Log error details
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context
        };
        
        // In a real application, send to error monitoring service
        console.log('Error details:', errorInfo);
        
        // Show user-friendly error message
        if (this.errorCount <= this.maxErrors) {
            this.showErrorNotification(error.message || 'An unexpected error occurred');
        }
        
        // If too many errors, suggest page reload
        if (this.errorCount > this.maxErrors) {
            this.showCriticalErrorMessage();
        }
    }
    
    showErrorNotification(message) {
        // Use the app's notification system if available
        if (window.elyxApp && window.elyxApp.showNotification) {
            window.elyxApp.showNotification(message, 'error');
        } else {
            // Fallback notification
            console.error('Error:', message);
        }
    }
    
    showCriticalErrorMessage() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="margin-bottom: 1rem;">⚠️ Multiple Errors Detected</h2>
                <p style="margin-bottom: 2rem; opacity: 0.8;">
                    The application has encountered several errors. Please reload the page to continue.
                </p>
                <button onclick="location.reload()" style="
                    background: #e74c3c;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                    Reload Page
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
}

// Initialize error boundary
const errorBoundary = new ErrorBoundary();

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ElyxHealthApp,
        AppState,
        DataManager,
        UIComponents,
        EventManager,
        PerformanceMonitor,
        ErrorBoundary,
        utils: {
            debounce,
            throttle,
            formatNumber,
            calculatePercentageChange,
            generateId,
            isValidEmail,
            deepClone,
            isMobileDevice,
            getBrowserInfo,
            formatDate,
            formatTime,
            timeAgo,
            scrollToElement,
            copyToClipboard,
            downloadFile
        }
    };
}

// ===== DEVELOPMENT HELPERS =====
if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    // Development-only features
    console.log('🔧 Development mode detected');
    
    // Add global debugging helpers
    window.DEBUG = {
        state: () => console.table(appState.data),
        cache: () => console.log(elyxApp?.dataManager?.cache),
        performance: () => console.table(performanceMonitor.getAllMeasures()),
        errors: () => console.log('Error count:', errorBoundary.errorCount)
    };
    
    // Performance logging
    performanceMonitor.mark('app-start');
    
    window.addEventListener('load', () => {
        performanceMonitor.mark('app-loaded');
        performanceMonitor.measure('Total Load Time', 'app-start', 'app-loaded');
    });
}

console.log('📋 Main.js loaded successfully - Elyx Health Dashboard ready for initialization');
