-- Erstelle Interest-Tabelle für Like-Funktionalität
CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    initiator_user_id INTEGER NOT NULL,
    target_user_id INTEGER NOT NULL,
    interest_type VARCHAR(50) DEFAULT 'like',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Verhindern, dass gleiche Interest mehrfach angelegt wird
    UNIQUE(initiator_user_id, target_user_id)
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_interests_initiator ON interests(initiator_user_id);
CREATE INDEX IF NOT EXISTS idx_interests_target ON interests(target_user_id);

-- Erstelle Matches-Tabelle falls nicht vorhanden
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Verhindern, dass gleiche Match mehrfach angelegt wird
    UNIQUE(user1_id, user2_id)
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
