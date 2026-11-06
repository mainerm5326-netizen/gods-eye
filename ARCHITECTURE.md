# GOD'S EYE — Engineering Blueprint

## Product decisions
- Product: GOD'S EYE (عين العراب / چشم خدا)
- Experience: dark, cinematic 3D globe (Design C)
- Delivery: web first, installable/PWA and native application later
- Current development device: Android phone only
- Budget: free-first; paid infrastructure only when justified
- Languages: Arabic, Persian, English
- Access: owner account plus invited users with explicit roles
- Data access: public, licensed, or explicitly authorized sources only

## Target architecture

```text
Mobile/Desktop Browser
        |
        v
Frontend (Next.js + TypeScript; globe module using CesiumJS or Globe.gl)
        |
        v
Backend API (FastAPI)
        |
        +--> Authentication / Invitations / RBAC
        +--> Geospatial search and map services
        +--> Provider adapters
        |      +-- Satellite / Earth observation
        |      +-- Aviation (ADS-B providers)
        |      +-- Maritime (AIS providers)
        |      +-- Weather
        |      +-- Public authorized cameras
        |      +-- News / events
        |      +-- Infrastructure / environment
        |
        +--> AI job service (YOLO / OpenCV / tracking)
        |
        v
PostgreSQL + PostGIS
        |
        +--> Object storage for user-authorized media and generated reports
        +--> Cache / queue when needed
```

Phase 1 intentionally uses a small static frontend so it can be edited and deployed from a phone. The production target can migrate to Next.js without changing the domain model or source contracts.

## Frontend modules
- `app-shell`: navigation, header, responsive layout
- `globe`: globe rendering, camera controls, selected coordinates
- `search`: place geocoding and search results
- `layers`: layer registry and availability state
- `dashboard`: source status and selected-place panel
- `i18n`: Arabic, Persian, English strings and RTL/LTR direction
- `timeline`: later time slider for dated datasets
- `alerts`: later user-defined event notifications
- `settings`: later account, invitations, language, and access controls

## Target backend modules
- `auth`: login, session lifecycle, password reset, MFA
- `users`: user profile and account status
- `roles`: owner, admin, analyst, viewer
- `invitations`: expiring, single-use invitations
- `sources`: provider registry, terms, attribution, health checks
- `satellite`: scene metadata and imagery links
- `aviation`: provider-normalized aircraft observations
- `maritime`: provider-normalized vessel observations
- `weather`: observations and forecasts
- `cameras`: public/authorized camera metadata and stream URLs
- `news`: article metadata and source links
- `events`: earthquakes, fires, floods, storms
- `ai`: image/video analysis jobs and outputs
- `reports`: exportable summaries and provenance

## Database principles
- Use UUID primary keys.
- Store geographic points as PostGIS `geography(Point, 4326)` or `geometry(Point, 4326)` according to query needs.
- Store all timestamps in UTC (`timestamptz`).
- Preserve both observation time and ingestion time.
- Store provider/source identifiers and license/terms references.
- Keep raw provider payloads only when terms permit.
- Add retention policies for high-volume position history.
- Never store provider secrets in frontend code.

## Core tables
`users`, `roles`, `user_roles`, `invitations`, `data_sources`, `locations`,
`satellite_scenes`, `cameras`, `aircraft_positions`, `vessel_positions`,
`weather_observations`, `news_articles`, `events`, `alerts`,
`analysis_jobs`, `analysis_results`.

## Access-control model
- `owner`: full control of project and invitations
- `admin`: manage permitted users and data configuration
- `analyst`: run analysis and create reports
- `viewer`: read-only access
Authorization must be enforced by the backend on every protected endpoint. Hiding a button in the frontend is not security.

## Data freshness contract
Every displayed data item should expose:
- `source_id`
- `observed_at`
- `ingested_at`
- `freshness_class`: `LIVE`, `NEAR_REAL_TIME`, `ARCHIVE`, or `UNKNOWN`
- `license_url` / terms reference where applicable
- optional `quality` and `confidence`

Do not infer live status from the fact that a URL loads.

## Implementation phases
1. Static mobile-first shell, 3D globe, language switch, place search, layer registry. (Current)
2. Backend skeleton, database migrations, authentication, invitations, RBAC.
3. Source adapters: satellite scenes and weather first; then news, aircraft, maritime.
4. Public/authorized camera catalog and playback with provenance.
5. AI image/video analysis integration from the existing Colab YOLO work.
6. Alerts, timeline, reports, observability, backups, and production hardening.
7. PWA installation and later native app packaging.

## Non-goals / constraints
- No access to private cameras, private devices, or restricted systems.
- No claim of universal, continuous satellite coverage.
- No fabricated live aircraft, vessel, camera, or weather observations.
- No promise that every provider is free or globally complete.
