# GOD'S EYE — Phase 1

A mobile-first, multilingual web prototype for the GOD'S EYE geospatial intelligence platform.

## What Phase 1 includes
- Dark cinematic interface with a 3D interactive Earth.
- Arabic, Persian, and English interface switching.
- Responsive layout designed to work on Android phones.
- Place search using the public OpenStreetMap Nominatim geocoding service.
- Layer controls prepared for satellites, public cameras, aircraft, ships, weather, and news.
- Explicit status labels: LIVE, NEAR REAL-TIME, ARCHIVE, and NOT CONNECTED.
- Initial PostgreSQL/PostGIS database schema for later backend development.

## Important limitations
This phase is a frontend prototype. It does **not** yet connect to live satellite feeds, aircraft or vessel tracking, weather services, news feeds, or camera streams. Layer controls explain their connection status and do not fabricate live data. No authentication is implemented in this static phase; private accounts and invitations must be implemented server-side before production use.

## Run on an Android phone
The easiest phone-only workflow is:
1. Download and extract this ZIP.
2. Create a GitHub repository from the extracted files using the GitHub mobile website or app.
3. Upload the contents of this folder, keeping the directory structure.
4. In the repository, open **Settings → Pages**.
5. Select **Deploy from a branch**, choose `main` and `/ (root)` if you upload the whole project root, then save.
6. Open the published Pages URL on your phone.

Alternative: use a browser-based static hosting service that supports deploying a folder or GitHub repository.

## Local preview
Open `frontend/index.html` in a browser. Internet access is required for the Globe.gl library, Earth texture, and place search. Place search is user-triggered, rate-limited, and attributed to OpenStreetMap. The public Nominatim service has strict usage limits; for a larger multi-user production deployment, route geocoding through a compliant backend/provider and cache results.

## Project structure
```text
GODS-EYE-PHASE1/
├── frontend/
│   ├── index.html
│   └── src/
│       ├── app.js
│       └── styles.css
├── database/
│   └── schema.sql
└── docs/
    └── ARCHITECTURE.md
```

## Phase 2 direction
Add a backend API (FastAPI), server-side authentication and role-based permissions, PostgreSQL/PostGIS migrations, source adapters, caching, and real provider integrations. Keep provider API keys on the server; never put private API keys in browser JavaScript.

## Data-source policy
- Clearly label every dataset with provider, observation time, retrieval time, freshness, and license/terms.
- Never label archived or delayed information as live.
- Only integrate camera streams that are publicly offered or explicitly authorized.
- Follow each provider's API terms, rate limits, attribution, and licensing requirements.
