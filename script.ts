/* ==========================================
   1. DATA / STATE
   ========================================== */
const state = {
    city: 'Ready',
    temp: '--',
    feelsLike: '--',
    desc: 'Type a city and click Search',
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

async function fetchWeather(cityName) {
    try {
        if (!cityName || !cityName.trim()) return;

        state.desc = 'Searching...';
        render();

        // 1. Geocoding API
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1`);
        if (!geoRes.ok) throw new Error("Network error connecting to geocoding.");
        
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            state.city = cityName;
            state.temp = '--';
            state.feelsLike = '--';
            state.desc = 'City not found!';
            state.emoji = '❌';
            render();
            return;
        }

        const loc = geoData.results[0];
        state.city = `${loc.name}, ${loc.country || ''}`;

        // 2. Weather API
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`);
        if (!weatherRes.ok) throw new Error("Network error connecting to weather API.");

        const weatherData = await weatherRes.json();
        if (!weatherData.current) throw new Error("Weather data unavailable.");

        state.temp = Math.round(weatherData.current.temperature_2m);
        state.feelsLike = Math.round(weatherData.current.apparent_temperature);
        
        const info = getWeatherInfo(weatherData.current.weather_code);
        state.desc = info.desc;
        state.emoji = info.emoji;

        render();
    } catch (err) {
        console.error(err);
        state.desc = 'Connection error (Check console)';
        state.emoji = '⚠️';
        render();
    }
}

/* ==========================================
   3. DISPLAY / UI CONTROLLERS
   ========================================== */
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const apparentTempEl = document.getElementById('apparent-temp');
const weatherDescEl = document.getElementById('weather-desc');
const weatherEmojiEl = document.getElementById('weather-emoji');

function render() {
    if (cityNameEl) cityNameEl.textContent = state.city;
    if (temperatureEl) temperatureEl.textContent = state.temp;
    if (apparentTempEl) apparentTempEl.textContent = state.feelsLike;
    if (weatherDescEl) weatherDescEl.textContent = state.desc;
    if (weatherEmojiEl) weatherEmojiEl.textContent = state.emoji;
}

// Event Listeners
if (searchBtn && cityInput) {
    searchBtn.addEventListener('click', () => {
        fetchWeather(cityInput.value);
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeather(cityInput.value);
        }
    });
}

// Initial render
render();
