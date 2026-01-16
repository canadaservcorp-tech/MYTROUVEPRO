import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Shield, Clock, Navigation, SlidersHorizontal } from 'lucide-react';
import { getCategories, QUEBEC_PROFESSIONS } from '../data/professions';

const ServicesPage = ({ language }) => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('distance');
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const content = {
    en: {
      title: 'Browse Services',
      subtitle: 'Find the perfect provider for your needs - sorted by distance',
      searchPlaceholder: 'Search services...',
      filter: 'Filter',
      allCategories: 'All Categories',
      providers: 'providers',
      viewProfile: 'View Profile',
      verified: 'Verified',
      responseTime: 'Responds in',
      hours: 'hours',
      kmAway: 'km away',
      sortBy: 'Sort by',
      sortDistance: 'Nearest First',
      sortRating: 'Highest Rated',
      sortReviews: 'Most Reviews',
      noLocation: 'Enable location for distance sorting',
      medicalCategory: 'Medical Services',
      medicalDesc: 'Healthcare professionals that come to you',
    },
    fr: {
      title: 'Parcourir les Services',
      subtitle: 'Trouvez le fournisseur parfait - trie par distance',
      searchPlaceholder: 'Rechercher des services...',
      filter: 'Filtrer',
      allCategories: 'Toutes les Categories',
      providers: 'fournisseurs',
      viewProfile: 'Voir le Profil',
      verified: 'Verifie',
      responseTime: 'Repond en',
      hours: 'heures',
      kmAway: 'km',
      sortBy: 'Trier par',
      sortDistance: 'Plus Proche',
      sortRating: 'Mieux Notes',
      sortReviews: 'Plus d\'Avis',
      noLocation: 'Activez la localisation pour le tri par distance',
      medicalCategory: 'Services Medicaux',
      medicalDesc: 'Des professionnels de sante qui viennent a vous',
    }
  };

  const t = content[language];
  const categories = getCategories(language);
  const professionData = QUEBEC_PROFESSIONS[language];

  // Get user location on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Sample providers data with locations
  const allProviders = [
    {
      id: 1,
      name: 'ProPlumb Solutions',
      category: 'home',
      categoryName: language === 'en' ? 'Plumbing' : 'Plomberie',
      profession: language === 'en' ? 'Plumber' : 'Plombier',
      rating: 4.9,
      reviews: 127,
      location: { lat: 45.5617, lng: -73.7230 },
      address: 'Laval, QC',
      responseTime: 2,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      verified: true,
      description: language === 'en'
        ? 'Professional plumbing services for residential and commercial properties.'
        : 'Services de plomberie professionnels pour proprietes residentielles et commerciales.',
    },
    {
      id: 2,
      name: 'Elite Electric',
      category: 'home',
      categoryName: language === 'en' ? 'Electrical' : 'Electricite',
      profession: language === 'en' ? 'Electrician' : 'Electricien',
      rating: 4.8,
      reviews: 98,
      location: { lat: 45.5088, lng: -73.5878 },
      address: 'Montreal, QC',
      responseTime: 3,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      verified: true,
      description: language === 'en'
        ? 'Licensed electricians for all your electrical needs.'
        : 'Electriciens licencies pour tous vos besoins electriques.',
    },
    {
      id: 3,
      name: 'Dr. Home Care',
      category: 'medical',
      categoryName: language === 'en' ? 'Medical Services' : 'Services Medicaux',
      profession: language === 'en' ? 'Home Nurse' : 'Infirmier(ere) a Domicile',
      rating: 4.9,
      reviews: 215,
      location: { lat: 45.5300, lng: -73.6200 },
      address: 'Laval, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      verified: true,
      description: language === 'en'
        ? 'Professional nursing care at home.'
        : 'Soins infirmiers professionnels a domicile.',
    },
    {
      id: 4,
      name: 'Reno Masters',
      category: 'home',
      categoryName: language === 'en' ? 'Renovation' : 'Renovation',
      profession: language === 'en' ? 'General Contractor' : 'Entrepreneur General',
      rating: 4.7,
      reviews: 89,
      location: { lat: 45.5500, lng: -73.6500 },
      address: 'Laval, QC',
      responseTime: 4,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      verified: true,
      description: language === 'en'
        ? 'Complete home renovation and remodeling services.'
        : 'Services complets de renovation et remodelage de maison.',
    },
    {
      id: 5,
      name: 'Green Thumb Landscaping',
      category: 'landscaping',
      categoryName: language === 'en' ? 'Landscaping' : 'Amenagement',
      profession: language === 'en' ? 'Landscaper' : 'Paysagiste',
      rating: 4.8,
      reviews: 156,
      location: { lat: 45.5800, lng: -73.7500 },
      address: 'Laval, QC',
      responseTime: 2,
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
      verified: true,
      description: language === 'en'
        ? 'Beautiful landscape design and maintenance.'
        : 'Beau design paysager et entretien.',
    },
    {
      id: 6,
      name: 'Swift Movers',
      category: 'moving',
      categoryName: language === 'en' ? 'Moving' : 'Demenagement',
      profession: language === 'en' ? 'Local Mover' : 'Demenageur Local',
      rating: 4.6,
      reviews: 72,
      location: { lat: 45.5000, lng: -73.5700 },
      address: 'Montreal, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
      verified: true,
      description: language === 'en'
        ? 'Reliable moving services for local and long-distance moves.'
        : 'Services de demenagement fiables pour demenagements locaux et longue distance.',
    },
    {
      id: 7,
      name: 'Clean & Shine',
      category: 'cleaning',
      categoryName: language === 'en' ? 'Cleaning' : 'Nettoyage',
      profession: language === 'en' ? 'House Cleaner' : 'Nettoyeur Residentiel',
      rating: 4.9,
      reviews: 215,
      location: { lat: 45.5200, lng: -73.6000 },
      address: 'Montreal, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      verified: true,
      description: language === 'en'
        ? 'Professional cleaning services for homes and offices.'
        : 'Services de nettoyage professionnels pour maisons et bureaux.',
    },
    {
      id: 8,
      name: 'Physio Plus',
      category: 'medical',
      categoryName: language === 'en' ? 'Medical Services' : 'Services Medicaux',
      profession: language === 'en' ? 'Physiotherapist' : 'Physiotherapeute',
      rating: 4.8,
      reviews: 134,
      location: { lat: 45.5400, lng: -73.6300 },
      address: 'Laval, QC',
      responseTime: 2,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      verified: true,
      description: language === 'en'
        ? 'In-home physiotherapy and rehabilitation services.'
        : 'Services de physiotherapie et readaptation a domicile.',
    },
  ].map(provider => ({
    ...provider,
    distance: userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, provider.location.lat, provider.location.lng)
      : null
  }));

  // Filter providers
  const filteredProviders = allProviders
    .filter(provider => {
      const matchesCategory = !category || category === 'all' || provider.category === category;
      const matchesSearch = searchTerm === '' ||
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.profession.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'distance' && userLocation) {
        return (a.distance || 999) - (b.distance || 999);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return b.reviews - a.reviews;
      }
      return 0;
    });

  // Get current category info
  const currentCategory = category && professionData[category]
    ? { ...professionData[category], id: category }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {currentCategory ? currentCategory.label : t.title}
          </h1>
          <p className="text-blue-200">{t.subtitle}</p>

          {/* Distance Sort Indicator */}
          {sortBy === 'distance' && (
            <div className="mt-4 inline-flex items-center bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
              <Navigation size={14} className="mr-1" />
              {userLocation ? t.sortDistance : t.noLocation}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">{t.allCategories}</h3>
              <nav className="space-y-1">
                <Link
                  to="/services"
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    !category ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">📋</span>
                  {t.allCategories}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/services/${cat.id}`}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      category === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{cat.icon}</span>
                    <span className="flex-1">{cat.label}</span>
                    {cat.id === 'medical' && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {language === 'en' ? 'New' : 'Nouveau'}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search & Sort Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="distance">{t.sortDistance}</option>
                    <option value="rating">{t.sortRating}</option>
                    <option value="reviews">{t.sortReviews}</option>
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <SlidersHorizontal size={20} className="mr-2" />
                    {t.filter}
                  </button>
                </div>
              </div>
            </div>

            {/* Medical Services Banner (when viewing medical category) */}
            {category === 'medical' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🏥</span>
                  <div>
                    <h3 className="font-semibold text-green-900">{t.medicalCategory}</h3>
                    <p className="text-green-700 text-sm">{t.medicalDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <p className="text-gray-600 mb-4">
              {filteredProviders.length} {t.providers}
              {sortBy === 'distance' && userLocation && (
                <span className="text-green-600 ml-2">
                  - {language === 'en' ? 'sorted by distance' : 'trie par distance'}
                </span>
              )}
            </p>

            {/* Provider Cards */}
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 flex-shrink-0 relative">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Distance Badge */}
                      {provider.distance !== null && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Navigation size={12} className="mr-1" />
                          {provider.distance.toFixed(1)} {t.kmAway}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-blue-600">{provider.profession}</p>
                          <p className="text-gray-500 text-sm">{provider.categoryName}</p>
                        </div>
                        {provider.verified && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                            <Shield size={14} className="mr-1" /> {t.verified}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{provider.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                          <span className="font-medium text-gray-900">{provider.rating}</span>
                          <span className="ml-1">({provider.reviews})</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {provider.address}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {t.responseTime} {provider.responseTime} {t.hours}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/providers/${provider.id}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          {t.viewProfile}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProviders.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'No providers found' : 'Aucun fournisseur trouve'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'Try adjusting your search or browse all categories'
                    : 'Essayez d\'ajuster votre recherche ou parcourez toutes les categories'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
