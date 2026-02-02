// ============================================
// MYTROUVEPRO - BACKEND PAYMENT SERVER
// ============================================
// © 2025 Performance Cristal Technologies Avancées S.A.
// NEQ: 2280629637
// ============================================

import express from 'express';
import cors from 'cors';
import square from 'square';
import crypto from 'crypto';
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
// SQUARE CONFIGURATION
// ============================================
const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';

const { Client, Environment } = square;

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: isProduction ? Environment.Production : Environment.Sandbox,
});

const locationId = process.env.SQUARE_LOCATION_ID;
const appId = process.env.SQUARE_APPLICATION_ID;
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
    service: 'myTROUVEpro Payment Server',
    company: 'Performance Cristal Technologies Avancées S.A.',
    mode: isProduction ? 'PRODUCTION' : 'SANDBOX',
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
// SQUARE CONFIG ENDPOINT
// ============================================
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    squareApplicationId: appId,
    squareLocationId: locationId,
    environment: isProduction ? 'production' : 'sandbox'
  });
});

// ============================================
// TEST ENDPOINT
// ============================================
app.get('/api/test', async (req, res) => {
  try {
    const response = await squareClient.locationsApi.listLocations();
    res.json({
      success: true,
      message: 'Square connection successful',
      mode: isProduction ? 'PRODUCTION' : 'SANDBOX',
      locations: response.result.locations?.length || 0
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      mode: isProduction ? 'PRODUCTION' : 'SANDBOX'
    });
  }
});

// ============================================
// CREATE PAYMENT LINK
// ============================================
app.post('/api/create-payment-link', async (req, res) => {
  try {
    const { amount, description, providerId, bookingId, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    // Calculate Quebec taxes
    const subtotal = parseFloat(amount);
    const tps = Math.round(subtotal * 5) / 100;      // 5% TPS/GST
    const tvq = Math.round(subtotal * 9.975) / 100;  // 9.975% TVQ/QST
    const total = subtotal + tps + tvq;
    const amountInCents = Math.round(total * 100);

    const idempotencyKey = crypto.randomBytes(16).toString('hex');

    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey,
      order: {
        locationId,
        lineItems: [{
          name: description || 'myTROUVEpro Service',
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(amountInCents),
            currency: 'CAD'
          },
          note: `Provider: ${providerId || 'N/A'} | Booking: ${bookingId || 'N/A'}`
        }]
      },
      checkoutOptions: {
        redirectUrl: 'https://mytrouvepro11.netlify.app/payment-success',
        askForShippingAddress: false
      },
      prePopulatedData: {
        buyerEmail: customerEmail || undefined
      }
    });

    const paymentLink = response.result.paymentLink;

    res.json({
      success: true,
      checkoutUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
      orderId: paymentLink.orderId,
      pricing: {
        subtotal: subtotal.toFixed(2),
        tps: tps.toFixed(2),
        tvq: tvq.toFixed(2),
        total: total.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Payment link error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET PAYMENT STATUS
// ============================================
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await squareClient.paymentsApi.getPayment(paymentId);
    const payment = response.result.payment;

    res.json({
      success: true,
      status: payment.status,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: Number(payment.amountMoney.amount) / 100,
        currency: payment.amountMoney.currency,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// SQUARE WEBHOOK
// ============================================
app.post('/api/square/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  
  const event = req.body;
  
  if (event.type === 'payment.completed') {
    console.log('Payment completed:', event.data?.object?.payment?.id);
  }
  
  res.status(200).json({ received: true });
});

// ============================================
// LIST PAYMENTS (Admin)
// ============================================
app.get('/api/payments', async (req, res) => {
  try {
    const response = await squareClient.paymentsApi.listPayments({
      locationId,
      sortOrder: 'DESC',
      limit: 50
    });

    const payments = (response.result.payments || []).map(p => ({
      id: p.id,
      status: p.status,
      amount: Number(p.amountMoney.amount) / 100,
      currency: p.amountMoney.currency,
      createdAt: p.createdAt,
      receiptUrl: p.receiptUrl
    }));

    res.json({
      success: true,
      payments,
      count: payments.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  myTROUVEpro Payment Server                                  ║
║  Mode: ${isProduction ? 'PRODUCTION' : 'SANDBOX'}                                        ║
║  Port: ${PORT}                                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ENDPOINTS:                                                  ║
║  GET  /                        - Health check                ║
║  GET  /api/health              - Service health              ║
║  GET  /api/test                - Test Square connection      ║
║  GET  /api/config              - Get Square config           ║
║  POST /api/auth/register       - Register user               ║
║  POST /api/auth/login          - Login user                  ║
║  GET  /api/auth/me             - Get current user            ║
║  POST /api/create-payment-link - Create payment link         ║
║  GET  /api/payments/:id/status - Get payment status          ║
║  GET  /api/payments            - List payments               ║
║  POST /api/square/webhook      - Square webhook              ║
╠══════════════════════════════════════════════════════════════╣
║  © 2025 Performance Cristal Technologies Avancées S.A.       ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;