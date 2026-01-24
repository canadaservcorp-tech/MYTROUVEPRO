-- La Maison Benoit Labre Maintenance Schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  password_hash TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS apartments (
  id TEXT PRIMARY KEY,
  floor INTEGER NOT NULL,
  number INTEGER NOT NULL,
  label TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('common', 'service')),
  floor INTEGER,
  category TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS contractors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  specialties TEXT,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contractor_reviews (
  id TEXT PRIMARY KEY,
  contractor_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (contractor_id) REFERENCES contractors(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  area_type TEXT NOT NULL CHECK (area_type IN ('apartment', 'area')),
  area_id TEXT,
  apartment_id TEXT,
  contractor_id TEXT,
  last_service_date TEXT,
  interval_days INTEGER,
  next_due_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (area_id) REFERENCES areas(id),
  FOREIGN KEY (apartment_id) REFERENCES apartments(id),
  FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('preventive', 'corrective')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'completed', 'blocked')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date TEXT,
  scheduled_date TEXT,
  completed_at TEXT,
  created_by TEXT NOT NULL,
  assigned_to TEXT NOT NULL,
  apartment_id TEXT,
  area_id TEXT,
  asset_id TEXT,
  estimated_hours REAL,
  hours_spent REAL,
  cost_amount REAL,
  reminder_sent_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (apartment_id) REFERENCES apartments(id),
  FOREIGN KEY (area_id) REFERENCES areas(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);

CREATE TABLE IF NOT EXISTS task_remarks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
