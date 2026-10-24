/* ==========================================
   1. DATA / STATE
   ========================================== */
const state = {
    userName: localStorage.getItem('pastel_weather_name') || '',
    tempPref: localStorage.getItem('pastel_weather_pref') || 'neutral',
    city: '',
    temp: null,
    feelsLike: null,
    desc: '',
    emoji: '🌤️'
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
    if (pref === 'cold' && temp < 60) return "Might feel extra chilly to you! 🧣";
    if (pref === 'cold' && temp >= 60 && temp <= 75) return "Nice & comfy weather for you! ✨";
    if (pref === 'hot' && temp > 75) return "Might feel extra hot to you! 🍦";
    if (pref === 'hot' && temp <= 75 && temp >= 60) return "A bit cool for your liking! 🧥";
    if (pref === 'neutral') return "Standard conditions today! 👍";
    return "";
}

async function fetchWeather(cityName) {
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');

    try {
        if (errorMessage) errorMessage.classList.add('hidden');
        if (!cityName || !cityName.trim()) {
            throw new Error("Please enter a city name.");
        }

        if (searchBtn) {
            searchBtn.textContent = 'LOADING...';
            searchBtn.disabled = true;
        }

        // 1. Geocoding API
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${cityName}" not found. Check spelling.`);
        }

        const loc = geoData.results[0];
        state.city = `${loc.name}${loc.country ? ', ' + loc.country : ''}`;

        // 2. Weather API
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`);
        const weatherData = await weatherRes.json();

        if (!weatherData.current) {
            throw new Error("Weather details unavailable.");
        }

        state.temp = Math.round(weatherData.current.temperature_2m);
        state.feelsLike = Math.round(weatherData.current.apparent_temperature);

        const info = getWeatherInfo(weatherData.current.weather_code);
        state.desc = info.desc;
        state.emoji = info.emoji;

        render();
    } catch (err) {
        if (errorMessage) {
            errorMessage.textContent = err.message;
            errorMessage.classList.remove('hidden');
        }
    } finally {
        if (searchBtn) {
            searchBtn.textContent = 'SEARCH';
            searchBtn.disabled = false;
        }
    }
}

/* ==========================================
   3. DISPLAY / UI CONTROLLERS
   ========================================== */
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsBox = document.getElementById('settings-box');
const userNameInput = document.getElementById('user-name-input');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const greetingTitle = document.getElementById('greeting-title');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const apparentTempEl = document.getElementById('apparent-temp');
const weatherDescEl = document.getElementById('weather-desc');
const weatherEmojiEl = document.getElementById('weather-emoji');
const preferenceNoteEl = document.getElementById('preference-note');

function render() {
    if (cityNameEl) cityNameEl.textContent = state.city;
    if (temperatureEl) temperatureEl.textContent = state.temp;
    if (apparentTempEl) apparentTempEl.textContent = state.feelsLike;
    if (weatherDescEl) weatherDescEl.textContent = state.desc;
    if (weatherEmojiEl) weatherEmojiEl.textContent = state.emoji;
    if (preferenceNoteEl) preferenceNoteEl.textContent = getComfortMessage(state.temp, state.tempPref);
}

function updateGreeting() {
    if (greetingTitle) {
        if (state.userName) {
            greetingTitle.textContent = `Hello, ${state.userName}! 🌤️`;
        } else {
            greetingTitle.textContent = `Pastel Weather`;
        }
    }
}

// Event Listeners
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchWeather(cityInput.value);
    });
}

if (settingsToggleBtn && settingsBox) {
    settingsToggleBtn.addEventListener('click', () => {
        settingsBox.classList.toggle('hidden');
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        state.userName = userNameInput.value.trim();
        const selectedRadio = document.querySelector('input[name="temp-preference"]:checked');
        if (selectedRadio) state.tempPref = selectedRadio.value;

        localStorage.setItem('pastel_weather_name', state.userName);
        localStorage.setItem('pastel_weather_pref', state.tempPref);

        updateGreeting();
        if (settingsBox) settingsBox.classList.add('hidden');
        if (state.temp !== null) render();
    });
}

// Initialization
if (userNameInput && state.userName) userNameInput.value = state.userName;
const radio = document.querySelector(`input[name="temp-preference"][value="${state.tempPref}"]`);
if (radio) radio.checked = true;

updateGreeting();
fetchWeather('New York');
