/* ===== USER INTERFACE LAYER (styling) ===== */

/* Color scheme: kept in one place so it stays consistent */
:root {
  --bg: #f4f6f9;
  --card: #ffffff;
  --text: #1f2933;
  --muted: #616e7c;
  --accent: #2563eb;
  --accent-dark: #1d4ed8;
  --border: #e4e7eb;
  --error: #b91c1c;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 16px;
}

header { text-align: center; margin-bottom: 24px; }
h1 { margin: 0; font-size: 1.75rem; }
.subtitle { margin: 4px 0 0; color: var(--muted); }

/* Search form */
.search { display: flex; gap: 8px; }

.search input {
  flex: 1;
  padding: 12px 14px;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.search input:focus { outline: 2px solid var(--accent); border-color: transparent; }

button {
  font: inherit;
  cursor: pointer;
  border: none;
  border-radius: 8px;
}

.search button {
  padding: 12px 18px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.search button:hover { background: var(--accent-dark); }

/* °F / °C toggle */
.unit-toggle { display: flex; justify-content: center; gap: 4px; margin: 16px 0; }

.unit-toggle button {
  padding: 6px 14px;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--muted);
}

.unit-toggle button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* Status messages */
.status { text-align: center; min-height: 1.5em; color: var(--muted); margin: 0 0 12px; }
.status.error { color: var(--error); }

/* Results card */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hidden { display: none; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.card-top h2 { margin: 0; font-size: 1.35rem; }
.description { margin: 2px 0 0; color: var(--muted); }
.icon { font-size: 3rem; line-height: 1; }

.temperature { font-size: 3.5rem; font-weight: 700; margin: 12px 0 20px; }

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.details dt { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
.details dd { margin: 0; font-weight: 600; }

footer { text-align: center; color: var(--muted); font-size: 0.8rem; margin-top: 24px; }

/* Hides labels visually but keeps them for screen readers */
.visually-hidden {
  position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

/* Small phones: stack the search button under the input */
@media (max-width: 380px) {
  .search { flex-direction: column; }
  .temperature { font-size: 3rem; }
}
