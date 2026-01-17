import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const BookingSuccessPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-lg mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed</h1>
        <p className="text-gray-600 mb-6">
          Your payment is complete. Contact details are now available in your dashboard.
        </p>
        <Link
          to="/seeker/dashboard"
          className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default BookingSuccessPage;
