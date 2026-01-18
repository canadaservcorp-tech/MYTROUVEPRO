import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const BOOTSTRAP_KEY = process.env.BOOTSTRAP_KEY || '';
const CLIENT_URLS = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

if (JWT_SECRET === 'change-me') {
  console.warn('JWT_SECRET is not set. Set JWT_SECRET in production.');
}

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CLIENT_URLS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '1mb' }));

const dataDir = path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.DB_PATH || path.join(dataDir, 'maintenance.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initSchema = () => {
  db.exec(`
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
  `);
};

const seedBaseData = () => {
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoryCount === 0) {
    const categories = ['MEP', 'Architecture', 'Civil', 'FFS', 'FAS'];
    const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
    const insertMany = db.transaction((rows) => {
      rows.forEach((name) => insertCategory.run(newId(), name));
    });
    insertMany(categories);
  }

  const apartmentCount = db.prepare('SELECT COUNT(*) as count FROM apartments').get().count;
  if (apartmentCount === 0) {
    const insertApartment = db.prepare('INSERT INTO apartments (id, floor, number, label, notes) VALUES (?, ?, ?, ?, ?)');
    const insertMany = db.transaction(() => {
      for (let floor = 1; floor <= 3; floor += 1) {
        for (let number = 1; number <= 12; number += 1) {
          const label = `${floor}-${String(number).padStart(2, '0')}`;
          insertApartment.run(newId(), floor, number, label, null);
        }
      }
    });
    insertMany();
  }

  const areaCount = db.prepare('SELECT COUNT(*) as count FROM areas').get().count;
  if (areaCount === 0) {
    const areas = [
      { name: 'Lobby', type: 'common', floor: 1, category: 'Architecture' },
      { name: 'Elevators', type: 'service', floor: null, category: 'MEP' },
      { name: 'Mechanical Room', type: 'service', floor: 1, category: 'MEP' },
      { name: 'Electrical Room', type: 'service', floor: 1, category: 'MEP' },
      { name: 'Fire Control Room', type: 'service', floor: 1, category: 'FFS' },
      { name: 'Stairwells', type: 'common', floor: null, category: 'Architecture' },
      { name: 'Parking', type: 'common', floor: 0, category: 'Civil' },
      { name: 'Roof', type: 'service', floor: 4, category: 'Civil' },
      { name: 'Security Room', type: 'service', floor: 1, category: 'FAS' },
    ];
    const insertArea = db.prepare('INSERT INTO areas (id, name, type, floor, category, notes) VALUES (?, ?, ?, ?, ?, ?)');
    const insertMany = db.transaction((rows) => {
      rows.forEach((area) => {
        insertArea.run(newId(), area.name, area.type, area.floor, area.category, null);
      });
    });
    insertMany(areas);
  }
};

initSchema();
seedBaseData();

const mailTransport = (() => {
  if (!process.env.SMTP_HOST) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });
})();

const sendEmail = async ({ to, subject, text }) => {
  if (!mailTransport) {
    console.log(`[Email skipped] ${subject} -> ${to}`);
    return;
  }
  await mailTransport.sendMail({
    from: process.env.SMTP_FROM || 'maintenance@lmb.local',
    to,
    subject,
    text,
  });
};

const signToken = (user) => (
  jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '12h' }
  )
);

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

const getUserByEmail = (email) => (
  db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email)
);

const getUserById = (id) => (
  db.prepare('SELECT * FROM users WHERE id = ?').get(id)
);

const anyAdminExists = () => (
  db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get().count > 0
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: nowIso() });
});

