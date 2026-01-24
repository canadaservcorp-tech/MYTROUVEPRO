import React from 'react';

const PrivacyPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-3xl mx-auto px-4 bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        We only share provider and seeker contact details after a booking is confirmed and payment is completed.
      </p>
      <p className="text-gray-600">
        Provider photos are watermarked to prevent contact information from being displayed before booking.
      </p>
    </div>
  </div>
);

export default PrivacyPage;
