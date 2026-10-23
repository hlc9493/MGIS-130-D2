/* ==========================================
   1. DATA / STATE
   ========================================== */
const state = {
    user: { name: '', tolerance: 'neutral' },
    city: '',
    temperature: null,
    apparentTemperature: null,
    weatherCode: null,
    description: '',
    emoji: '☀️',
    error: null,
    isLoading: false
};

const STORAGE_KEY = 'pastel_weather_user_prefs';


/* ==========================================
   2. BUSINESS / LOGIC RULES
   ========================================== */

function loadSavedPreferences() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.user.name = parsed.name || '';
            state.user.tolerance = parsed.tolerance || 'neutral';
        }
    } catch (e) {
        console.warn("Could not read preferences", e);
    }
}

function savePreferences(name, tolerance) {
    state.user.name = name.trim();
    state.user.tolerance = tolerance;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
    } catch (e) {
        console.warn("Could not save preferences", e);
    }
}

function getComfortCommentary(tempF, tolerance) {
    if (tolerance === 'cold' && tempF < 60) return "Might feel extra chilly to you! 🧣";
    if (tolerance === 'cold' && tempF > 75) return "Nice and warm for you! ☀️";
    if (tolerance === 'hot' && tempF > 75) return "Might feel extra hot for you! 🍦";
    if (tolerance === 'hot' && tempF < 60) return "Refreshing weather for you! 🍃";
    return "";
}

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
        96: { desc: 'Thunderstorm with hail', emoji: '🌩️' },
        99: { desc: 'Heavy thunderstorm', emoji: '🌩️' }
    };
    return weatherMap[code] || { desc: 'Unknown conditions', emoji: '🌈' };
}

async function fetchCityCoordinates(cityName) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
    if (!response.ok) throw new Error("Unable to connect to location server.");
    
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

async function fetchWeatherData(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`);
    if (!response.ok) throw new Error("Unable to fetch weather details at this time.");

    const data = await response.json();
    if (!data.current) throw new Error("Weather data for this location is unavailable.");
    
    return data.current;
}

async function handleSearch(cityName) {
    try {
        clearError();
        if (!cityName || !cityName.trim()) throw new Error("Please enter a city name.");

        setLoading(true);

        const location = await fetchCityCoordinates(cityName);
        state.city = `${location.name}${location.country ? ', ' + location.country : ''}`;

        const current = await fetchWeatherData(location.latitude, location.longitude);
        state.temperature = Math.round(current.temperature_2m);
        state.apparentTemperature = Math.round(current.apparent_temperature);
        state.weatherCode = current.weather_code;

        const weatherDetails = interpretWeatherCode(state.weatherCode);
        state.description = weatherDetails.desc;
        state.emoji = weatherDetails.emoji;
        state.error = null;

        renderWeather();
    } catch (err) {
        state.error = err.message;
        renderError();
    } finally {
        setLoading(false);
    }
}


/* ==========================================
   3. DISPLAY / UI CONTROLLERS
   ========================================== */

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsBox = document.getElementById('settings-box');
const userNameInput = document.getElementById('user-name-input');
const saveSettingsBtn = document.getElementById('save-settings-btn');

const greetingTitle = document.getElementById('greeting-title');
const greetingSubtitle = document.getElementById('greeting-subtitle');

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const apparentTempEl = document.getElementById('apparent-temp');
const preferenceNoteEl = document.getElementById('preference-note');
const weatherDescEl = document.getElementById('weather-desc');
const weatherEmojiEl = document.getElementById('weather-emoji');

// Event Listeners
if (settingsToggleBtn) {
    settingsToggleBtn.addEventListener('click', () => {
        settingsBox.classList.toggle('hidden');
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        const selectedTolerance = document.querySelector('input[name="temp-preference"]:checked')?.value || 'neutral';
        savePreferences(userNameInput.value, selectedTolerance);
        updateHeaderGreeting();
        settingsBox.classList.add('hidden');
        if (state.temperature !== null) renderWeather();
    });
}

if (searchBtn && cityInput) {
    searchBtn.addEventListener('click', () => {
        handleSearch(cityInput.value);
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(cityInput.value);
        }
    });
}

function updateHeaderGreeting() {
    if (state.user.name) {
        greetingTitle.textContent = `Hello, ${state.user.name}! 🌤️`;
        greetingSubtitle.textContent = `Live forecast powered by Open-Meteo`;
    } else {
        greetingTitle.textContent = `Pastel Weather`;
        greetingSubtitle.textContent = `Real-time weather data powered by Open-Meteo`;
    }
}

function setLoading(isLoading) {
    state.isLoading = isLoading;
    if (searchBtn) {
        searchBtn.textContent = isLoading ? 'Loading...' : 'Search';
        searchBtn.disabled = isLoading;
    }
}

function renderWeather() {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    cityNameEl.textContent = state.city;
    temperatureEl.textContent = state.temperature;
    apparentTempEl.textContent = state.apparentTemperature;
    weatherDescEl.textContent = state.description;
    weatherEmojiEl.textContent = state.emoji;
    preferenceNoteEl.textContent = getComfortCommentary(state.temperature, state.user.tolerance);
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

// Startup Initialization
loadSavedPreferences();
updateHeaderGreeting();

if (userNameInput && state.user.name) {
    userNameInput.value = state.user.name;
}
const radioToSelect = document.querySelector(`input[name="temp-preference"][value="${state.user.tolerance}"]`);
if (radioToSelect) radioToSelect.checked = true;

// Default initial fetch on load
handleSearch('New York');