app.post('/api/auth/bootstrap', async (req, res) => {
  if (!BOOTSTRAP_KEY) {
    res.status(400).json({ error: 'BOOTSTRAP_KEY not configured' });
    return;
  }
  if (req.headers['x-bootstrap-key'] !== BOOTSTRAP_KEY) {
    res.status(403).json({ error: 'Invalid bootstrap key' });
    return;
  }
  if (anyAdminExists()) {
    res.status(409).json({ error: 'Admin already exists' });
    return;
  }
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = newId();
  db.prepare(`
    INSERT INTO users (id, name, email, phone, role, password_hash, created_at)
    VALUES (?, ?, ?, ?, 'admin', ?, ?)
  `).run(userId, name, email.toLowerCase(), phone || null, passwordHash, nowIso());
  const user = getUserById(userId);
  res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email?.toLowerCase());
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.json({
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.get('/api/users/me', requireAuth, (req, res) => {
  const user = getUserById(req.user.sub);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
});

app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, role, active, created_at FROM users ORDER BY name').all();
  res.json({ users });
});

app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = newId();
  db.prepare(`
    INSERT INTO users (id, name, email, phone, role, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, name, email.toLowerCase(), phone || null, role === 'admin' ? 'admin' : 'staff', passwordHash, nowIso());
  res.status(201).json({ id: userId });
});

app.patch('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const { name, phone, role, active } = req.body;
  db.prepare(`
    UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), role = COALESCE(?, role), active = COALESCE(?, active)
    WHERE id = ?
  `).run(name || null, phone || null, role || null, active == null ? null : Number(active), req.params.id);
  res.json({ ok: true });
});

app.get('/api/categories', requireAuth, (req, res) => {
  const categories = db.prepare('SELECT id, name FROM categories ORDER BY name').all();
  res.json({ categories });
});

app.get('/api/apartments', requireAuth, (req, res) => {
  const apartments = db.prepare('SELECT * FROM apartments ORDER BY floor, number').all();
  res.json({ apartments });
});

app.post('/api/apartments', requireAuth, requireAdmin, (req, res) => {
  const { floor, number, label, notes } = req.body;
  if (!floor || !number || !label) {
    res.status(400).json({ error: 'floor, number, and label are required' });
    return;
  }
  const id = newId();
  db.prepare('INSERT INTO apartments (id, floor, number, label, notes) VALUES (?, ?, ?, ?, ?)').run(id, floor, number, label, notes || null);
  res.status(201).json({ id });
});

app.get('/api/areas', requireAuth, (req, res) => {
  const areas = db.prepare('SELECT * FROM areas ORDER BY name').all();
  res.json({ areas });
});

app.post('/api/areas', requireAuth, requireAdmin, (req, res) => {
  const { name, type, floor, category, notes } = req.body;
  if (!name || !type) {
    res.status(400).json({ error: 'name and type are required' });
    return;
  }
  const id = newId();
  db.prepare('INSERT INTO areas (id, name, type, floor, category, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
    id,
    name,
    type,
    floor ?? null,
    category || null,
    notes || null
  );
  res.status(201).json({ id });
});

app.get('/api/contractors', requireAuth, (req, res) => {
  const contractors = db.prepare('SELECT * FROM contractors ORDER BY name').all();
  res.json({ contractors });
});

app.post('/api/contractors', requireAuth, requireAdmin, (req, res) => {
  const { name, company, email, phone, specialties, notes } = req.body;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const id = newId();
  db.prepare(`
    INSERT INTO contractors (id, name, company, email, phone, specialties, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, company || null, email || null, phone || null, specialties || null, notes || null, nowIso());
  res.status(201).json({ id });
});

