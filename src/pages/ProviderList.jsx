// pages/ProviderList.jsx
// Main provider listing page with geolocation and distance sorting for myTROUVEpro

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import LocationDetector from '../components/LocationDetector';
import ProviderCard from '../components/ProviderCard';
import { filterByRadius, sortProvidersByDistance } from '../utils/geolocation';

const ProviderList = ({ language = 'en' }) => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // distance, rating, reviews, name
  const [radiusFilter, setRadiusFilter] = useState('all'); // all, 5, 10, 25, 50
  const [error, setError] = useState('');

  const isEnglish = language === 'en';

  const content = {
    en: {
      title: 'All Providers',
      subtitle: 'Browse our network of verified service providers',
      searchPlaceholder: 'Search providers...',
      sortBy: 'Sort by',
      distance: 'Closest first',
      rating: 'Highest Rated',
      reviews: 'Most Reviews',
      name: 'Name (A–Z)',
      radius: 'Radius',
      all: 'All',
      providers: 'providers',
      results: 'providers found',
      noResults: 'No providers found',
      noResultsHint: 'Try increasing the search radius',
      noResultsDefault: 'Try adjusting your search terms.',
      locationTip: 'Tip: Enable location to see providers nearest to you.',
    },
    fr: {
      title: 'Tous les Fournisseurs',
      subtitle: 'Parcourez notre réseau de fournisseurs vérifiés',
      searchPlaceholder: 'Rechercher des fournisseurs...',
      sortBy: 'Trier par',
      distance: 'Plus proches',
      rating: 'Mieux notés',
      reviews: 'Plus d\'avis',
      name: 'Nom (A–Z)',
      radius: 'Rayon',
      all: 'Tous',
      providers: 'fournisseurs',
      results: 'fournisseurs trouvés',
      noResults: 'Aucun fournisseur trouvé',
      noResultsHint: 'Essayez d\'augmenter le rayon de recherche',
      noResultsDefault: 'Essayez d\'ajuster votre recherche.',
      locationTip: 'Conseil : activez la localisation pour voir les plus proches.',
    },
  };

  const t = content[language] || content.en;

  const providers = useMemo(() => ([
    {
      id: 1,
      name: 'ProPlumb Solutions',
      categoryId: 'plumbing',
      category: isEnglish ? 'Plumbing' : 'Plomberie',
      rating: 4.9,
      reviews: 127,
      location: 'Laval, QC',
      city: 'Laval',
      province: 'QC',
      latitude: 45.5704,
      longitude: -73.7243,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      verified: true,
    },
    {
      id: 2,
      name: 'Elite Electric',
      categoryId: 'electrical',
      category: isEnglish ? 'Electrical' : 'Électricité',
      rating: 4.8,
      reviews: 98,
      location: 'Laval, QC',
      city: 'Laval',
      province: 'QC',
      latitude: 45.5848,
      longitude: -73.7086,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      verified: true,
    },
    {
      id: 3,
      name: 'Clean & Shine',
      categoryId: 'cleaning',
      category: isEnglish ? 'Cleaning' : 'Nettoyage',
      rating: 4.9,
      reviews: 215,
      location: 'Montreal, QC',
      city: 'Montreal',
      province: 'QC',
      latitude: 45.5017,
      longitude: -73.5673,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      verified: true,
    },
    {
      id: 4,
      name: 'Reno Masters',
      categoryId: 'renovation',
      category: isEnglish ? 'Renovation' : 'Rénovation',
      rating: 4.7,
      reviews: 89,
      location: 'Laval, QC',
      city: 'Laval',
      province: 'QC',
      latitude: 45.5609,
      longitude: -73.7421,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      verified: true,
    },
    {
      id: 5,
      name: 'Green Thumb',
      categoryId: 'landscaping',
      category: isEnglish ? 'Landscaping' : 'Aménagement',
      rating: 4.8,
      reviews: 156,
      location: 'Laval, QC',
      city: 'Laval',
      province: 'QC',
      latitude: 45.5992,
      longitude: -73.7183,
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
      verified: true,
    },
    {
      id: 6,
      name: 'Swift Movers',
      categoryId: 'moving',
      category: isEnglish ? 'Moving' : 'Déménagement',
      rating: 4.6,
      reviews: 72,
      location: 'Montreal, QC',
      city: 'Montreal',
      province: 'QC',
      latitude: 45.5128,
      longitude: -73.5825,
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
      verified: true,
    },
    {
      id: 7,
      name: 'AutoCare Plus',
      categoryId: 'auto',
      category: isEnglish ? 'Auto Services' : 'Services Auto',
      rating: 4.7,
      reviews: 134,
      location: 'Laval, QC',
      city: 'Laval',
      province: 'QC',
      latitude: 45.5565,
      longitude: -73.7368,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      verified: true,
    },
    {
      id: 8,
      name: 'TechFix Pro',
      categoryId: 'tech',
      category: isEnglish ? 'Tech Support' : 'Support Tech',
      rating: 4.8,
      reviews: 67,
      location: 'Montreal, QC',
      city: 'Montreal',
      province: 'QC',
      latitude: 45.5274,
      longitude: -73.5891,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400',
      verified: true,
    },
  ]), [isEnglish]);

  const filteredProviders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let result = providers.filter((provider) => {
      const matchesCategory = !category || category === 'all' || provider.categoryId === category;
      if (!normalizedSearch) {
        return matchesCategory;
      }
      const haystack = [
        provider.name,
        provider.category,
        provider.location,
        provider.city,
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesCategory && haystack.includes(normalizedSearch);
    });

    if (userLocation) {
      result = sortProvidersByDistance(result, userLocation);
    }

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
      result = [...result].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (userLocation && radiusFilter !== 'all') {
      const maxDistance = Number(radiusFilter);
      result = filterByRadius(result, maxDistance);
    }

    return result;
  }, [providers, searchTerm, category, userLocation, sortBy, radiusFilter]);

  const handleLocationDetected = (location) => {
    setUserLocation(location);
    setSortBy('distance');
    setError('');
  };

  const handleLocationError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-blue-200">{t.subtitle}</p>
        </div>
      </div>

      <div className="provider-list-page">
        <div className="location-section">
          <LocationDetector
            onLocationDetected={handleLocationDetected}
            onError={handleLocationError}
            language={language}
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>{t.sortBy}</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="filter-select"
            >
              {userLocation && <option value="distance">{t.distance}</option>}
              <option value="rating">{t.rating}</option>
              <option value="reviews">{t.reviews}</option>
              <option value="name">{t.name}</option>
            </select>
          </div>
          {userLocation && (
            <div className="filter-group">
              <label>{t.radius}</label>
              <select
                value={radiusFilter}
                onChange={(event) => setRadiusFilter(event.target.value)}
                className="filter-select"
              >
                <option value="all">{t.all}</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
          )}
          <div className="results-count">
            {filteredProviders.length} {t.results}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {filteredProviders.length > 0 ? (
          <div className="providers-grid">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                showDistance={Boolean(userLocation)}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>{t.noResults}</h3>
            <p>{userLocation && radiusFilter !== 'all' ? t.noResultsHint : t.noResultsDefault}</p>
          </div>
        )}

        {!userLocation && filteredProviders.length > 0 && (
          <div className="location-prompt">
            <p>💡 <strong>{t.locationTip}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderList;
