// ============================================
// MYTROUVEPRO - BACKEND API SERVER
// ============================================
// © 2025 Performance Cristal Technologies Avancées S.A.
// NEQ: 2280629637
// ============================================

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ============================================
// IN-MEMORY DATABASE (Replace with real DB in production)
// ============================================
const users = [];
let userIdCounter = 1;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: [
    'https://mytrouvepro11.netlify.app',
    'https://mytrouvepro.com',
    'http://localhost:3000',
    'http://localhost:5173',
    '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ============================================
// ENVIRONMENT
// ============================================
const runtimeEnv = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'mytrouvepro-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    businessName: user.businessName,
    service: user.service,
    createdAt: user.createdAt,
    status: user.status
  };
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'myTROUVEpro API Server',
    company: 'Performance Cristal Technologies Avancées S.A.',
    environment: runtimeEnv,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// Register User (Seeker or Provider)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, role, businessName, service } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing fields: email, password, and name are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!normalizedEmail || !trimmedName) {
      return res.status(400).json({
        success: false,
        error: 'Missing fields: email, password, and name are required'
      });
    }

    // Check if email exists
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters'
      });
    }

    const allowedRoles = ['customer', 'provider'];
    const normalizedRoleValue = typeof role === 'string' ? role.toLowerCase() : '';
    const normalizedRole = allowedRoles.includes(normalizedRoleValue)
      ? normalizedRoleValue
      : 'customer';

    // Create user
    const user = {
      id: userIdCounter++,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS),
      name: trimmedName,
      phone: phone || '',
      role: normalizedRole,
      businessName: businessName || '',
      service: service || '',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed: ' + error.message
    });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = users.find(u => u.id === payload.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// ============================================
// PAYMENTS TEMPORARILY DISABLED
// ============================================
const paymentsDisabledResponse = {
  success: false,
  error: 'Payments are temporarily disabled while we transition gateways.'
};

app.post('/api/create-payment-link', (req, res) => {
  res.status(503).json(paymentsDisabledResponse);
});

app.get('/api/payments/:paymentId/status', (req, res) => {
  res.status(503).json(paymentsDisabledResponse);
});

app.get('/api/payments', (req, res) => {
  res.status(503).json(paymentsDisabledResponse);
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  myTROUVEpro API Server                                      ║
║  Environment: ${runtimeEnv}                                           ║
║  Port: ${PORT}                                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ENDPOINTS:                                                  ║
║  GET  /                        - Health check                ║
║  GET  /api/health              - Service health              ║
║  POST /api/auth/register       - Register user               ║
║  POST /api/auth/login          - Login user                  ║
║  GET  /api/auth/me             - Get current user            ║
║  POST /api/create-payment-link - Payments disabled (503)     ║
║  GET  /api/payments/:id/status - Payments disabled (503)     ║
║  GET  /api/payments            - Payments disabled (503)     ║
╠══════════════════════════════════════════════════════════════╣
║  © 2025 Performance Cristal Technologies Avancées S.A.       ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;