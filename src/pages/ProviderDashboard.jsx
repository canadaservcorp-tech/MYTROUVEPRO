import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedImage } from '../components/ProtectedContent';
import {
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  Plus,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  X
} from 'lucide-react';

const ProviderDashboard = ({ language = 'en' }) => {
  const { user, updateProfile, toggleProfilePublished } = useAuth();
  const [showPreview, setShowPreview] = useState(false);

  const content = {
    en: {
      welcome: 'Welcome back',
      addService: 'Add New Service',
      totalEarnings: 'Total Earnings',
      pending: 'pending',
      totalBookings: 'Total Bookings',
      newBookings: 'new',
      avgRating: 'Average Rating',
      reviews: 'reviews',
      profileViews: 'Profile Views',
      thisMonth: 'This month',
      commissionRate: 'Your Commission Rate: 10%',
      youKeep: 'You keep 90% of every booking. No monthly fees!',
      yourEarnings: 'Your earnings (after commission)',
      recentBookings: 'Recent Bookings',
      viewAll: 'View all',
      quickActions: 'Quick Actions',
      manageServices: 'Manage Services',
      setAvailability: 'Set Availability',
      editProfile: 'Edit Profile',
      bankSettings: 'Bank Settings',
      proTip: 'Pro Tip',
      proTipText: 'Complete your profile with photos and detailed service descriptions to attract more customers!',
      confirmed: 'Confirmed',
      paymentInfo: 'Payment Info',
      paymentInfoText: '90% of booking amount released within 2 business days after service completion to your registered bank account.',
      previewProfile: 'Preview My Page',
      publishProfile: 'Publish Profile',
      profilePublished: 'Profile Published',
      profileUnpublished: 'Profile Hidden',
      previewTitle: 'Profile Preview',
      closePreview: 'Close Preview',
      publishedNote: 'Your profile is visible to customers',
      unpublishedNote: 'Your profile is hidden from customers',
      setupBank: 'Set up your bank account to receive payments',
      contactHidden: 'Contact info hidden until booking is paid'
    },
    fr: {
      welcome: 'Bienvenue',
      addService: 'Ajouter un service',
      totalEarnings: 'Gains totaux',
      pending: 'en attente',
      totalBookings: 'Réservations totales',
      newBookings: 'nouvelles',
      avgRating: 'Note moyenne',
      reviews: 'avis',
      profileViews: 'Vues du profil',
      thisMonth: 'Ce mois',
      commissionRate: 'Votre taux de commission: 10%',
      youKeep: 'Vous gardez 90% de chaque réservation. Pas de frais mensuels!',
      yourEarnings: 'Vos gains (après commission)',
      recentBookings: 'Réservations récentes',
      viewAll: 'Voir tout',
      quickActions: 'Actions rapides',
      manageServices: 'Gérer les services',
      setAvailability: 'Définir la disponibilité',
      editProfile: 'Modifier le profil',
      bankSettings: 'Paramètres bancaires',
      proTip: 'Conseil Pro',
      proTipText: 'Complétez votre profil avec des photos et des descriptions détaillées pour attirer plus de clients!',
      confirmed: 'Confirmé',
      paymentInfo: 'Info Paiement',
      paymentInfoText: '90% du montant de la réservation libéré dans les 2 jours ouvrables après la fin du service sur votre compte bancaire enregistré.',
      previewProfile: 'Aperçu de ma page',
      publishProfile: 'Publier le profil',
      profilePublished: 'Profil publié',
      profileUnpublished: 'Profil masqué',
      previewTitle: 'Aperçu du profil',
      closePreview: 'Fermer l\'aperçu',
      publishedNote: 'Votre profil est visible aux clients',
      unpublishedNote: 'Votre profil est masqué aux clients',
      setupBank: 'Configurez votre compte bancaire pour recevoir les paiements',
      contactHidden: 'Coordonnées cachées jusqu\'au paiement de la réservation'
    }
  };

  const t = content[language];

  // Mock data - in production, fetch from backend
  const stats = {
    totalEarnings: user?.earnings || 0,
    pendingEarnings: user?.pendingEarnings || 125.50,
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
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center"><CheckCircle size={12} className="mr-1" /> {t.confirmed}</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center"><Clock size={12} className="mr-1" /> {t.pending}</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center"><AlertCircle size={12} className="mr-1" /> Cancelled</span>;
      default:
        return null;
    }
  };

  // Profile Preview Modal
  const ProfilePreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b bg-blue-900 text-white rounded-t-2xl">
          <h3 className="text-lg font-semibold">{t.previewTitle}</h3>
          <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-blue-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Provider Profile Card Preview */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <ProtectedImage
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600"
              alt={user?.businessName}
              className="h-48"
              showWatermark={true}
            />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.businessName || 'Your Business Name'}</h2>
                  <p className="text-blue-600">{user?.category || 'Service Category'}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {language === 'en' ? 'Verified' : 'Vérifié'}
                </span>
              </div>

              <p className="text-gray-600 mt-4">{user?.description || 'Your service description will appear here...'}</p>

              <div className="flex items-center mt-4 text-sm">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="ml-1 font-semibold">{stats.rating}</span>
                <span className="text-gray-400 ml-1">({stats.reviewCount} {t.reviews})</span>
              </div>

              {/* Hidden contact info notice */}
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm flex items-center justify-center">
                  <AlertCircle size={16} className="mr-2" />
                  {t.contactHidden}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t.welcome}, {user?.firstName}!
            </h1>
            <p className="text-gray-500 mt-1">{user?.businessName}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              <Eye size={18} className="mr-2" />
              {t.previewProfile}
            </button>

            {/* Publish Toggle */}
            <button
              onClick={toggleProfilePublished}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                user?.profilePublished
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {user?.profilePublished ? (
                <>
                  <ToggleRight size={18} className="mr-2" />
                  {t.profilePublished}
                </>
              ) : (
                <>
                  <ToggleLeft size={18} className="mr-2" />
                  {t.profileUnpublished}
                </>
              )}
            </button>

            <Link
              to="/my-services/add"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              {t.addService}
            </Link>
          </div>
        </div>

        {/* Publish Status Notice */}
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          user?.profilePublished
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
        }`}>
          {user?.profilePublished ? (
            <>
              <Eye className="mr-2" size={20} />
              {t.publishedNote}
            </>
          ) : (
            <>
              <EyeOff className="mr-2" size={20} />
              {t.unpublishedNote}
            </>
          )}
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
            <p className="text-sm text-gray-500">{t.totalEarnings}</p>
            <p className="text-xs text-green-600 mt-1">
              +${stats.pendingEarnings.toFixed(2)} {t.pending}
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                {stats.pendingBookings} {t.newBookings}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {stats.totalBookings}
            </p>
            <p className="text-sm text-gray-500">{t.totalBookings}</p>
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
            <p className="text-sm text-gray-500">{t.avgRating}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.reviewCount} {t.reviews}</p>
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
            <p className="text-sm text-gray-500">{t.profileViews}</p>
            <p className="text-xs text-gray-400 mt-1">{t.thisMonth}</p>
          </div>
        </div>

        {/* Commission Info */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">{t.commissionRate}</h3>
              <p className="text-green-100 mt-1">
                {t.youKeep}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-3xl font-bold">
                ${(stats.totalEarnings * 0.9).toFixed(2)}
              </p>
              <p className="text-green-100 text-sm">{t.yourEarnings}</p>
            </div>
          </div>
        </div>

        {/* Payment Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start">
            <CreditCard className="text-blue-600 mt-1 mr-3" size={24} />
            <div>
              <h4 className="font-semibold text-blue-900">{t.paymentInfo}</h4>
              <p className="text-blue-700 text-sm mt-1">{t.paymentInfoText}</p>
              {!user?.bankAccount && (
                <Link to="/bank-settings" className="text-blue-600 hover:underline text-sm font-medium mt-2 inline-block">
                  {t.setupBank} →
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{t.recentBookings}</h2>
                <Link to="/bookings" className="text-blue-600 hover:underline text-sm">
                  {t.viewAll} →
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
                        <p className="text-xs text-green-600">
                          ${(booking.amount * 0.9).toFixed(2)} {language === 'en' ? 'you receive' : 'vous recevez'}
                        </p>
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
              <h3 className="font-bold text-gray-900 mb-4">{t.quickActions}</h3>
              <div className="space-y-3">
                <Link
                  to="/my-services"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  {t.manageServices}
                </Link>
                <Link
                  to="/availability"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  {t.setAvailability}
                </Link>
                <Link
                  to="/profile"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  {t.editProfile}
                </Link>
                <Link
                  to="/bank-settings"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-medium"
                >
                  {t.bankSettings}
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">{t.proTip}</h3>
              <p className="text-sm text-blue-700">
                {t.proTipText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <ProfilePreviewModal />}
    </div>
  );
};

export default ProviderDashboard;
