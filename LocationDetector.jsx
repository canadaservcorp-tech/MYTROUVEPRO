// components/LocationDetector.jsx
// Component to detect and manage user location for myTROUVEpro

import { useState, useEffect } from 'react';
import { getUserLocation, isGeolocationAvailable } from '../utils/geolocation';

const LocationDetector = ({ onLocationDetected, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Check if geolocation is available on component mount
  useEffect(() => {
    if (!isGeolocationAvailable()) {
      onError?.('Geolocation is not supported by your browser');
    }
  }, [onError]);

  const detectLocation = async () => {
    setIsLoading(true);
    
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setHasPermission(true);
      onLocationDetected?.(location);
    } catch (error) {
      setHasPermission(false);
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-detector">
      {!userLocation && (
        <button
          onClick={detectLocation}
          disabled={isLoading}
          className="btn-location"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Détection en cours...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Utiliser ma position
            </>
          )}
        </button>
      )}
      
      {userLocation && (
        <div className="location-detected">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span>Position détectée</span>
        </div>
      )}

      {hasPermission === false && (
        <div className="location-error">
          <p>⚠️ Activer la localisation pour voir les fournisseurs près de vous</p>
        </div>
      )}
    </div>
  );
};

export default LocationDetector;
