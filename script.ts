* ==========================================
   1. DATA / STATE
   ========================================== */
const state = {
    city: '',
    temperature: null,
    apparentTemperature: null,
    weatherCode: null,
    description: '',
    emoji: '☀️',
    error: null
};


/* ==========================================
   2. BUSINESS / LOGIC RULES
   ========================================== */

// Map WMO weather codes to user-friendly descriptions and emojis
function interpretWeatherCode(code) {
    const weatherMap = {
        0: { desc: 'Clear sky', emoji: '☀️' },
        1: { desc: 'Mainly clear', emoji: '🌤️' },
        2: { desc: 'Partly cloudy', emoji: '⛅' },
        3: { desc: 'Overcast', emoji: '☁️' },
        45: { desc: 'Foggy', emoji: '🌫️' },
        48: { desc: 'Depositing rime fog', emoji: '🌫️' },
        51: { desc: 'Light drizzle', emoji: '🌧️' },
        53: { desc: 'Moderate drizzle', emoji: '🌧️' },
        55: { desc: 'Dense drizzle', emoji: '🌧️' },
        61: { desc: 'Slight rain', emoji: '🌦️' },
        63: { desc: 'Moderate rain', emoji: '🌧️' },
        65: { desc: 'Heavy rain', emoji: '🌧️' },
        71: { desc: 'Slight snow fall', emoji: '🌨️' },
        73: { desc: 'Moderate snow fall', emoji: '❄️' },
        75: { desc: 'Heavy snow fall', emoji: '❄️' },
        80: { desc: 'Slight rain showers', emoji: '🌦️' },
        81: { desc: 'Moderate rain showers', emoji: '🌧️' },
        82: { desc: 'Violent rain showers', emoji: '⛈️' },
        95: { desc: 'Thunderstorm', emoji: '⚡' },
        96: { desc: 'Thunderstorm with slight hail', emoji: '🌩️' },
        99: { desc: 'Thunderstorm with heavy hail', emoji: '🌩️' }
    };

    return weatherMap[code] || { desc: 'Unknown conditions', emoji: '🌈' };
}

// Fetch coordinates for city name from Open-Meteo Geocoding API
async function fetchCityCoordinates(cityName) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
    
    if (!response.ok) {
        throw new Error("Unable to connect to location server.");
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please check your spelling and try again.");
    }
    
    return {
        name: data.results[0].name,
        country: data.results[0].country || '',
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude
    };
}

// Fetch current temperature and condition code from Open-Meteo Weather API
async function fetchWeatherData(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`);
    
    if (!response.ok) {
        throw new Error("Unable to fetch weather details at this time.");
    }

    const data = await response.json();
    
    if (!data.current) {
        throw new Error("Weather data for this location is unavailable.");
    }
    
    return data.current;
}

// Coordinate flow when user searches
async function handleSearch(cityName) {
    try {
        clearError();
        
        if (!cityName.trim()) {
            throw new Error("Please enter a city name.");
        }

        // 1. Fetch location
        const location = await fetchCityCoordinates(cityName);
        state.city = `${location.name}${location.country ? ', ' + location.country : ''}`;

        // 2. Fetch current weather
        const current = await fetchWeatherData(location.latitude, location.longitude);
        state.temperature = Math.round(current.temperature_2m);
        state.apparentTemperature = Math.round(current.apparent_temperature);
        state.weatherCode = current.weather_code;

        // 3. Interpret condition code
        const weatherDetails = interpretWeatherCode(state.weatherCode);
        state.description = weatherDetails.desc;
        state.emoji = weatherDetails.emoji;
        state.error = null;

        renderWeather();
    } catch (err) {
        state.error = err.message;
        renderError();
    }
}


/* ==========================================
   3. DISPLAY / UI CONTROLLERS
   ========================================== */

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const apparentTempEl = document.getElementById('apparent-temp');
const weatherDescEl = document.getElementById('weather-desc');
const weatherEmojiEl = document.getElementById('weather-emoji');

// Event Listeners
searchBtn.addEventListener('click', () => {
    handleSearch(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch(cityInput.value);
    }
});

function renderWeather() {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    cityNameEl.textContent = state.city;
    temperatureEl.textContent = state.temperature;
    apparentTempEl.textContent = state.apparentTemperature;
    weatherDescEl.textContent = state.description;
    weatherEmojiEl.textContent = state.emoji;
}

function renderError() {
    weatherCard.classList.add('hidden');
    errorMessage.textContent = state.error;
    errorMessage.classList.remove('hidden');
}

function clearError() {
    state.error = null;
    errorMessage.classList.add('hidden');
}
