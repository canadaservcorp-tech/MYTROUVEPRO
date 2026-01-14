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

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: [
    'https://mytrouvepro11.netlify.app',
    'https://mytrouvepro.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

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
║  Location: ${locationId}                              ║
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
app.get('/api/config', (req, res) => {
  res.json({
    appId: appId,
    locationId: locationId,
    environment: isProduction ? 'production' : 'sandbox'
  });
});

// Test Square connection
app.get('/api/test', async (req, res) => {
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create Payment Link (for booking services)
app.post('/api/create-payment-link', async (req, res) => {
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

    // Validate
    if (!serviceName || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Service name and amount are required' 
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');
    
    // Calculate taxes (Quebec)
    const subtotal = Math.round(amount * 100); // Convert to cents
    const tps = Math.round(subtotal * 0.05); // 5% GST
    const tvq = Math.round(subtotal * 0.09975); // 9.975% QST
    const total = subtotal + tps + tvq;

    // Create payment link
    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey,
      order: {
        locationId,
        lineItems: [{
          name: serviceName,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(subtotal),
            currency: 'CAD'
          },
          note: `Provider: ${providerName || 'TBD'} | Date: ${bookingDate || 'TBD'} at ${bookingTime || 'TBD'}`
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
          providerId: providerId || '',
          providerName: providerName || '',
          customerName: customerName || '',
          bookingDate: bookingDate || '',
          bookingTime: bookingTime || '',
          address: address || '',
          source: 'mytrouvepro-app'
        }
      },
      checkoutOptions: {
        allowTipping: true,
        redirectUrl: 'https://mytrouvepro11.netlify.app/booking-success',
        merchantSupportEmail: 'support@mytrouvepro.com'
      },
      prePopulatedData: {
        buyerEmail: customerEmail || undefined,
        buyerPhoneNumber: customerPhone || undefined
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
        subtotal: amount,
        tps: tps / 100,
        tvq: tvq / 100,
        total: total / 100
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

// Process Direct Payment (with card nonce from Web Payments SDK)
app.post('/api/process-payment', async (req, res) => {
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

    if (!sourceId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Source ID and amount are required'
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');
    
    // Calculate total with taxes
    const subtotal = Math.round(amount * 100);
    const tps = Math.round(subtotal * 0.05);
    const tvq = Math.round(subtotal * 0.09975);
    const total = subtotal + tps + tvq;

    // Process payment
    const response = await squareClient.paymentsApi.createPayment({
      idempotencyKey,
      sourceId,
      amountMoney: {
        amount: BigInt(total),
        currency: 'CAD'
      },
      locationId,
      note: `myTROUVEpro - ${serviceName || 'Service'} | Provider: ${providerName || 'N/A'}`,
      buyerEmailAddress: customerEmail || undefined,
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
        subtotal: amount,
        tps: tps / 100,
        tvq: tvq / 100,
        total: total / 100
      }
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Payment Status
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Recent Payments (Admin)
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Process Refund
app.post('/api/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }

    const idempotencyKey = crypto.randomBytes(16).toString('hex');

    const refundRequest = {
      idempotencyKey,
      paymentId,
      reason: reason || 'Customer requested refund'
    };

    // If partial refund
    if (amount) {
      refundRequest.amountMoney = {
        amount: BigInt(Math.round(amount * 100)),
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
    console.error('Refund error:', error);
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
