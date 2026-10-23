/* ==========================================
   RESET & BASE STYLES
   ========================================== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
    background: linear-gradient(135deg, #fce4ec 0%, #e8eaf6 50%, #e3f2fd 100%);
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    color: #37474f;
    overflow-x: hidden;
}

/* ==========================================
   RESPONSIVE LAYOUT CONTAINER
   ========================================== */
.app-wrapper {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 2.25rem 2rem;
    border-radius: 28px;
    box-shadow: 0 16px 40px rgba(100, 110, 140, 0.12),
                0 2px 6px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.8);
    width: 100%;
    max-width: 460px;
    margin: auto; /* Guarantees centering even if flex fails */
    transition: all 0.3s ease;
}

/* Desktop layout adjustment for web viewing */
@media (min-width: 768px) {
    .app-wrapper {
        max-width: 520px;
        padding: 3rem 2.5rem;
    }

    .app-header h1 {
        font-size: 2.2rem;
    }
}

/* ==========================================
   HEADER & TYPOGRAPHY
   ========================================== */
.app-header {
    text-align: center;
    margin-bottom: 1.75rem;
}

.app-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: #e8eaf6;
    color: #5c6bc0;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 20px;
    margin-bottom: 0.5rem;
}

.app-header h1 {
    font-size: 1.8rem;
    color: #3f51b5;
    font-weight: 700;
    margin-bottom: 0.3rem;
}

.subtitle {
    font-size: 0.9rem;
    color: #78909c;
}

/* ==========================================
   SEARCH CONTROLS
   ========================================== */
.search-section {
    margin-bottom: 1.5rem;
}

.search-box {
    display: flex;
    gap: 0.5rem;
}

input[type="text"] {
    flex: 1;
    padding: 0.85rem 1.1rem;
    border: 2px solid #e0e0e0;
    background: #ffffff;
    border-radius: 14px;
    outline: none;
    font-size: 0.95rem;
    color: #37474f;
    transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus {
    border-color: #9fa8da;
    box-shadow: 0 0 0 3px rgba(159, 168, 218, 0.25);
}

button {
    padding: 0.85rem 1.4rem;
    background-color: #7986cb;
    color: white;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.1s;
}

button:hover {
    background-color: #5c6bc0;
}

button:active {
    transform: scale(0.97);
}

/* ==========================================
   ERROR MESSAGE & DISPLAY STATE
   ========================================== */
.hidden {
    display: none !important;
}

.error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 0.85rem 1rem;
    border-radius: 14px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-align: center;
    border: 1px solid #ffcdd2;
    animation: fadeIn 0.3s ease;
}

/* ==========================================
   WEATHER CARD
   ========================================== */
.weather-card {
    background: linear-gradient(180deg, #ffffff 0%, #f4f5f9 100%);
    border-radius: 20px;
    padding: 1.75rem 1.5rem;
    border: 1px solid #e8eaf6;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    animation: fadeIn 0.4s ease;
}

.card-header {
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 1.25rem;
}

.card-header h2 {
    font-size: 1.4rem;
    color: #2c3e50;
    margin-bottom: 0.25rem;
}

.weather-desc {
    display: inline-block;
    font-size: 0.95rem;
    color: #5c6bc0;
    font-weight: 600;
    text-transform: capitalize;
}

.card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
}

.weather-icon {
    font-size: 4.2rem;
    line-height: 1;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.temp-wrapper {
    display: flex;
    flex-direction: column;
}

.temp-display {
    font-size: 3.2rem;
    font-weight: 800;
    color: #263238;
    line-height: 1;
}

.temp-display .unit {
    font-size: 1.8rem;
    font-weight: 500;
    color: #78909c;
    margin-left: 2px;
}

.feels-like {
    font-size: 0.85rem;
    color: #78909c;
    margin-top: 0.35rem;
}

/* Entry Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
