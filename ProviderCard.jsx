// components/ProviderCard.jsx
// Provider card with distance display for myTROUVEpro

import React from 'react';

const ProviderCard = ({ provider, showDistance = true }) => {
  return (
    <div className="provider-card">
      {/* Provider Image */}
      <div className="provider-image">
        {provider.image ? (
          <img src={provider.image} alt={provider.name} />
        ) : (
          <div className="provider-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
        
        {/* Distance Badge */}
        {showDistance && provider.distance !== null && provider.distance !== undefined && (
          <div className="distance-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span>{provider.distanceText || `${provider.distance.toFixed(1)} km`}</span>
          </div>
        )}

        {/* Verification Badge */}
        {provider.verified && (
          <div className="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Vérifié</span>
          </div>
        )}
      </div>

      {/* Provider Info */}
      <div className="provider-info">
        <h3 className="provider-name">{provider.name}</h3>
        
        {/* Rating */}
        {provider.rating && (
          <div className="provider-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(provider.rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="rating-count">
              {provider.rating.toFixed(1)} ({provider.reviewCount || 0} avis)
            </span>
          </div>
        )}

        {/* Services */}
        <div className="provider-services">
          <p>{provider.services?.slice(0, 3).join(', ') || provider.category}</p>
        </div>

        {/* Location */}
        <div className="provider-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{provider.city}, {provider.province || 'QC'}</span>
        </div>

        {/* Price Range */}
        {provider.priceRange && (
          <div className="provider-price">
            <span className="price-label">Prix:</span>
            <span className="price-value">{'$'.repeat(provider.priceRange)}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="provider-actions">
        <button className="btn-contact">
          Contacter
        </button>
        <button className="btn-view-profile">
          Voir profil
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
