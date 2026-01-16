import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Heart,
  Search,
  Clock,
  CheckCircle,
  MapPin,
  Star,
  Briefcase,
  X,
  Lock,
  Mail,
  Phone,
  CheckSquare,
  Square
} from 'lucide-react';

const SeekerDashboard = ({ language = 'en' }) => {
  const { user, becomeProvider } = useAuth();
  const [showBecomeProvider, setShowBecomeProvider] = useState(false);
  const [providerFormData, setProviderFormData] = useState({
    businessName: '',
    category: '',
    description: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const content = {
    en: {
      welcome: 'Welcome',
      findServices: 'Find the best local services near you',
      findServicesBtn: 'Find Services',
      whatHelp: 'What do you need help with?',
      upcomingBookings: 'Upcoming Bookings',
      viewAll: 'View all',
      noBookings: 'No upcoming bookings',
      findService: 'Find a service',
      favorites: 'Favorites',
      didYouKnow: 'Did you know?',
      didYouKnowText: 'You can save your favorite providers and get notified when they have special offers!',
      becomeProvider: 'Become a Provider',
      becomeProviderDesc: 'Start offering your services and earn money!',
      becomeProviderBtn: 'Become a Provider',
      freeToJoin: 'FREE to join',
      commissionInfo: 'Only 10% commission on bookings',
      confirmed: 'Confirmed',
      pending: 'Pending',
      businessName: 'Business Name',
      category: 'Service Category',
      selectCategory: 'Select a category',
      description: 'Description',
      descPlaceholder: 'Tell customers about your services...',
      termsText: 'I accept the',
      termsLink: 'Terms and Conditions',
      termsNote: 'Including 10% commission and 2-day payment hold policy',
      termsRequired: 'You must accept the Terms and Conditions to continue',
      submit: 'Start as Provider',
      cancel: 'Cancel',
      successRedirect: 'Converting your account...'
    },
    fr: {
      welcome: 'Bienvenue',
      findServices: 'Trouvez les meilleurs services locaux près de chez vous',
      findServicesBtn: 'Trouver des services',
      whatHelp: 'De quoi avez-vous besoin?',
      upcomingBookings: 'Réservations à venir',
      viewAll: 'Voir tout',
      noBookings: 'Aucune réservation à venir',
      findService: 'Trouver un service',
      favorites: 'Favoris',
      didYouKnow: 'Le saviez-vous?',
      didYouKnowText: 'Vous pouvez sauvegarder vos fournisseurs favoris et être notifié de leurs offres spéciales!',
      becomeProvider: 'Devenir Fournisseur',
      becomeProviderDesc: 'Commencez à offrir vos services et gagnez de l\'argent!',
      becomeProviderBtn: 'Devenir Fournisseur',
      freeToJoin: 'Inscription GRATUITE',
      commissionInfo: 'Seulement 10% de commission sur les réservations',
      confirmed: 'Confirmé',
      pending: 'En attente',
      businessName: 'Nom de l\'entreprise',
      category: 'Catégorie de service',
      selectCategory: 'Sélectionnez une catégorie',
      description: 'Description',
      descPlaceholder: 'Décrivez vos services aux clients...',
      termsText: 'J\'accepte les',
      termsLink: 'Termes et Conditions',
      termsNote: 'Y compris la commission de 10% et la politique de retenue de paiement de 2 jours',
      termsRequired: 'Vous devez accepter les Termes et Conditions pour continuer',
      submit: 'Commencer en tant que fournisseur',
      cancel: 'Annuler',
      successRedirect: 'Conversion de votre compte...'
    }
  };

  const t = content[language];

  const categories = [
    { id: 'healthcare', name: 'Healthcare', nameFr: 'Santé' },
    { id: 'home', name: 'Home Services', nameFr: 'Services à domicile' },
    { id: 'auto', name: 'Auto Services', nameFr: 'Services auto' },
    { id: 'beauty', name: 'Beauty & Wellness', nameFr: 'Beauté & Bien-être' },
    { id: 'education', name: 'Education', nameFr: 'Éducation' },
    { id: 'legal', name: 'Legal', nameFr: 'Juridique' },
    { id: 'tech', name: 'Tech & IT', nameFr: 'Tech & TI' },
    { id: 'repairs', name: 'Repairs', nameFr: 'Réparations' },
  ];

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
    { id: 1, name: 'Marie-Claire Dubois', category: 'Massage Therapist', rating: 4.9, image: '' },
    { id: 2, name: 'ProPlumb Solutions', category: 'Plumbing', rating: 4.8, image: '' },
    { id: 3, name: 'Clean & Shine', category: 'Cleaning', rating: 4.9, image: '' },
  ];

  const quickCategories = [
    { icon: '', name: 'Healthcare', nameFr: 'Santé' },
    { icon: '', name: 'Home', nameFr: 'Maison' },
    { icon: '', name: 'Auto', nameFr: 'Auto' },
    { icon: '', name: 'Beauty', nameFr: 'Beauté' },
    { icon: '', name: 'Education', nameFr: 'Éducation' },
    { icon: '', name: 'Legal', nameFr: 'Juridique' },
    { icon: '', name: 'Tech', nameFr: 'Tech' },
    { icon: '', name: 'Repairs', nameFr: 'Réparations' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center"><CheckCircle size={12} className="mr-1" /> {t.confirmed}</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center"><Clock size={12} className="mr-1" /> {t.pending}</span>;
      default:
        return null;
    }
  };

  const handleBecomeProvider = async (e) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError(t.termsRequired);
      return;
    }

    setLoading(true);

    const result = await becomeProvider({
      ...providerFormData,
      termsAccepted: true,
    });

    if (result.success) {
      // Redirect will happen automatically as user role changes
    } else {
      setError(result.error || 'Failed to convert account');
    }
    setLoading(false);
  };

  // Become Provider Modal
  const BecomeProviderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{t.becomeProvider}</h2>
          <button onClick={() => setShowBecomeProvider(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Free Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <p className="font-semibold text-green-800">{t.freeToJoin}</p>
                <p className="text-sm text-green-600">{t.commissionInfo}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleBecomeProvider} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.businessName}</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={providerFormData.businessName}
                  onChange={(e) => setProviderFormData({ ...providerFormData, businessName: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Business Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
              <select
                value={providerFormData.category}
                onChange={(e) => setProviderFormData({ ...providerFormData, category: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.selectCategory}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'en' ? cat.name : cat.nameFr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
              <textarea
                value={providerFormData.description}
                onChange={(e) => setProviderFormData({ ...providerFormData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t.descPlaceholder}
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="mt-0.5 text-gray-400 hover:text-blue-600"
              >
                {termsAccepted ? (
                  <CheckSquare size={24} className="text-blue-600" />
                ) : (
                  <Square size={24} />
                )}
              </button>
              <span className="text-sm text-gray-600">
                {t.termsText}{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.termsLink}
                </Link>
                <span className="block text-xs text-gray-500 mt-1">
                  {t.termsNote}
                </span>
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowBecomeProvider(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? t.successRedirect : t.submit}
              </button>
            </div>
          </form>
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
            <p className="text-gray-500 mt-1">{t.findServices}</p>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <Search size={20} className="mr-2" />
            {t.findServicesBtn}
          </Link>
        </div>

        {/* Become a Provider Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t.becomeProvider}</h3>
                <p className="text-green-100">{t.becomeProviderDesc}</p>
                <p className="text-sm text-green-200 mt-1">{t.freeToJoin} - {t.commissionInfo}</p>
              </div>
            </div>
            <button
              onClick={() => setShowBecomeProvider(true)}
              className="mt-4 md:mt-0 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              {t.becomeProviderBtn}
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">{t.whatHelp}</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { icon: '🏥', name: 'Healthcare', nameFr: 'Santé' },
              { icon: '🏠', name: 'Home', nameFr: 'Maison' },
              { icon: '🚗', name: 'Auto', nameFr: 'Auto' },
              { icon: '💇', name: 'Beauty', nameFr: 'Beauté' },
              { icon: '📚', name: 'Education', nameFr: 'Éducation' },
              { icon: '⚖️', name: 'Legal', nameFr: 'Juridique' },
              { icon: '💻', name: 'Tech', nameFr: 'Tech' },
              { icon: '🔧', name: 'Repairs', nameFr: 'Réparations' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/services/${cat.name.toLowerCase()}`}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs text-gray-600">{language === 'en' ? cat.name : cat.nameFr}</span>
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
                  <Calendar className="mr-2 text-blue-600" size={24} />
                  {t.upcomingBookings}
                </h2>
                <Link to="/my-bookings" className="text-blue-600 hover:underline text-sm">
                  {t.viewAll} →
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">{t.noBookings}</p>
                  <Link to="/services" className="text-blue-600 hover:underline mt-2 inline-block">
                    {t.findService} →
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
                  {t.favorites}
                </h3>
                <Link to="/favorites" className="text-blue-600 hover:underline text-sm">
                  {t.viewAll}
                </Link>
              </div>
              <div className="divide-y">
                {favoriteProviders.map((provider) => (
                  <Link
                    key={provider.id}
                    to={`/providers/${provider.id}`}
                    className="flex items-center p-4 hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      {provider.category === 'Massage Therapist' ? '💆‍♀️' :
                        provider.category === 'Plumbing' ? '🔧' : '🧹'}
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
              <h3 className="font-bold text-green-900 mb-2">{t.didYouKnow}</h3>
              <p className="text-sm text-green-700">
                {t.didYouKnowText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Become Provider Modal */}
      {showBecomeProvider && <BecomeProviderModal />}
    </div>
  );
};

export default SeekerDashboard;