app.post('/api/contractors/:id/reviews', requireAuth, requireAdmin, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) {
    res.status(400).json({ error: 'rating is required' });
    return;
  }
  const id = newId();
  db.prepare(`
    INSERT INTO contractor_reviews (id, contractor_id, reviewer_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.params.id, req.user.sub, rating, comment || null, nowIso());
  res.status(201).json({ id });
});

app.get('/api/contractors/:id/reviews', requireAuth, (req, res) => {
  const reviews = db.prepare(`
    SELECT contractor_reviews.*, users.name as reviewer_name
    FROM contractor_reviews
    JOIN users ON users.id = contractor_reviews.reviewer_id
    WHERE contractor_reviews.contractor_id = ?
    ORDER BY contractor_reviews.created_at DESC
  `).all(req.params.id);
  res.json({ reviews });
});

app.get('/api/assets', requireAuth, (req, res) => {
  const assets = db.prepare(`
    SELECT assets.*, contractors.name as contractor_name
    FROM assets
    LEFT JOIN contractors ON contractors.id = assets.contractor_id
    ORDER BY assets.name
  `).all();
  res.json({ assets });
});

app.post('/api/assets', requireAuth, requireAdmin, (req, res) => {
  const { name, category, area_type, area_id, apartment_id, contractor_id, last_service_date, interval_days, next_due_date, notes } = req.body;
  if (!name || !category || !area_type) {
    res.status(400).json({ error: 'name, category, and area_type are required' });
    return;
  }
  const id = newId();
  db.prepare(`
    INSERT INTO assets (id, name, category, area_type, area_id, apartment_id, contractor_id, last_service_date, interval_days, next_due_date, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    category,
    area_type,
    area_id || null,
    apartment_id || null,
    contractor_id || null,
    last_service_date || null,
    interval_days ?? null,
    next_due_date || null,
    notes || null,
    nowIso()
  );
  res.status(201).json({ id });
});

const listTasks = (user, query) => {
  const filters = [];
  const params = [];
  if (user.role !== 'admin') {
    filters.push('tasks.assigned_to = ?');
    params.push(user.sub);
  }
  if (query.status) {
    filters.push('tasks.status = ?');
    params.push(query.status);
  }
  if (query.category) {
    filters.push('tasks.category = ?');
    params.push(query.category);
  }
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  return db.prepare(`
    SELECT tasks.*, users.name as assigned_name, apartments.label as apartment_label, areas.name as area_name
    FROM tasks
    JOIN users ON users.id = tasks.assigned_to
    LEFT JOIN apartments ON apartments.id = tasks.apartment_id
    LEFT JOIN areas ON areas.id = tasks.area_id
    ${whereClause}
    ORDER BY tasks.due_date ASC
  `).all(...params);
};

app.get('/api/tasks', requireAuth, (req, res) => {
  const tasks = listTasks(req.user, req.query);
  res.json({ tasks });
});

