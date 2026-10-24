/* ==========================================
   1. DATA & STATE
   ========================================== */
const state = {
    userName: localStorage.getItem('pokedex_trainer_name') || '',
    tempPref: localStorage.getItem('pokedex_trainer_pref') || 'neutral',
    city: '',
    temp: null,
    feelsLike: null,
    desc: '',
    code: 0
};

/* ==========================================
   2. CANVAS ANIMATED BACKGROUND ENGINE
   ========================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let currentWeatherType = 'clear';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initParticles(type) {
    particles = [];
    currentWeatherType = type;
    const count = type === 'rain' ? 100 : type === 'snow' ? 70 : type === 'thunder' ? 130 : 20;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedY: type === 'rain' || type === 'thunder' ? 10 + Math.random() * 6 : type === 'snow' ? 1 + Math.random() * 2 : 0.2 + Math.random() * 0.4,
            speedX: type === 'snow' ? Math.sin(i) * 1 : type === 'clear' ? 0.4 + Math.random() * 0.4 : 0,
            size: type === 'snow' ? Math.random() * 4 + 2 : type === 'clear' ? Math.random() * 30 + 15 : Math.random() * 2 + 1
        });
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentWeatherType === 'clear') {
        ctx.fillStyle = '#1e2030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 204, 0, 0.25)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.speedX;
            if (p.x > canvas.width + 40) p.x = -40;
        });
    } else if (currentWeatherType === 'rain' || currentWeatherType === 'thunder') {
        ctx.fillStyle = currentWeatherType === 'thunder' ? '#11121e' : '#1b2631';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#85d7ff';
        ctx.lineWidth = 1.5;
        particles.forEach(p => {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.size * 4);
            ctx.stroke();
            p.y += p.speedY;
            if (p.y > canvas.height) p.y = -10;
        });

        if (currentWeatherType === 'thunder' && Math.random() < 0.02) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else if (currentWeatherType === 'snow') {
        ctx.fillStyle = '#182533';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y > canvas.height) p.y = -5;
        });
    }

    requestAnimationFrame(animateBackground);
}

initParticles('clear');
animateBackground();

/* ==========================================
   3. POKÉMON DATA MAPPER
   ========================================== */
function getPokemonData(code) {
    if (code === 0 || code === 1) {
        return { desc: 'Sunny / Clear', avatar: '☀️ Pikachu', bg: 'clear' };
    } else if (code === 2 || code === 3) {
        return { desc: 'Cloudy', avatar: '⛅ Castform', bg: 'clear' };
    } else if (code >= 51 && code <= 65) {
        return { desc: 'Rainy', avatar: '🌧️ Squirtle', bg: 'rain' };
    } else if (code >= 71 && code <= 77) {
        return { desc: 'Snowy', avatar: '❄️ Abomasnow', bg: 'snow' };
    } else if (code >= 95) {
        return { desc: 'Thunderstorm', avatar: '⚡ Zapdos', bg: 'thunder' };
    }
    return { desc: 'Clear Skies', avatar: '🌈 Dragonite', bg: 'clear' };
}

function getTrainerAdvice(temp, pref) {
    if (pref === 'cold' && temp < 60) return "TRAINER ADVICE: WEAR A HEAVY COAT!";
    if (pref === 'hot' && temp > 75) return "TRAINER ADVICE: BRING FRESH WATER!";
    return "TRAINER ADVICE: GREAT CONDITIONS FOR WILD ENCOUNTERS!";
}

/* ==========================================
   4. API & LOGIC CONTROLLERS
   ========================================== */
async function fetchWeather(cityName) {
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');

    try {
        if (errorMessage) errorMessage.classList.add('hidden');
        if (!cityName || !cityName.trim()) throw new Error("ENTER LOCATION NAME.");

        if (searchBtn) {
            searchBtn.textContent = 'SCANNING...';
            searchBtn.disabled = true;
        }

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`LOCATION "${cityName}" NOT FOUND.`);
        }

        const loc = geoData.results[0];
        state.city = `${loc.name}${loc.country ? ', ' + loc.country : ''}`;

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`);
        const weatherData = await weatherRes.json();

        if (!weatherData.current) throw new Error("WEATHER SIGNAL LOST.");

        state.temp = Math.round(weatherData.current.temperature_2m);
        state.feelsLike = Math.round(weatherData.current.apparent_temperature);
        state.code = weatherData.current.weather_code;

        render();
    } catch (err) {
        if (errorMessage) {
            errorMessage.textContent = err.message;
            errorMessage.classList.remove('hidden');
        }
    } finally {
        if (searchBtn) {
            searchBtn.textContent = 'SCAN';
            searchBtn.disabled = false;
        }
    }
}

/* ==========================================
   5. UI RENDERING
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
const pokemonAvatarEl = document.getElementById('pokemon-avatar');
const preferenceNoteEl = document.getElementById('preference-note');

function render() {
    const pokeInfo = getPokemonData(state.code);

    if (cityNameEl) cityNameEl.textContent = state.city;
    if (temperatureEl) temperatureEl.textContent = state.temp;
    if (apparentTempEl) apparentTempEl.textContent = state.feelsLike;
    if (weatherDescEl) weatherDescEl.textContent = pokeInfo.desc;
    if (pokemonAvatarEl) pokemonAvatarEl.textContent = pokeInfo.avatar;
    if (preferenceNoteEl) preferenceNoteEl.textContent = getTrainerAdvice(state.temp, state.tempPref);

    initParticles(pokeInfo.bg);
}

function updateGreeting() {
    if (greetingTitle) {
        if (state.userName) {
            greetingTitle.textContent = `TRAINER ${state.userName.toUpperCase()}`;
        } else {
            greetingTitle.textContent = `TRAINER WEATHER`;
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

        localStorage.setItem('pokedex_trainer_name', state.userName);
        localStorage.setItem('pokedex_trainer_pref', state.tempPref);

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
