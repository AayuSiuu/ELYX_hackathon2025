# Elyx Health Journey -- Rohan's Transformation

## 📖 Overview

This project is a **health journey visualization platform** that
showcases an **8-month transformation story** using interactive
dashboards, timelines, chat simulations, and AI-powered insights.

It combines multiple components:\
- **Dashboards** with biomarker and lifestyle metrics.\
- **Interactive Chatbot** simulating conversations with coaches,
doctors, and scientists.\
- **Complete Journey Timeline** with milestones, travel weeks, and
Advik's (AI Scientist) analysis.\
- **Visual Analytics** including HbA1c, weight loss, and sleep
efficiency charts.

------------------------------------------------------------------------

## 📂 Project Structure

    ├── index.html                # Main dashboard UI
    ├── button2.html              # Alternative dashboard view with stats & insights
    ├── elyx_aichatbot.html       # Interactive AI Chatbot (Path B)
    ├── elyx_journey_with_advik.html # Timeline journey with milestones, stats & chat replay
    ├── elyx_journey_json.json    # Core JSON dataset (journey data, team, stats, conversations)
    ├── sleep_efficiency_graph.html # Sleep efficiency progress visualization
    ├── script.js                 # Core logic: charts, stats population, dark mode, journey features
    ├── styles.css                # Global glassmorphism & dashboard theme
    ├── styles_biomarker.css      # Biomarker dashboard styles

------------------------------------------------------------------------

## 🚀 Features

### 1. **Main Dashboard (`index.html`)**

-   Displays summary stats, team members, biomarkers, milestones, and
    transformation insights.\
-   Charts powered by **Chart.js** with smooth gradients.\
-   Supports **Dark Mode toggle**.

### 2. **AI Chatbot (`elyx_aichatbot.html`)**

-   Simulates a personalized chat between **Rohan** and Elyx team
    members.\
-   Clean, modern UI with sliding animations.

### 3. **Health Journey Timeline (`elyx_journey_with_advik.html`)**

-   Complete **8-month timeline** of conversations.\
-   Filters: **Month 1 journey, milestones, critical moments, Advik's
    analysis, travel weeks**.\
-   WhatsApp-style chat layout with role-based highlights.

### 4. **Sleep Efficiency Graph (`sleep_efficiency_graph.html`)**

-   Detailed sleep analysis with milestones.\
-   Shows **sleep duration, efficiency, deep sleep, and exercise
    correlations**.

### 5. **Journey Data (`elyx_journey_json.json`)**

-   Stores **summary stats, team members, and weekly conversations**.\
-   Serves as the data source for **script.js** and dashboard
    visualizations.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3 (custom + Bootstrap 5), JavaScript (ES6)\
-   **Charts & Visualization:** Chart.js, Chart.js Annotation plugin\
-   **Styling:** Glassmorphism, gradient themes, responsive layout\
-   **Data:** JSON file (`elyx_journey_json.json`)

------------------------------------------------------------------------

## 📊 Key Insights

-   **Weight Loss:** -9.2kg\
-   **Final HbA1c:** 5.1% (normalized)\
-   **Sleep Efficiency:** Improved from 68% → 83%\
-   **Workout Sessions:** 156\
-   **Travel Trips:** 12\
-   **Plan Adjustments:** 24

------------------------------------------------------------------------

## ▶️ Usage

1.  Clone the repository or download the files.\
2.  Open `index.html` in a browser to view the **main dashboard**.\
3.  Explore:
    -   `button2.html` → alternative dashboard\
    -   `elyx_aichatbot.html` → AI chatbot\
    -   `elyx_journey_with_advik.html` → timeline journey\
    -   `sleep_efficiency_graph.html` → sleep analysis

------------------------------------------------------------------------

## 🌙 Extra Features

-   **Dark Mode Toggle** -- implemented in `script.js`.\
-   **Interactive Charts** -- hover tooltips with status messages (e.g.,
    HbA1c levels).\
-   **AI Insights Panel** -- Advik's analysis included throughout.

------------------------------------------------------------------------

## 👨‍💻 Credits

Developed as part of **Elyx Health Journey Visualization Project**.\
Inspired by real-world **digital health coaching** platforms and
AI-driven personal health tracking.
