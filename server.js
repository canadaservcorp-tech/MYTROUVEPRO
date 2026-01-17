// ============================================
// MYTROUVEPRO - BACKEND PAYMENT SERVER
// ============================================
// © 2025 Performance Cristal Technologies Avancées S.A.
// NEQ: 2280629637
// ============================================

const express = require('express');
const cors = require('cors');
const { Client, Environment } = require('square');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE
// ============================================
const defaultAllowedOrigins = [
  'https://mytrouvepro11.netlify.app',
  'https://mytrouvepro.com',
  'http://localhost:3000',
  'http://localhost:5173'
];
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '50kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cache-Control', 'no-store');
  if (process.env.ENFORCE_HTTPS === 'true') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

if (process.env.ENFORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto !== 'https') {
      return res.status(403).json({ success: false, error: 'HTTPS required' });
    }
    return next();
  });
}

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref();

const rateLimit = ({ windowMs = RATE_LIMIT_WINDOW_MS, max = RATE_LIMIT_MAX, keyPrefix }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let record = rateLimitStore.get(key);
    if (!record || record.resetTime <= now) {
      record = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, record);
    }
    record.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({ success: false, error: 'Too many requests' });
    }
    return next();
  };
};

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const MAX_AMOUNT_CAD = Number(process.env.MAX_PAYMENT_AMOUNT_CAD || 10000);

const safeCompare = (a, b) => {
  if (!a || !b) return false;
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

const getApiKey = (req) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const headerKey = req.headers['x-api-key'];
  if (Array.isArray(headerKey)) {
    return headerKey[0];
  }
  return headerKey ? String(headerKey).trim() : '';
};

const requireAdminKey = (req, res, next) => {
  if (!ADMIN_API_KEY) {
    return res.status(503).json({ success: false, error: 'Admin API key not configured' });
  }
  const provided = getApiKey(req);
  if (!safeCompare(provided, ADMIN_API_KEY)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  return next();
};

const sanitizeText = (value, maxLength = 256) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const sanitizeOptionalText = (value, maxLength = 256) => {
  const text = sanitizeText(value, maxLength);
  return text.length > 0 ? text : undefined;
};

const parseAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT_CAD) {
    return null;
  }
  return Math.round(amount * 100) / 100;
};

const handleServerError = (res, error, context) => {
  console.error(`${context} error:`, error);
  return res.status(500).json({ success: false, error: 'Internal server error' });
};

// ============================================
// SQUARE CONFIGURATION
// ============================================
const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: isProduction ? Environment.Production : Environment.Sandbox,
});

