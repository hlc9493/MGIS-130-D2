/* ==========================================
   1. DATA / STATE
   ========================================== */
const state = {
    userName: localStorage.getItem('weather_name') || '',
    tempPref: localStorage.getItem('weather_pref') || 'neutral',
    city: '',
    temp: null,
    feelsLike: null,
    desc: '',
    emoji: '☀️'
};

/* ==========================================
   2. BUSINESS / LOGIC RULES
   ========================================== */
function getWeatherInfo(code) {
    const map = {
        0: { desc: 'Clear sky', emoji: '☀️' },
        1: { desc: 'Mainly clear', emoji: '🌤️' },
        2: { desc: 'Partly cloudy', emoji: '⛅' },
        3: { desc: 'Overcast', emoji: '☁️' },
        45: { desc: 'Foggy', emoji: '🌫️' },
        51: { desc: 'Light drizzle', emoji: '🌧️' },
        61: { desc: 'Slight rain', emoji: '🌦️' },
        63: { desc: 'Moderate rain', emoji: '🌧️' },
        71: { desc: 'Snow fall', emoji: '❄️' },
        95: { desc: 'Thunderstorm', emoji: '⚡' }
    };
    return map[code] || { desc: 'Clear conditions', emoji: '🌈' };
}

function getComfortMessage(temp, pref) {
    if (pref === 'cold' && temp < 60) return "Might feel chilly to you! 🧣";
    if (pref === 'hot' && temp > 75) return "Might feel warm to you! 🍦";
    return "";
}

async function fetchWeather(cityName) {
    try {
        showError(null);
        if (!cityName || !cityName.trim()) {
            throw new Error("Please enter a city name.");
        }

        // 1. Geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1`;
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) throw new Error("Failed to connect to location server.");
        
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${cityName}" not found. Check your spelling.`);
        }

        const loc = geoData.results[0];
        state.city = `${loc.name}, ${loc.country || ''}`;

        // 2. Weather API
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`;
        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) throw new Error("Failed to connect to weather server.");

        const weatherData = await weatherRes.json();
        if (!weatherData.current) throw new Error("Weather details unavailable for this location.");

        state.temp = Math.round(weatherData.current.temperature_2m);
        state.feelsLike = Math.round(weatherData.current.apparent_temperature);
        
        const info = getWeatherInfo(weatherData.current.weather_code);
        state.desc = info.desc;
        state.emoji = info.emoji;

        renderWeather();
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

/* ==========================================
   3. DISPLAY / UI CONTROLLERS
   ========================================== */
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsBox = document.getElementById('settings-box');
const userNameInput = document.getElementById('user-name');
const saveSettingsBtn = document.getElementById('save-settings');

const greetingTitle = document.getElementById('greeting-title');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const apparentTempEl = document.getElementById('apparent-temp');
const weatherDescEl = document.getElementById('weather-desc');
const weatherEmojiEl = document.getElementById('weather-emoji');
const prefNoteEl = document.getElementById('pref-note');

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

settingsToggleBtn.addEventListener('click', () => {
    settingsBox.classList.toggle('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
    state.userName = userNameInput.value.trim();
    const selectedRadio = document.querySelector('input[name="temp-pref"]:checked');
    if (selectedRadio) state.tempPref = selectedRadio.value;

    localStorage.setItem('weather_name', state.userName);
    localStorage.setItem('weather_pref', state.tempPref);

    updateGreeting();
    settingsBox.classList.add('hidden');
    if (state.temp !== null) renderWeather();
});

function updateGreeting() {
    if (state.userName) {
        greetingTitle.textContent = `Hello, ${state.userName}! 🌤️`;
    } else {
        greetingTitle.textContent = `Pastel Weather`;
    }
}

function renderWeather() {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    cityNameEl.textContent = state.city;
    temperatureEl.textContent = state.temp;
    apparentTempEl.textContent = state.feelsLike;
    weatherDescEl.textContent = state.desc;
    weatherEmojiEl.textContent = state.emoji;
    prefNoteEl.textContent = getComfortMessage(state.temp, state.tempPref);
}

function showError(msg) {
    if (msg) {
        weatherCard.classList.add('hidden');
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
    }
}

// Initial Setup on Load
if (state.userName) userNameInput.value = state.userName;
const radio = document.querySelector(`input[name="temp-pref"][value="${state.tempPref}"]`);
if (radio) radio.checked = true;
updateGreeting();

// Default load on start
fetchWeather('New York');
