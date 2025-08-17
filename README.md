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

    ├── button2.html                # Main dashboard UI
    ├── index (1).html              # Alternative dashboard view with stats & insights
    ├── elyx_aichatbot.html       # Interactive AI Chatbot 
    ├── elyx_journey_with_advik (1).html # Timeline journey with milestones, stats & chat replay
    ├── elyx_journey_json.json    # Core JSON dataset (journey data, team, stats, conversations)
    ├── sleep_efficiency_graph.html # Sleep efficiency progress visualization
    ├── script.js                 # Core logic: charts, stats population, dark mode, journey features
    ├── styles.css                # Global glassmorphism & dashboard theme
    ├── styles_biomarker.css      # Biomarker dashboard styles

------------------------------------------------------------------------

## 🚀 Features

### 1. **Main Dashboard (`button2.html`)**

-   It is the main webpage.
-   Displays names of elyx team members, has buttons which lead to other pages and also, displays the conclusions of the 8-month journey.
  
### 2. **Real-time Biomarker Tracking (`index (1).html`)**

-   Displays summary stats, team members, biomarkers, milestones, and
    transformation insights.\
-   Charts powered by **Chart.js** with smooth gradients.\
-   Supports **Dark Mode toggle**.

### 3. **AI Chatbot🤖 (`elyx_aichatbot.html`)**

-   Answers queries regarding **Rohan's** 8-month journey based on the conversation provided.\
-   Clean, modern UI with sliding animations.
-   <img width="1125" height="868" alt="image" src="https://github.com/user-attachments/assets/bd775830-734a-4e6e-b19b-adfbe1ef3022" />
-   <img width="827" height="793" alt="image" src="https://github.com/user-attachments/assets/3326a7c5-9a49-4d9a-b8c6-479728de8250" />

### 4. **Health Journey Timeline (`elyx_journey_with_advik (1).html`)**

-   Complete **8-month timeline** of conversations.\
-   Filters: **Month 1 journey, Month 2 results, milestones, critical moments, Advik's
    analysis, travel weeks, complete journey, reset option**.\
-   WhatsApp-style chat layout with role-based highlights.

### 5. **Sleep Efficiency Graph (`sleep_efficiency_graph.html`)**

-   Detailed sleep analysis with milestones.\
-   Shows **sleep duration, efficiency, deep sleep, and exercise
    correlations**.

### 6. **Journey Data (`elyx_journey_json.json`)**

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
## 🦙Pre-requisites

-  Ollama (llama3) should be installed in your local device to run the AI Chatbot. [download and install it from: https://ollama.com/]

------------------------------------------------------------------------
## ▶️ Usage

1.  Clone the repository or download the files.\
2.  Open `button2.html` in a browser to view the **main dashboard**.\
3.  Explore:
    -   `index (1).html` → alternative dashboard\
    -   `elyx_aichatbot.html` → AI chatbot\
    -   `elyx_journey_with_advik (1).html` → timeline journey\
    -   `sleep_efficiency_graph.html` → sleep analysis

------------------------------------------------------------------------

## 🌙 Extra Features

-   **Dark Mode Toggle** -- implemented in `script.js`.\
-   **Interactive Charts** -- hover tooltips with status messages (e.g.,
    HbA1c levels).\
-   **AI Insights Panel** -- Advik's analysis included throughout.

------------------------------------------------------------------------

## 👨‍💻 Credits

Developed as part of **Elyx Health Journey Visualization Project** for **Elyx Hackathon 2025**.\
Inspired by real-world **digital health coaching** platforms and
AI-driven personal health tracking.

------------------------------------------------------------------------

## 👩‍🎓Authors
   Aayushi Sinha - IIT Roorkee 
   Aakriti - IIT Roorkee
