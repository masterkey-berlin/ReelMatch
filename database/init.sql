-- ReelMatch Database Initialization Script
-- Wird automatisch beim ersten Start des PostgreSQL-Containers ausgeführt

-- Erstelle Users-Tabelle falls nicht vorhanden
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    profile_picture VARCHAR(255),
    bio TEXT,
    age INTEGER,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Erstelle Rooms-Tabelle falls nicht vorhanden
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    theme VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Erstelle Posts-Tabelle falls nicht vorhanden
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    video_path VARCHAR(255),
    text_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Erstelle Interests-Tabelle für Like-System
CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    initiator_user_id INTEGER NOT NULL,
    target_user_id INTEGER NOT NULL,
    interest_type VARCHAR(50) DEFAULT 'like',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Verhindern, dass gleiche Interest mehrfach angelegt wird
    UNIQUE(initiator_user_id, target_user_id)
);

-- Erstelle Matches-Tabelle für Match-System
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Verhindern, dass gleiche Match mehrfach angelegt wird
    UNIQUE(user1_id, user2_id)
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_interests_initiator ON interests(initiator_user_id);
CREATE INDEX IF NOT EXISTS idx_interests_target ON interests(target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_room ON posts(room_id);

-- Beispiel-Daten einfügen (falls Tabellen leer sind)
INSERT INTO users (id, username, email, bio, age) VALUES 
(1, 'testuser1', 'test1@reelmatch.com', 'Ich liebe Videos und neue Leute kennenzulernen!', 25),
(2, 'testuser2', 'test2@reelmatch.com', 'Kreativer Content Creator aus Berlin', 28),
(3, 'alice_video', 'alice@reelmatch.com', 'Reise-Enthusiastin und Fotografin', 24),
(4, 'bob_creator', 'bob@reelmatch.com', 'Tech-Liebhaber und Gamer', 26),
(5, 'charlie_artist', 'charlie@reelmatch.com', 'Künstler und Musik-Producer', 29)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, name, description, theme) VALUES 
(1, 'Fitness & Sport', 'Teile deine Workout-Videos und Sport-Momente', 'fitness'),
(2, 'Kochen & Food', 'Leckere Gerichte und Kochskills zeigen', 'food'),
(3, 'Musik & Tanz', 'Deine musikalischen Talente präsentieren', 'music'),
(4, 'Reisen & Abenteuer', 'Reise-Erlebnisse und schöne Orte', 'travel'),
(5, 'Comedy & Fun', 'Lustige Videos und Unterhaltung', 'comedy')
ON CONFLICT (id) DO NOTHING;

-- Restart sequence für IDs (wichtig nach INSERT mit festen IDs)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));

-- Erfolgsmeldung
SELECT 'ReelMatch Database initialized successfully!' as status;
