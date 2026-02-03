// ============================================
// MYTROUVEPRO - BACKEND API SERVER
// ============================================
// © 2025-2026 Performance Cristal Technologies Avancées S.A.
// NEQ: 2280629637
// Version: 2.1.0 - Contact Form Email Support
// ============================================

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();

// ============================================
// IN-MEMORY DATABASE (Replace with real DB in production)
// ============================================
const users = [];
let userIdCounter = 1;

// Subscription tracking
const subscriptions = [];
let subscriptionIdCounter = 1;

// Provider photos storage
const providerPhotos = [];
let photoIdCounter = 1;

// Grace period for expired subscriptions (in days)
const GRACE_PERIOD_DAYS = 30;

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
const PAYMENTS_ENABLED = false;
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
    paymentsEnabled: PAYMENTS_ENABLED,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    paymentsEnabled: PAYMENTS_ENABLED,
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
  paymentsEnabled: PAYMENTS_ENABLED,
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
// SUBSCRIPTION MANAGEMENT
// ============================================

// Create subscription for provider
app.post('/api/subscriptions', async (req, res) => {
  try {
    const { userId, plan, paymentId, photos } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        success: false,
        error: 'userId and plan are required'
      });
    }

    // Calculate subscription end date based on plan
    const now = new Date();
    let endDate;
    switch (plan) {
      case 'monthly':
        endDate = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case 'sixMonth':
        endDate = new Date(now.setMonth(now.getMonth() + 6));
        break;
      case 'yearly':
        endDate = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      default:
        endDate = new Date(now.setMonth(now.getMonth() + 1));
    }

    const subscription = {
      id: subscriptionIdCounter++,
      userId,
      plan,
      paymentId: paymentId || null,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    subscriptions.push(subscription);

    // Store photos if provided
    if (photos && Array.isArray(photos)) {
      photos.forEach(photoData => {
        providerPhotos.push({
          id: photoIdCounter++,
          userId,
          subscriptionId: subscription.id,
          data: photoData,
          createdAt: new Date().toISOString()
        });
      });
    }

    // Update user status
    const user = users.find(u => u.id === userId);
    if (user) {
      user.subscriptionId = subscription.id;
      user.subscriptionEndDate = subscription.endDate;
    }

    res.status(201).json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription: ' + error.message
    });
  }
});

// Get subscription status
app.get('/api/subscriptions/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const subscription = subscriptions.find(s => s.userId === userId && s.status === 'active');
  
  if (!subscription) {
    return res.status(404).json({
      success: false,
      error: 'No active subscription found'
    });
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const isExpired = now > endDate;
  const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  res.json({
    success: true,
    subscription: {
      ...subscription,
      isExpired,
      daysRemaining: isExpired ? 0 : daysRemaining
    }
  });
});

// ============================================
// AUTOMATIC CLEANUP SERVICE
// ============================================

// Cleanup expired subscriptions and their data
function cleanupExpiredSubscriptions() {
  const now = new Date();
  const cleanupDate = new Date(now.getTime() - (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000));
  
  let cleanedCount = 0;
  let photosDeleted = 0;

  // Find expired subscriptions past grace period
  subscriptions.forEach(subscription => {
    const endDate = new Date(subscription.endDate);
    
    if (endDate < cleanupDate && subscription.status === 'active') {
      // Mark subscription as expired
      subscription.status = 'expired';
      
      // Delete associated photos
      const userPhotos = providerPhotos.filter(p => p.subscriptionId === subscription.id);
      userPhotos.forEach(photo => {
        const index = providerPhotos.indexOf(photo);
        if (index > -1) {
          providerPhotos.splice(index, 1);
          photosDeleted++;
        }
      });

      // Deactivate user account
      const user = users.find(u => u.id === subscription.userId);
      if (user) {
        user.status = 'inactive';
        user.deactivatedAt = new Date().toISOString();
        user.deactivationReason = 'subscription_expired';
      }

      cleanedCount++;
    }
  });

  return { cleanedCount, photosDeleted };
}

// Manual cleanup endpoint (for admin)
app.post('/api/admin/cleanup', (req, res) => {
  const result = cleanupExpiredSubscriptions();
  
  console.log(`Cleanup completed: ${result.cleanedCount} subscriptions expired, ${result.photosDeleted} photos deleted`);
  
  res.json({
    success: true,
    message: 'Cleanup completed',
    ...result
  });
});

// Get cleanup status
app.get('/api/admin/cleanup-status', (req, res) => {
  const now = new Date();
  const cleanupDate = new Date(now.getTime() - (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000));
  
  const expiredSubscriptions = subscriptions.filter(s => {
    const endDate = new Date(s.endDate);
    return endDate < cleanupDate && s.status === 'active';
  });

  const pendingCleanup = subscriptions.filter(s => {
    const endDate = new Date(s.endDate);
    return endDate < now && endDate >= cleanupDate && s.status === 'active';
  });

  res.json({
    success: true,
    stats: {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      expiredSubscriptions: expiredSubscriptions.length,
      pendingCleanup: pendingCleanup.length,
      totalPhotos: providerPhotos.length,
      gracePeriodDays: GRACE_PERIOD_DAYS
    }
  });
});

// Automatic cleanup job - runs every hour
setInterval(() => {
  const result = cleanupExpiredSubscriptions();
  if (result.cleanedCount > 0) {
    console.log(`[Auto-Cleanup] ${new Date().toISOString()}: Cleaned ${result.cleanedCount} expired subscriptions, deleted ${result.photosDeleted} photos`);
  }
}, 60 * 60 * 1000); // Run every hour

// ============================================
// CONTACT FORM EMAIL (using Resend API)
// ============================================

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Log email configuration status on startup
console.log(`Email configured: ${process.env.RESEND_API_KEY ? 'YES (Resend)' : 'NO'}`);

// Contact form endpoint - sends email to admin
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: name, email, subject, message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Admin email address
    const ADMIN_EMAIL = 'canada.servcorp@gmail.com';

    // Email HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #003DA5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">myTROUVEpro</h1>
          <p style="margin: 5px 0 0 0;">New Contact Form Message</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #003DA5; margin-top: 0;">Message Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">From:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 15px; background-color: #003DA5; color: white; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This message was sent from the contact form at www.mytrouvepro.net</p>
          <p style="margin: 5px 0 0 0;">© 2026 Performance Cristal Technologies Avancées S.A.</p>
        </div>
      </div>
    `;

    // Try to send email using Resend
    console.log(`Attempting to send email to ${ADMIN_EMAIL} via Resend...`);
    console.log(`Resend API configured: ${process.env.RESEND_API_KEY ? 'YES' : 'NO'}`);
    
    if (!process.env.RESEND_API_KEY) {
      console.log(`Resend API key not configured - storing message only`);
      console.log(`Contact form submission from ${name} (${email}): ${subject}`);
      console.log(`Message: ${message}`);
    } else {
      try {
        const { data, error } = await resend.emails.send({
          from: 'myTROUVEpro <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          replyTo: email,
          subject: `[myTROUVEpro Contact] ${subject}`,
          html: htmlContent
        });
        
        if (error) {
          console.error(`Email sending failed: ${error.message}`);
          console.log(`Contact form submission from ${name} (${email}): ${subject}`);
          console.log(`Message: ${message}`);
        } else {
          console.log(`Contact form email sent successfully! ID: ${data.id}`);
        }
      } catch (emailError) {
        console.error(`Email sending failed: ${emailError.message}`);
        console.log(`Contact form submission from ${name} (${email}): ${subject}`);
        console.log(`Message: ${message}`);
      }
    }

    res.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
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
