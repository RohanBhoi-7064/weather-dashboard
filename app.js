/**
 * SkyFlow Weather Dashboard Core Logic
 * Author: Rohan Bhoi
 * Date: July 15, 2024
 */

// UI Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loader = document.getElementById('loader');
const weatherDataWrapper = document.getElementById('weather-data-wrapper');

// Weather Display Elements
const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const currentTempEl = document.getElementById('current-temp');
const weatherEmojiEl = document.getElementById('weather-emoji');
const weatherDescEl = document.getElementById('weather-description');
const humidityValEl = document.getElementById('humidity-val');
const windValEl = document.getElementById('wind-val');
const feelsLikeValEl = document.getElementById('feels-like-val');
const uvValEl = document.getElementById('uv-val');
const forecastGrid = document.getElementById('forecast-grid');

// Mock Data Database for key cities
const mockDatabase = {
    odisha: {
        name: "Odisha, India",
        temp: 34,
        desc: "Hot & Sunny",
        emoji: "☀️",
        humidity: 62,
        wind: 14,
        feelsLike: 38,
        uv: "Very High (9)",
        forecast: [
            { day: "Wed", temp: 35, emoji: "☀️", desc: "Sunny" },
            { day: "Thu", temp: 33, emoji: "⛅", desc: "Partly Cloudy" },
            { day: "Fri", temp: 31, emoji: "🌧️", desc: "Light Showers" },
            { day: "Sat", temp: 30, emoji: "⛈️", desc: "Thunderstorm" },
            { day: "Sun", temp: 32, emoji: "⛅", desc: "Partly Cloudy" }
        ]
    },
    london: {
        name: "London, UK",
        temp: 18,
        desc: "Light Drizzle",
        emoji: "🌦️",
        humidity: 82,
        wind: 22,
        feelsLike: 17,
        uv: "Low (3)",
        forecast: [
            { day: "Wed", temp: 19, emoji: "☁️", desc: "Overcast" },
            { day: "Thu", temp: 21, emoji: "⛅", desc: "Partly Cloudy" },
            { day: "Fri", temp: 17, emoji: "🌧️", desc: "Rainy" },
            { day: "Sat", temp: 16, emoji: "🌧️", desc: "Showers" },
            { day: "Sun", temp: 18, emoji: "⛅", desc: "Mostly Sunny" }
        ]
    },
    tokyo: {
        name: "Tokyo, Japan",
        temp: 26,
        desc: "Partly Cloudy",
        emoji: "⛅",
        humidity: 55,
        wind: 11,
        feelsLike: 27,
        uv: "Moderate (5)",
        forecast: [
            { day: "Wed", temp: 28, emoji: "☀️", desc: "Clear" },
            { day: "Thu", temp: 27, emoji: "⛅", desc: "Partly Cloudy" },
            { day: "Fri", temp: 25, emoji: "☁️", desc: "Cloudy" },
            { day: "Sat", temp: 24, emoji: "🌧️", desc: "Rainy" },
            { day: "Sun", temp: 26, emoji: "⛅", desc: "Clear intervals" }
        ]
    },
    newyork: {
        name: "New York, USA",
        temp: 22,
        desc: "Clear & Breezy",
        emoji: "💨",
        humidity: 48,
        wind: 19,
        feelsLike: 22,
        uv: "Moderate (5)",
        forecast: [
            { day: "Wed", temp: 24, emoji: "☀️", desc: "Sunny" },
            { day: "Thu", temp: 25, emoji: "☀️", desc: "Sunny" },
            { day: "Fri", temp: 21, emoji: "⛅", desc: "Partly Cloudy" },
            { day: "Sat", temp: 20, emoji: "☁️", desc: "Cloudy" },
            { day: "Sun", temp: 23, emoji: "☀️", desc: "Clear" }
        ]
    }
};

// Procedural Generator for cities not in the database
function generateProceduralWeather(cityName) {
    let hash = 0;
    const cleanName = cityName.trim().toLowerCase();
    for (let i = 0; i < cleanName.length; i++) {
        hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const temp = 10 + (hash % 28);
    const humidity = 40 + (hash % 50);
    const wind = 5 + (hash % 30);
    const feelsLike = Math.round(temp + (humidity > 70 ? 2 : -1));
    const uvIndex = 1 + (hash % 10);
    const uvText = uvIndex < 4 ? "Low" : uvIndex < 7 ? "Moderate" : "High";

    const conditions = [
        { desc: "Sunny & Warm", emoji: "☀️" },
        { desc: "Partly Cloudy", emoji: "⛅" },
        { desc: "Overcast Clouds", emoji: "☁️" },
        { desc: "Light Rain Showers", emoji: "🌦️" },
        { desc: "Breezy & Clear", emoji: "💨" },
        { desc: "Stormy & Windy", emoji: "⛈️" }
    ];
    const cond = conditions[hash % conditions.length];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = new Date().getDay();
    const forecast = [];

    for (let i = 1; i <= 5; i++) {
        const dayName = daysOfWeek[(currentDayIndex + i) % 7];
        const dayHash = hash + i;
        const dayCond = conditions[dayHash % conditions.length];
        forecast.push({
            day: dayName,
            temp: temp + (dayHash % 6) - 3,
            emoji: dayCond.emoji,
            desc: dayCond.desc
        });
    }

    const formattedCityName = cityName.trim().replace(/\b\w/g, c => c.toUpperCase());

    return {
        name: formattedCityName,
        temp,
        desc: cond.desc,
        emoji: cond.emoji,
        humidity,
        wind,
        feelsLike,
        uv: `${uvText} (${uvIndex})`,
        forecast
    };
}

// Format Date Utility
function getFormattedDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Render Data to DOM
function renderWeather(data) {
    cityNameEl.textContent = data.name;
    currentDateEl.textContent = getFormattedDate();
    currentTempEl.textContent = `${data.temp}°C`;
    weatherEmojiEl.textContent = data.emoji;
    weatherDescEl.textContent = data.desc;
    humidityValEl.textContent = `${data.humidity}%`;
    windValEl.textContent = `${data.wind} km/h`;
    feelsLikeValEl.textContent = `${data.feelsLike}°C`;
    uvValEl.textContent = data.uv;

    // Render 5-Day Outlook
    forecastGrid.innerHTML = '';
    data.forecast.forEach(item => {
        const row = document.createElement('div');
        row.className = 'forecast-item';
        row.innerHTML = `
            <span class="forecast-day">${item.day}</span>
            <div class="forecast-condition">
                <span class="forecast-emoji">${item.emoji}</span>
                <span>${item.desc}</span>
            </div>
            <span class="forecast-temp">${item.temp}°C</span>
        `;
        forecastGrid.appendChild(row);
    });
}

// Fetch Controller (API call with graceful procedural fallback)
async function fetchWeatherData(city) {
    weatherDataWrapper.classList.add('hidden');
    loader.classList.remove('hidden');

    await new Promise(resolve => setTimeout(resolve, 850));

    const queryKey = city.trim().toLowerCase().replace(/\s+/g, '');
    let weatherData;

    if (mockDatabase[queryKey]) {
        weatherData = mockDatabase[queryKey];
    } else {
        weatherData = generateProceduralWeather(city);
    }

    renderWeather(weatherData);
    loader.classList.add('hidden');
    weatherDataWrapper.classList.remove('hidden');
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    if (city.trim()) {
        fetchWeatherData(city);
    }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('Odisha');
});
