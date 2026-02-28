CREATE TABLE users (
    id TEXT PRIMARY KEY,
    zoom_user_id TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transcripts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    zoom_meeting_id TEXT,
    status TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    tokens INTEGER,
    model TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);