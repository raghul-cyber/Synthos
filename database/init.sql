-- Synthos Database Schema
-- PostgreSQL 15

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    industry VARCHAR(100),
    years_experience INTEGER DEFAULT 0,
    location VARCHAR(100),
    synthos_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills Master
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    market_demand_score INTEGER DEFAULT 50,
    demand_trend VARCHAR(20) DEFAULT 'stable',
    yoy_change DECIMAL(5,2) DEFAULT 0,
    avg_salary_impact INTEGER DEFAULT 0,
    learning_hours INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Skills (junction)
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(20) DEFAULT 'beginner',
    validated BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Skill Adjacency Graph
CREATE TABLE skill_adjacency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_from UUID REFERENCES skills(id) ON DELETE CASCADE,
    skill_to UUID REFERENCES skills(id) ON DELETE CASCADE,
    adjacency_score DECIMAL(4,3) NOT NULL,
    co_occurrence_count INTEGER DEFAULT 0,
    UNIQUE(skill_from, skill_to)
);

-- Career Paths
CREATE TABLE career_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    avg_salary_min INTEGER,
    avg_salary_max INTEGER,
    demand_score INTEGER DEFAULT 50,
    growth_rate DECIMAL(5,2) DEFAULT 0,
    required_skills JSONB DEFAULT '[]',
    nice_to_have_skills JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Path Analyses
CREATE TABLE user_path_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
    transition_probability DECIMAL(4,3),
    time_to_transition_months INTEGER,
    roi_score DECIMAL(6,2),
    skill_gap JSONB DEFAULT '[]',
    ai_narrative TEXT,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Market Signals
CREATE TABLE market_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    signal_type VARCHAR(50),
    signal_value DECIMAL(10,2),
    source VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX idx_skill_adjacency_from ON skill_adjacency(skill_from);
CREATE INDEX idx_skill_adjacency_to ON skill_adjacency(skill_to);
CREATE INDEX idx_market_signals_skill ON market_signals(skill_id);
CREATE INDEX idx_market_signals_recorded ON market_signals(recorded_at);
CREATE INDEX idx_skills_name_trgm ON skills USING gin(name gin_trgm_ops);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_career_paths_demand ON career_paths(demand_score DESC);
