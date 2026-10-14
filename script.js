"use strict";
// Weather Dashboard: MGIS 130 Web App
// This file holds the DATA LAYER and PROCESSING LAYER, plus the code that
// updates the USER INTERFACE LAYER.
// =====================================================================
// DATA LAYER: getting information from the OpenWeather API
// =====================================================================
// Paste your OpenWeather API key here
const API_KEY = "YOUR_API_KEY_HERE";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
// Requests current weather for a city. No "units" parameter is sent, so
// temperatures come back in Kelvin and the Processing Layer converts them.
async function fetchWeather(city) {
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404)
            throw new Error(`Couldn't find "${city}". Check the spelling and try again.`);
        if (response.status === 401)
            throw new Error("API key problem. New keys can take a couple of hours to activate.");
        throw new Error("Something went wrong getting the weather. Please try again.");
    }
    return response.json();
}
// Converts Kelvin to Fahrenheit or Celsius and rounds to a whole number
function convertTemp(kelvin, unit) {
    const celsius = kelvin - 273.15;
    return Math.round(unit === "F" ? celsius * 9 / 5 + 32 : celsius);
}
// Converts wind from meters/second to mph or km/h to match the chosen unit
function formatWind(metersPerSec, unit) {
    return unit === "F"
        ? `${Math.round(metersPerSec * 2.237)} mph`
        : `${Math.round(metersPerSec * 3.6)} km/h`;
}
// Chooses an icon based on the weather condition
function getWeatherIcon(condition) {
    const icons = {
        Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
        Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️", Haze: "🌫️",
    };
    return icons[condition] ?? "🌡️"; // fallback for less common conditions
}
// Capitalizes each word: "light rain" becomes "Light Rain"
function capitalize(text) {
    return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
// Turns a Unix timestamp into the city's local time, like "7:14 AM"
function formatTime(unixSeconds, timezoneOffset) {
    const date = new Date((unixSeconds + timezoneOffset) * 1000);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
}
// =====================================================================
// USER INTERFACE LAYER: connecting the page to the code above
// =====================================================================
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusEl = document.getElementById("status");
const card = document.getElementById("weather-card");
const unitF = document.getElementById("unit-f");
const unitC = document.getElementById("unit-c");
let currentUnit = "F";
let lastData = null; // saved so the unit toggle doesn't need a new API call
// Small helper to set the text of an element by its id
function setText(id, text) {
    document.getElementById(id).textContent = text;
}
function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
}
// Fills the results card using the processed data
function displayWeather(data) {
    const u = currentUnit;
    const condition = data.weather[0];
    setText("city-name", `${data.name}, ${data.sys.country}`);
    setText("description", capitalize(condition.description));
    setText("icon", getWeatherIcon(condition.main));
    setText("temperature", `${convertTemp(data.main.temp, u)}°${u}`);
    setText("feels-like", `${convertTemp(data.main.feels_like, u)}°${u}`);
    setText("humidity", `${data.main.humidity}%`);
    setText("wind", formatWind(data.wind.speed, u));
    setText("sunrise", formatTime(data.sys.sunrise, data.timezone));
    setText("sunset", formatTime(data.sys.sunset, data.timezone));
    setText("high-low", `${convertTemp(data.main.temp_max, u)}° / ${convertTemp(data.main.temp_min, u)}°`);
    card.classList.remove("hidden");
}
// Runs when the user submits the search form
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stops the page from reloading
    const city = cityInput.value.trim();
    if (!city)
        return;
    showStatus("Loading…");
    card.classList.add("hidden");
    try {
        lastData = await fetchWeather(city); // Data Layer
        displayWeather(lastData); // Processing + UI Layers
        showStatus("");
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error.";
        showStatus(message, true);
    }
});
// Switches units and redraws the card from the saved data
function setUnit(unit) {
    currentUnit = unit;
    unitF.classList.toggle("active", unit === "F");
    unitC.classList.toggle("active", unit === "C");
    if (lastData)
        displayWeather(lastData);
}
unitF.addEventListener("click", () => setUnit("F"));
unitC.addEventListener("click", () => setUnit("C"));
