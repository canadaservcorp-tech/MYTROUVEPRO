import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext-Supabase';
import { 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp, 
  Plus, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProviderDashboard = () => {
  const { user } = useAuth();

  // Mock data - in production, fetch from backend
  const stats = {
    totalEarnings: user?.earnings || 0,
    pendingEarnings: 125.50,
    totalBookings: user?.totalBookings || 0,
    pendingBookings: 3,
    rating: user?.rating || 4.8,
    reviewCount: 12,
    profileViews: 156,
  };

  const recentBookings = [
    { id: 1, customer: 'Marie L.', service: 'Swedish Massage', date: '2026-01-15', time: '10:00', amount: 45, status: 'confirmed' },
    { id: 2, customer: 'Jean P.', service: 'Deep Tissue', date: '2026-01-15', time: '14:00', amount: 55, status: 'pending' },
    { id: 3, customer: 'Sophie B.', service: 'Hot Stone', date: '2026-01-16', time: '11:00', amount: 85, status: 'confirmed' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center"><CheckCircle size={12} className="mr-1" /> Confirmed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center"><Clock size={12} className="mr-1" /> Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center"><AlertCircle size={12} className="mr-1" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1">{user?.businessName}</p>
          </div>
          <Link
            to="/my-services/add"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            <Plus size={20} className="mr-2" />
            Add New Service
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              ${stats.totalEarnings.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xs text-green-600 mt-1">
              +${stats.pendingEarnings.toFixed(2)} pending
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                {stats.pendingBookings} new
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {stats.totalBookings}
            </p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {stats.rating}
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-xs text-gray-400 mt-1">{stats.reviewCount} reviews</p>
          </div>

          {/* Profile Views */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {stats.profileViews}
            </p>
            <p className="text-sm text-gray-500">Profile Views</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
        </div>

        {/* Commission Info */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Your Commission Rate: 10%</h3>
              <p className="text-green-100 mt-1">
                You keep 90% of every booking. No monthly fees!
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-3xl font-bold">
                ${(stats.totalEarnings * 0.9).toFixed(2)}
              </p>
              <p className="text-green-100 text-sm">Your earnings (after commission)</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <Link to="/bookings" className="text-red-600 hover:underline text-sm">
                  View all →
                </Link>
              </div>
              <div className="divide-y">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.customer}</p>
                        <p className="text-sm text-gray-500">{booking.service}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${booking.amount}</p>
                        <div className="mt-1">{getStatusBadge(booking.status)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/my-services"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  Manage Services
                </Link>
                <Link
                  to="/availability"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  Set Availability
                </Link>
                <Link
                  to="/profile"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-700">
                Complete your profile with photos and detailed service descriptions to attract more customers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
