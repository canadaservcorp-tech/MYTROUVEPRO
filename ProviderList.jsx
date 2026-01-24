// pages/ProviderList.jsx
// Main provider listing page with geolocation and distance sorting for myTROUVEpro

import { useState, useEffect } from 'react';
import LocationDetector from '../components/LocationDetector';
import ProviderCard from '../components/ProviderCard';
import { sortProvidersByDistance, filterByRadius } from '../utils/geolocation';

const ProviderList = ({ category }) => {
  const [providers, setProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, name
  const [radiusFilter, setRadiusFilter] = useState('all'); // all, 5, 10, 25, 50
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch providers from API
  useEffect(() => {
    fetchProviders();
  }, [category]);

  // Update filtered providers when location, sort, or radius changes
  useEffect(() => {
    if (providers.length > 0) {
      applyFiltersAndSort();
    }
  }, [providers, userLocation, sortBy, radiusFilter]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/providers?category=${category || 'all'}`);
      const data = await response.json();
      setProviders(data);
    } catch (err) {
      setError('Erreur lors du chargement des fournisseurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetected = (location) => {
    setUserLocation(location);
    setSortBy('distance'); // Auto-sort by distance when location detected
  };

  const handleLocationError = (errorMessage) => {
    setError(errorMessage);
  };

  const applyFiltersAndSort = () => {
    let result = [...providers];

    // Sort providers
    if (userLocation && sortBy === 'distance') {
      result = sortProvidersByDistance(result, userLocation);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply radius filter
    if (userLocation && radiusFilter !== 'all') {
      const maxDistance = parseInt(radiusFilter);
      result = filterByRadius(result, maxDistance);
    }

    setFilteredProviders(result);
  };

  return (
    <div className="provider-list-page">
      {/* Header */}
      <div className="page-header">
        <h1>Fournisseurs de services</h1>
        {category && <p className="category-name">Catégorie: {category}</p>}
      </div>

      {/* Location Detection */}
      <div className="location-section">
        <LocationDetector
          onLocationDetected={handleLocationDetected}
          onError={handleLocationError}
        />
      </div>

      {/* Filters and Sort */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Trier par:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            {userLocation && (
              <option value="distance">Distance (plus proche)</option>
            )}
            <option value="rating">Note (meilleur)</option>
            <option value="name">Nom (A-Z)</option>
          </select>
        </div>

        {userLocation && (
          <div className="filter-group">
            <label>Rayon:</label>
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
        )}

        <div className="results-count">
          {filteredProviders.length} fournisseur{filteredProviders.length !== 1 ? 's' : ''} trouvé{filteredProviders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des fournisseurs...</p>
        </div>
      )}

      {/* Provider Grid */}
      {!loading && filteredProviders.length > 0 && (
        <div className="providers-grid">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              showDistance={userLocation !== null}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredProviders.length === 0 && (
        <div className="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3>Aucun fournisseur trouvé</h3>
          <p>
            {radiusFilter !== 'all'
              ? 'Essayez d\'augmenter le rayon de recherche'
              : 'Aucun fournisseur disponible dans cette catégorie'}
          </p>
        </div>
      )}

      {/* Location Prompt for Better Results */}
      {!userLocation && !loading && filteredProviders.length > 0 && (
        <div className="location-prompt">
          <p>
            💡 <strong>Conseil:</strong> Activez votre localisation pour voir les fournisseurs les plus proches de vous!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderList;
