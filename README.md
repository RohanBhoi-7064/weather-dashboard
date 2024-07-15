# SkyFlow Weather

A clean, responsive weather dashboard built with raw HTML, CSS, and JavaScript. It retrieves real-time weather telemetry (forecast, temperature, wind, humidity) using the Open-Meteo API.

---

## Features

- **Real-Time Data**: Fetches live geocoding coordinates and meteorological data for searched cities.
- **Glassmorphic UI**: Premium frosted glass layout styling with responsive flex and grid outlines.
- **Query Alias mapping**: Auto-maps general state or country queries (like "Odisha" or "India") to their corresponding capital cities to ensure accurate results.
- **Offline/No-API Fallback**: If geocoding fails or there is no network connection, a procedural fallback engine generates and displays calculated weather forecasts based on the query name hash.

---

## Getting Started

### Run locally
1. Clone the repository:
   ```bash
   git clone https://github.com/RohanBhoi-7064/weather-dashboard.git
   cd weather-dashboard
   ```
2. Open `index.html` in your web browser.
3. Search for any city (e.g., "Bhubaneswar", "Mumbai", "London") to see live weather telemetry.