app.post('/api/tasks', requireAuth, requireAdmin, (req, res) => {
  const {
    title,
    description,
    category,
    task_type,
    status,
    priority,
    due_date,
    scheduled_date,
    assigned_to,
    apartment_id,
    area_id,
    asset_id,
    estimated_hours,
    cost_amount,
  } = req.body;

  if (!title || !category || !task_type || !status || !priority || !assigned_to) {
    res.status(400).json({ error: 'title, category, type, status, priority, assigned_to are required' });
    return;
  }

  const id = newId();
  db.prepare(`
    INSERT INTO tasks (
      id, title, description, category, task_type, status, priority, due_date, scheduled_date,
      created_by, assigned_to, apartment_id, area_id, asset_id, estimated_hours, cost_amount, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    title,
    description || null,
    category,
    task_type,
    status,
    priority,
    due_date || null,
    scheduled_date || null,
    req.user.sub,
    assigned_to,
    apartment_id || null,
    area_id || null,
    asset_id || null,
    estimated_hours ?? null,
    cost_amount ?? null,
    nowIso()
  );

  res.status(201).json({ id });
});

app.get('/api/tasks/:id', requireAuth, (req, res) => {
  const task = db.prepare(`
    SELECT tasks.*, users.name as assigned_name, apartments.label as apartment_label, areas.name as area_name
    FROM tasks
    JOIN users ON users.id = tasks.assigned_to
    LEFT JOIN apartments ON apartments.id = tasks.apartment_id
    LEFT JOIN areas ON areas.id = tasks.area_id
    WHERE tasks.id = ?
  `).get(req.params.id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const isAdmin = req.user.role === 'admin';
  const isAssigned = task.assigned_to === req.user.sub;
  if (!isAdmin && !isAssigned) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  res.json({ task });
});

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const isAdmin = req.user.role === 'admin';
  const isAssigned = task.assigned_to === req.user.sub;
  if (!isAdmin && !isAssigned) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const { status, hours_spent, cost_amount, due_date, priority } = req.body;
  const completedAt = status === 'completed' ? nowIso() : task.completed_at;

  const hoursValue = hours_spent === undefined ? null : hours_spent;
  const costValue = cost_amount === undefined ? null : cost_amount;

  db.prepare(`
    UPDATE tasks SET status = COALESCE(?, status), hours_spent = COALESCE(?, hours_spent),
    cost_amount = COALESCE(?, cost_amount), due_date = COALESCE(?, due_date),
    priority = COALESCE(?, priority), completed_at = ?
    WHERE id = ?
  `).run(status || null, hoursValue, costValue, due_date || null, priority || null, completedAt, req.params.id);

  res.json({ ok: true });
});

app.post('/api/tasks/:id/remarks', requireAuth, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const isAdmin = req.user.role === 'admin';
  const isAssigned = task.assigned_to === req.user.sub;
  if (!isAdmin && !isAssigned) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }
  const id = newId();
  db.prepare(`
    INSERT INTO task_remarks (id, task_id, user_id, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, req.params.id, req.user.sub, message, nowIso());
  res.status(201).json({ id });
});

app.get('/api/tasks/:id/remarks', requireAuth, (req, res) => {
  const remarks = db.prepare(`
    SELECT task_remarks.*, users.name as author_name
    FROM task_remarks
    JOIN users ON users.id = task_remarks.user_id
    WHERE task_remarks.task_id = ?
    ORDER BY task_remarks.created_at DESC
  `).all(req.params.id);
  res.json({ remarks });
});

app.get('/api/overview', requireAuth, requireAdmin, (req, res) => {
  const totals = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
      SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked_count
    FROM tasks
  `).get();
  const costs = db.prepare('SELECT SUM(cost_amount) as total_cost FROM tasks').get();
  res.json({ totals, total_cost: costs.total_cost || 0 });
});

const sendTaskReminders = async () => {
  const tomorrow = formatDateLocal(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const tasks = db.prepare(`
    SELECT tasks.*, users.email as assigned_email, users.name as assigned_name
    FROM tasks
    JOIN users ON users.id = tasks.assigned_to
    WHERE tasks.due_date = ? AND tasks.reminder_sent_at IS NULL AND users.active = 1
  `).all(tomorrow);

  for (const task of tasks) {
    const subject = `Maintenance reminder: ${task.title}`;
    const text = `Bonjour ${task.assigned_name},\n\nRappel: votre tache "${task.title}" est prevue pour le ${task.due_date}.\n\nMerci.`;
    await sendEmail({ to: task.assigned_email, subject, text });
    db.prepare('UPDATE tasks SET reminder_sent_at = ? WHERE id = ?').run(nowIso(), task.id);
  }
};

const sendPreventiveReminders = async () => {
  const tomorrow = formatDateLocal(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const assets = db.prepare(`
    SELECT * FROM assets WHERE next_due_date = ?
  `).all(tomorrow);
  if (assets.length === 0) return;

  const admins = db.prepare("SELECT email, name FROM users WHERE role = 'admin' AND active = 1").all();
  const list = assets.map(asset => `- ${asset.name} (${asset.category}) due ${asset.next_due_date}`).join('\n');
  for (const admin of admins) {
    await sendEmail({
      to: admin.email,
      subject: 'Preventive maintenance reminders',
      text: `Bonjour ${admin.name},\n\nLes actifs suivants sont dus demain:\n${list}\n\nMerci.`,
    });
  }
};

if (!process.env.DISABLE_REMINDERS) {
  const cronSpec = process.env.REMINDER_CRON || '0 8 * * *';
  cron.schedule(cronSpec, async () => {
    try {
      await sendTaskReminders();
      await sendPreventiveReminders();
    } catch (error) {
      console.error('Reminder job failed:', error);
    }
  });
}

app.post('/api/reminders/run', requireAuth, requireAdmin, async (req, res) => {
  await sendTaskReminders();
  await sendPreventiveReminders();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Maintenance app backend running on ${PORT}`);
});
