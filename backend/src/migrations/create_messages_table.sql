-- Erstellen der Messages-Tabelle
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indizes für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Index für Konversationsabfragen (Nachrichten zwischen zwei Benutzern)
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages((
  CASE WHEN sender_id < receiver_id 
       THEN sender_id 
       ELSE receiver_id 
  END), (
  CASE WHEN sender_id < receiver_id 
       THEN receiver_id 
       ELSE sender_id 
  END), created_at);

-- Kommentar zur Verwendung
COMMENT ON TABLE messages IS 'Speichert Nachrichten zwischen Benutzern nach einem Match';
