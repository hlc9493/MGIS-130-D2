# MGIS-130-D2
A personal weather dashboard with a cute weather buddy that tells you how the weather will feel to *you*, not just the thermometer.


## Features
- Search any city for current weather
- "Feels Like You" temperature, adjusted for whether you run cold, neutral or hot
- A weather buddy who suggests an outfit
- Remembers your name and settings on your device

## How it's built (three-layer architecture)
- **Data layer:** Open-Meteo Geocoding and Forecast APIs (free, no API key), plus your saved settings in localStorage
- **Processing layer:** turns the weather code into a description and emoji, calculates the Feels Like You temperature, picks an outfit
- **Presentation layer:** HTML and CSS cards, the weather buddy, and responsive layout for phones

## Files
- `index.html` – page structure
- `style.css` – styling and mobile layout
- `script.js` – data, processing and display code, in labeled sections
