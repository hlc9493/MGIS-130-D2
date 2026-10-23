* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, #fce4ec, #e3f2fd);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    color: #4a4a4a;
}

.weather-container {
    background: #ffffff;
    padding: 2rem;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 380px;
    text-align: center;
}

h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #5c6bc0;
}

.search-box {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

input[type="text"] {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    outline: none;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input[type="text"]:focus {
    border-color: #9fa8da;
}

button {
    padding: 0.75rem 1.25rem;
    background-color: #9fa8da;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #7986cb;
}

.hidden {
    display: none !important;
}

.error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 0.75rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.weather-card {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1rem;
    animation: fadeIn 0.4s ease;
}

.weather-icon {
    font-size: 4rem;
    margin-bottom: 0.5rem;
}

.weather-card h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #3f51b5;
}

.temp-display {
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
}

.feels-like {
    font-size: 0.9rem;
    color: #757575;
    margin-bottom: 0.75rem;
}

.weather-desc {
    font-size: 1.1rem;
    color: #5c6bc0;
    font-weight: 500;
    text-transform: capitalize;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
