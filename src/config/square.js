// Square Payment Configuration
// Sandbox credentials for testing
export const SQUARE_CONFIG = {
  applicationId: 'sandbox-sq0idb-Z6g4W5yCPznRerTcgUTLBQ',
  locationId: 'LGKWFNKR77SCA',
  // Note: Access token should be used server-side only for security
  // For client-side, we only need applicationId and locationId
  environment: 'sandbox', // Change to 'production' for live
};

// Square Web Payments SDK URL
export const SQUARE_SDK_URL = 'https://sandbox.web.squarecdn.com/v1/square.js';
// For production: 'https://web.squarecdn.com/v1/square.js'
