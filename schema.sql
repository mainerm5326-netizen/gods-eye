-- GOD'S EYE initial PostgreSQL + PostGIS schema
-- Apply only after PostgreSQL and PostGIS are installed.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL CHECK (code IN ('owner','admin','analyst','viewer')),
    description TEXT NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    password_hash TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'ar'
        CHECK (preferred_language IN ('ar','fa','en')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invited_email TEXT NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    token_hash TEXT UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    provider_url TEXT,
    terms_url TEXT,
    license_name TEXT,
    attribution TEXT,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country_code CHAR(2),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX locations_geog_idx ON locations USING GIST(location);

CREATE TABLE satellite_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id),
    provider_scene_id TEXT,
    footprint GEOMETRY(POLYGON, 4326),
    observed_at TIMESTAMPTZ,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolution_m NUMERIC,
    imagery_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX satellite_scenes_footprint_idx ON satellite_scenes USING GIST(footprint);
CREATE INDEX satellite_scenes_observed_idx ON satellite_scenes(observed_at DESC);

CREATE TABLE cameras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id),
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    stream_url TEXT,
    access_basis TEXT NOT NULL CHECK (access_basis IN ('public','authorized')),
    status TEXT NOT NULL DEFAULT 'unknown',
    observed_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX cameras_location_idx ON cameras USING GIST(location);

CREATE TABLE aircraft_positions (
    id BIGSERIAL PRIMARY KEY,
    source_id UUID NOT NULL REFERENCES data_sources(id),
    aircraft_key TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    altitude_m NUMERIC,
    speed_mps NUMERIC,
    heading_deg NUMERIC,
    observed_at TIMESTAMPTZ NOT NULL,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX aircraft_location_idx ON aircraft_positions USING GIST(location);
CREATE INDEX aircraft_observed_idx ON aircraft_positions(observed_at DESC);

CREATE TABLE vessel_positions (
    id BIGSERIAL PRIMARY KEY,
    source_id UUID NOT NULL REFERENCES data_sources(id),
    vessel_key TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    speed_knots NUMERIC,
    heading_deg NUMERIC,
    observed_at TIMESTAMPTZ NOT NULL,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX vessel_location_idx ON vessel_positions USING GIST(location);
CREATE INDEX vessel_observed_idx ON vessel_positions(observed_at DESC);

CREATE TABLE weather_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id),
    location GEOGRAPHY(POINT, 4326),
    observed_at TIMESTAMPTZ NOT NULL,
    temperature_c NUMERIC,
    humidity_pct NUMERIC,
    wind_mps NUMERIC,
    precipitation_mm NUMERIC,
    condition_code TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX weather_location_idx ON weather_observations USING GIST(location);
CREATE INDEX weather_observed_idx ON weather_observations(observed_at DESC);

CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id),
    title TEXT NOT NULL,
    article_url TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    language_code TEXT,
    location GEOGRAPHY(POINT, 4326),
    summary TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX news_location_idx ON news_articles USING GIST(location);
CREATE INDEX news_published_idx ON news_articles(published_at DESC);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id),
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    severity TEXT,
    observed_at TIMESTAMPTZ,
    source_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX events_location_idx ON events USING GIST(location);
CREATE INDEX events_observed_idx ON events(observed_at DESC);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    area GEOMETRY(POLYGON, 4326),
    conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX alerts_area_idx ON alerts USING GIST(area);

CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    job_type TEXT NOT NULL CHECK (job_type IN ('image','video')),
    status TEXT NOT NULL DEFAULT 'queued',
    input_object_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    result_type TEXT NOT NULL,
    result_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO roles(code, description) VALUES
('owner','Full project ownership'),
('admin','Manage users and permitted configuration'),
('analyst','Run analysis and create reports'),
('viewer','Read-only access')
ON CONFLICT (code) DO NOTHING;
