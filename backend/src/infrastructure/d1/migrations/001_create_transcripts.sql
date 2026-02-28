CREATE TABLE IF NOT EXISTS transcripts (
    id TEXT PRIMARY KEY,
    r2_key TEXT,
    transcript TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);