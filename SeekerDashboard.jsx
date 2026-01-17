import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext-Supabase';
import { 
  Calendar, 
  Heart, 
  Search, 
  Clock,
  CheckCircle,
  MapPin,
  Star
} from 'lucide-react';

const SeekerDashboard = () => {
  const { user } = useAuth();

  // Mock data - in production, fetch from backend
  const upcomingBookings = [
    { 
      id: 1, 
      provider: 'Marie-Claire Dubois', 
      service: 'Swedish Massage (60min)', 
      date: '2026-01-15', 
      time: '10:00', 
      amount: 51.74,
      status: 'confirmed',
      location: 'Laval, QC'
    },
    { 
      id: 2, 
      provider: 'Jean-Pierre Martin', 
      service: 'Oil Change', 
      date: '2026-01-18', 
      time: '14:00', 
      amount: 51.74,
      status: 'confirmed',
      location: 'Laval, QC'
    },
  ];

  const favoriteProviders = [
    { id: 1, name: 'Marie-Claire Dubois', category: 'Massage Therapist', rating: 4.9, image: '💆‍♀️' },
    { id: 2, name: 'ProPlumb Solutions', category: 'Plumbing', rating: 4.8, image: '🔧' },
    { id: 3, name: 'Clean & Shine', category: 'Cleaning', rating: 4.9, image: '🧹' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center"><CheckCircle size={12} className="mr-1" /> Confirmed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center"><Clock size={12} className="mr-1" /> Pending</span>;
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
              Welcome, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Find the best local services near you</p>
          </div>
          <Link
            to="/search"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            <Search size={20} className="mr-2" />
            Find Services
          </Link>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">What do you need help with?</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { icon: '🏥', name: 'Healthcare' },
              { icon: '🏠', name: 'Home' },
              { icon: '🚗', name: 'Auto' },
              { icon: '💇', name: 'Beauty' },
              { icon: '📚', name: 'Education' },
              { icon: '⚖️', name: 'Legal' },
              { icon: '💻', name: 'Tech' },
              { icon: '🔧', name: 'Repairs' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${cat.name.toLowerCase()}`}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs text-gray-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="mr-2 text-red-600" size={24} />
                  Upcoming Bookings
                </h2>
                <Link to="/my-bookings" className="text-red-600 hover:underline text-sm">
                  View all →
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">No upcoming bookings</p>
                  <Link to="/search" className="text-red-600 hover:underline mt-2 inline-block">
                    Find a service →
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.service}</p>
                          <p className="text-sm text-gray-600">{booking.provider}</p>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <MapPin size={12} className="mr-1" />
                            {booking.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar size={14} className="mr-1" />
                            {booking.date} at {booking.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.amount.toFixed(2)}</p>
                          <div className="mt-1">{getStatusBadge(booking.status)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite Providers */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Heart className="mr-2 text-red-500" size={20} />
                  Favorites
                </h3>
                <Link to="/favorites" className="text-red-600 hover:underline text-sm">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {favoriteProviders.map((provider) => (
                  <Link
                    key={provider.id}
                    to={`/provider/${provider.id}`}
                    className="flex items-center p-4 hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      {provider.image}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-xs text-gray-500">{provider.category}</p>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} className="fill-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{provider.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-2">✨ Did you know?</h3>
              <p className="text-sm text-green-700">
                You can save your favorite providers and get notified when they have special offers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
