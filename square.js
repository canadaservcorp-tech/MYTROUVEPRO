// Square Payment Configuration
const squareEnvironment = (import.meta.env.VITE_SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
const isProduction = squareEnvironment === 'production';
const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID || '';
const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID || '';

if (!applicationId || !locationId) {
  console.warn('Square configuration missing. Set VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID.');
}

export const SQUARE_CONFIG = {
  applicationId,
  locationId,
  // Note: Access token should be used server-side only for security
  // For client-side, we only need applicationId and locationId
  environment: squareEnvironment
};

// Square Web Payments SDK URL
export const SQUARE_SDK_URL = isProduction
  ? 'https://web.squarecdn.com/v1/square.js'
  : 'https://sandbox.web.squarecdn.com/v1/square.js';