const locationId = process.env.SQUARE_LOCATION_ID;
const appId = process.env.SQUARE_APPLICATION_ID;

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  myTROUVEpro Payment Server                                  ║
║  Mode: ${isProduction ? 'PRODUCTION 💰' : 'SANDBOX 🧪'}                                       ║
╚══════════════════════════════════════════════════════════════╝
`);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'myTROUVEpro Payment Server',
    version: '1.0.0',
    mode: isProduction ? 'production' : 'sandbox',
    company: 'Performance Cristal Technologies Avancées S.A.',
    neq: '2280629637'
  });
});

// Get Square App ID (for frontend)
app.get('/api/config', rateLimit({ keyPrefix: 'config' }), (req, res) => {
  res.json({
    appId: appId,
    locationId: locationId,
    environment: isProduction ? 'production' : 'sandbox'
  });
});

// Test Square connection
app.get('/api/test', requireAdminKey, rateLimit({ keyPrefix: 'admin-test' }), async (req, res) => {
  try {
    const response = await squareClient.locationsApi.retrieveLocation(locationId);
    const location = response.result.location;
    
    res.json({
      success: true,
      message: 'Square connected successfully!',
      location: {
        id: location.id,
        name: location.name,
        businessName: location.businessName,
        country: location.country,
        currency: location.currency,
        status: location.status
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Square test');
  }
});

// Create Payment Link (for booking services)
app.post('/api/create-payment-link', rateLimit({ keyPrefix: 'payment-link' }), async (req, res) => {
  try {
    const { 
      serviceName, 
      amount, 
      customerEmail, 
      customerPhone,
      customerName,
      providerId,
      providerName,
      bookingDate,
      bookingTime,
      address
    } = req.body;

    const sanitizedServiceName = sanitizeText(serviceName, 120);
    const validatedAmount = parseAmount(amount);

    // Validate
    if (!sanitizedServiceName || validatedAmount === null) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid service name and amount are required' 
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');
    
    // Calculate taxes (Quebec)
    const subtotal = Math.round(validatedAmount * 100); // Convert to cents
    const tps = Math.round(subtotal * 0.05); // 5% GST
    const tvq = Math.round(subtotal * 0.09975); // 9.975% QST
    const total = subtotal + tps + tvq;

    // Create payment link
    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey,
      order: {
        locationId,
        lineItems: [{
          name: sanitizedServiceName,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(subtotal),
            currency: 'CAD'
          },
          note: `Provider: ${sanitizeText(providerName, 80) || 'TBD'} | Date: ${sanitizeText(bookingDate, 40) || 'TBD'} at ${sanitizeText(bookingTime, 40) || 'TBD'}`
        }],
        taxes: [
          {
            uid: 'tps',
            name: 'TPS/GST (5%)',
            percentage: '5.0',
            scope: 'ORDER'
          },
          {
            uid: 'tvq', 
            name: 'TVQ/QST (9.975%)',
            percentage: '9.975',
            scope: 'ORDER'
          }
        ],
        metadata: {
          providerId: sanitizeText(providerId, 60) || 'N/A',
          providerName: sanitizeText(providerName, 80) || 'N/A',
          customerName: sanitizeText(customerName, 80) || 'N/A',
          bookingDate: sanitizeText(bookingDate, 40) || 'TBD',
          bookingTime: sanitizeText(bookingTime, 40) || 'TBD',
          address: sanitizeText(address, 120) || 'TBD',
          source: 'mytrouvepro-app'
        }
      },
      checkoutOptions: {
        allowTipping: true,
        redirectUrl: 'https://mytrouvepro11.netlify.app/booking-success',
        merchantSupportEmail: 'support@mytrouvepro.com'
      },
      prePopulatedData: {
        buyerEmail: sanitizeOptionalText(customerEmail, 254),
        buyerPhoneNumber: sanitizeOptionalText(customerPhone, 30)
      }
    });

    const paymentLink = response.result.paymentLink;

    res.json({
      success: true,
      paymentLink: {
        id: paymentLink.id,
        url: paymentLink.url,
        orderId: paymentLink.orderId
      },
      pricing: {
        subtotal: validatedAmount,
        tps: tps / 100,
        tvq: tvq / 100,
        total: total / 100
      }
    });

  } catch (error) {
    return handleServerError(res, error, 'Payment link');
  }
});

// Process Direct Payment (with card nonce from Web Payments SDK)
app.post('/api/process-payment', rateLimit({ keyPrefix: 'process-payment' }), async (req, res) => {
  try {
    const {
      sourceId, // Card nonce from Square Web Payments SDK
      amount,
      serviceName,
      customerEmail,
      customerName,
      providerId,
      providerName
    } = req.body;

    const sanitizedSourceId = sanitizeText(sourceId, 200);
    const validatedAmount = parseAmount(amount);

    if (!sanitizedSourceId || validatedAmount === null) {
      return res.status(400).json({
        success: false,
        error: 'Valid source ID and amount are required'
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');
    
    // Calculate total with taxes
    const subtotal = Math.round(validatedAmount * 100);
    const tps = Math.round(subtotal * 0.05);
    const tvq = Math.round(subtotal * 0.09975);
    const total = subtotal + tps + tvq;

    // Process payment
    const response = await squareClient.paymentsApi.createPayment({
      idempotencyKey,
      sourceId: sanitizedSourceId,
      amountMoney: {
        amount: BigInt(total),
        currency: 'CAD'
      },
      locationId,
      note: `myTROUVEpro - ${sanitizeText(serviceName, 120) || 'Service'} | Provider: ${sanitizeText(providerName, 80) || 'N/A'}`,
      buyerEmailAddress: sanitizeOptionalText(customerEmail, 254),
      referenceId: `MTP-${Date.now()}`
    });

    const payment = response.result.payment;

    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
        amount: Number(payment.amountMoney.amount) / 100,
        referenceId: payment.referenceId
      },
      pricing: {
        subtotal: validatedAmount,
        tps: tps / 100,
        tvq: tvq / 100,
        total: total / 100
      }
    });

  } catch (error) {
    return handleServerError(res, error, 'Payment');
  }
});

// Get Payment Status
app.get('/api/payment/:paymentId', requireAdminKey, rateLimit({ keyPrefix: 'payment-status' }), async (req, res) => {
  try {
    const paymentId = sanitizeText(req.params.paymentId, 120);
    if (!paymentId) {
      return res.status(400).json({ success: false, error: 'Payment ID is required' });
    }
    
    const response = await squareClient.paymentsApi.getPayment(paymentId);
    const payment = response.result.payment;

    res.json({
      success: true,
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
    return handleServerError(res, error, 'Payment status');
  }
});

// Get Recent Payments (Admin)
app.get('/api/payments', requireAdminKey, rateLimit({ keyPrefix: 'payments-admin' }), async (req, res) => {
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
      receiptUrl: p.receiptUrl,
      referenceId: p.referenceId,
      note: p.note
    }));

    res.json({
      success: true,
      payments,
      count: payments.length
    });

  } catch (error) {
    return handleServerError(res, error, 'Payments list');
  }
});

// Process Refund
app.post('/api/refund', requireAdminKey, rateLimit({ keyPrefix: 'refund' }), async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    const sanitizedPaymentId = sanitizeText(paymentId, 120);
    const validatedAmount = amount ? parseAmount(amount) : null;

    if (!sanitizedPaymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }
    if (amount && validatedAmount === null) {
      return res.status(400).json({
        success: false,
        error: 'Invalid refund amount'
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');

    const refundRequest = {
      idempotencyKey,
      paymentId: sanitizedPaymentId,
      reason: sanitizeText(reason, 200) || 'Customer requested refund'
    };

    // If partial refund
    if (amount && validatedAmount !== null) {
      refundRequest.amountMoney = {
        amount: BigInt(Math.round(validatedAmount * 100)),
        currency: 'CAD'
      };
    }

    const response = await squareClient.refundsApi.refundPayment(refundRequest);
    const refund = response.result.refund;

    res.json({
      success: true,
      refund: {
        id: refund.id,
        status: refund.status,
        amount: Number(refund.amountMoney.amount) / 100
      }
    });

  } catch (error) {
    return handleServerError(res, error, 'Refund');
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
🚀 myTROUVEpro Payment Server running on port ${PORT}
📍 Endpoints:
   GET  /                       - Health check
   GET  /api/config             - Get Square config for frontend
   GET  /api/test               - Test Square connection
   POST /api/create-payment-link - Create payment link
   POST /api/process-payment     - Process direct payment
   GET  /api/payment/:id         - Get payment status
   GET  /api/payments            - List recent payments
   POST /api/refund              - Process refund
  `);
});

module.exports = app;
