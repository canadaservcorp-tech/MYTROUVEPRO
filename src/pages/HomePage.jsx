import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Shield, Clock, ThumbsUp, Navigation, AlertCircle } from 'lucide-react';
import { getCategories } from '../data/professions';

const HomePage = ({ language }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const content = {
    en: {
      heroTitle: 'Find Trusted Service Providers',
      heroHighlight: 'Near You',
      heroSubtitle: 'Connect with verified local professionals sorted by distance from your location',
      searchPlaceholder: 'What service are you looking for?',
      locationPlaceholder: 'Enter your location',
      useMyLocation: 'Use my location',
      searchButton: 'Search',
      locating: 'Locating...',
      locationFound: 'Location found!',
      locationError: 'Could not get location',

      distanceFeature: 'Nearest First',
      distanceFeatureDesc: 'Service providers are always sorted by distance - see the closest ones first',

      categoriesTitle: 'Popular Services',
      categoriesSubtitle: 'Browse by category - Results sorted by distance from you',

      whyTitle: 'Why Choose myTROUVEpro?',
      whyVerified: 'Verified Providers',
      whyVerifiedDesc: 'All service providers are verified and reviewed',
      whyFast: 'Quick Response',
      whyFastDesc: 'Get quotes within hours, not days',
      whyTrust: 'Trusted Reviews',
      whyTrustDesc: 'Real reviews from real customers',
      whyDistance: 'Nearest First',
      whyDistanceDesc: 'Always see providers closest to you first',

      featuredTitle: 'Featured Providers Near You',
      featuredSubtitle: 'Top-rated professionals in your area',
      viewAll: 'View All',
      kmAway: 'km away',

      ctaTitle: 'Are You a Service Provider?',
      ctaSubtitle: 'Join our network and grow your business - offer up to 3 services!',
      ctaButton: 'Register Now',

      medicalTitle: 'Medical Services',
      medicalSubtitle: 'Healthcare professionals that come to you',
    },
    fr: {
      heroTitle: 'Trouvez des Fournisseurs de Services',
      heroHighlight: 'Pres de Vous',
      heroSubtitle: 'Connectez-vous avec des professionnels locaux verifies tries par distance',
      searchPlaceholder: 'Quel service cherchez-vous?',
      locationPlaceholder: 'Entrez votre emplacement',
      useMyLocation: 'Utiliser ma position',
      searchButton: 'Rechercher',
      locating: 'Localisation...',
      locationFound: 'Position trouvee!',
      locationError: 'Impossible de localiser',

      distanceFeature: 'Plus Proche d\'Abord',
      distanceFeatureDesc: 'Les fournisseurs sont toujours tries par distance - voyez les plus proches en premier',

      categoriesTitle: 'Services Populaires',
      categoriesSubtitle: 'Parcourir par categorie - Resultats tries par distance',

      whyTitle: 'Pourquoi Choisir myTROUVEpro?',
      whyVerified: 'Fournisseurs Verifies',
      whyVerifiedDesc: 'Tous les fournisseurs sont verifies et evalues',
      whyFast: 'Reponse Rapide',
      whyFastDesc: 'Obtenez des devis en quelques heures',
      whyTrust: 'Avis de Confiance',
      whyTrustDesc: 'De vrais avis de vrais clients',
      whyDistance: 'Plus Proche d\'Abord',
      whyDistanceDesc: 'Voyez toujours les fournisseurs les plus proches en premier',

      featuredTitle: 'Fournisseurs en Vedette Pres de Vous',
      featuredSubtitle: 'Professionnels les mieux notes de votre region',
      viewAll: 'Voir Tout',
      kmAway: 'km',

      ctaTitle: 'Etes-vous un Fournisseur de Services?',
      ctaSubtitle: 'Rejoignez notre reseau - offrez jusqu\'a 3 services!',
      ctaButton: 'Inscrivez-vous',

      medicalTitle: 'Services Medicaux',
      medicalSubtitle: 'Des professionnels de sante qui viennent a vous',
    }
  };

  const t = content[language];

  // Get user location on mount
  useEffect(() => {
    // Check if we have stored location
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    }
  }, []);

  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(t.locationError);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
        setLocationQuery('');
        setIsLocating(false);
      },
      (error) => {
        setLocationError(t.locationError);
        setIsLocating(false);
      }
    );
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const categories = getCategories(language);

  // Sample featured providers with locations
  const featuredProviders = [
    {
      id: 1,
      name: 'ProPlumb Solutions',
      category: language === 'en' ? 'Plumbing' : 'Plomberie',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      verified: true,
      location: { lat: 45.5617, lng: -73.7230 }, // Laval
      address: 'Laval, QC'
    },
    {
      id: 2,
      name: 'Elite Electric',
      category: language === 'en' ? 'Electrical' : 'Electricite',
      rating: 4.8,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      verified: true,
      location: { lat: 45.5088, lng: -73.5878 }, // Montreal
      address: 'Montreal, QC'
    },
    {
      id: 3,
      name: 'Dr. Home Care',
      category: language === 'en' ? 'Medical Services' : 'Services Medicaux',
      rating: 4.9,
      reviews: 215,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      verified: true,
      location: { lat: 45.5300, lng: -73.6200 },
      address: 'Laval, QC'
    },
  ].map(provider => ({
    ...provider,
    distance: userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, provider.location.lat, provider.location.lng)
      : null
  })).sort((a, b) => (a.distance || 999) - (b.distance || 999));

  // Medical services highlight
  const medicalServices = [
    { icon: '👩‍⚕️', name: language === 'en' ? 'Home Nurse' : 'Infirmier(ere) a Domicile' },
    { icon: '💆', name: language === 'en' ? 'Physiotherapist' : 'Physiotherapeute' },
    { icon: '🧠', name: language === 'en' ? 'Mental Health' : 'Sante Mentale' },
    { icon: '👴', name: language === 'en' ? 'Senior Care' : 'Soins Aines' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t.heroTitle}
            <br />
            <span className="text-green-400">{t.heroHighlight}</span>
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Distance Feature Banner */}
          <div className="inline-flex items-center bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-6">
            <Navigation size={18} className="mr-2" />
            <span className="font-medium">{t.distanceFeature}:</span>
            <span className="ml-1">{t.distanceFeatureDesc}</span>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-3 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                />
              </div>
              <div className="relative lg:w-56">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.locationPlaceholder}
                  value={userLocation ? (language === 'en' ? 'My Location' : 'Ma Position') : locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-4 rounded-lg font-medium transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  <Navigation size={18} className={`mr-1 ${isLocating ? 'animate-pulse' : ''}`} />
                  {isLocating ? t.locating : t.useMyLocation}
                </button>
                <Link
                  to={`/services?q=${encodeURIComponent(searchQuery)}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-center"
                >
                  {t.searchButton}
                </Link>
              </div>
            </div>
            {userLocation && (
              <div className="mt-2 text-left text-sm text-green-600 flex items-center">
                <Navigation size={14} className="mr-1" />
                {t.locationFound}
              </div>
            )}
            {locationError && (
              <div className="mt-2 text-left text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {locationError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Medical Services Highlight */}
      <section className="py-8 bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🏥</span>
                {t.medicalTitle}
              </h3>
              <p className="text-gray-600">{t.medicalSubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {medicalServices.map((service, idx) => (
                <Link
                  key={idx}
                  to="/services/medical"
                  className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="mr-2">{service.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.categoriesTitle}</h2>
            <p className="text-gray-600">{t.categoriesSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                to={`/services/${category.id}`}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-all group"
              >
                <span className="text-3xl block mb-2">{category.icon}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">{category.label}</h3>
                <p className="text-xs text-gray-500">{category.count} {language === 'en' ? 'services' : 'services'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.whyTitle}</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.whyVerified}</h3>
              <p className="text-gray-600 text-sm">{t.whyVerifiedDesc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-green-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.whyFast}</h3>
              <p className="text-gray-600 text-sm">{t.whyFastDesc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="text-yellow-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.whyTrust}</h3>
              <p className="text-gray-600 text-sm">{t.whyTrustDesc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-green-200">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="text-green-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.whyDistance}</h3>
              <p className="text-gray-600 text-sm">{t.whyDistanceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t.featuredTitle}</h2>
              <p className="text-gray-600">{t.featuredSubtitle}</p>
            </div>
            <Link to="/providers" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              {t.viewAll} <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <div key={provider.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  {provider.verified && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Shield size={12} className="mr-1" /> {language === 'en' ? 'Verified' : 'Verifie'}
                    </span>
                  )}
                  {provider.distance !== null && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <MapPin size={12} className="mr-1" /> {provider.distance.toFixed(1)} {t.kmAway}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
                  <p className="text-gray-500 text-sm">{provider.category}</p>
                  <div className="flex items-center mt-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1 font-medium">{provider.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({provider.reviews} {language === 'en' ? 'reviews' : 'avis'})</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    {provider.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-xl text-green-100 mb-8">{t.ctaSubtitle}</p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
