// utils/geolocation.js
// Geolocation utilities for myTROUVEpro

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`; // Show in meters if less than 1km
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Sort providers by distance from user location
 * @param {Array} providers - Array of provider objects
 * @param {object} userLocation - User's location {latitude, longitude}
 * @returns {Array} Sorted providers with distance added
 */
export const sortProvidersByDistance = (providers, userLocation) => {
  if (!userLocation) return providers;

  return providers
    .map(provider => {
      // Calculate distance if provider has location
      if (provider.latitude && provider.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          provider.latitude,
          provider.longitude
        );
        return {
          ...provider,
          distance,
          distanceText: formatDistance(distance),
        };
      }
      return {
        ...provider,
        distance: null,
        distanceText: 'Distance unavailable',
      };
    })
    .sort((a, b) => {
      // Sort by distance, put providers without location at the end
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
};

/**
 * Filter providers within a certain radius
 * @param {Array} providers - Array of provider objects with distance
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered providers
 */
export const filterByRadius = (providers, maxDistance) => {
  return providers.filter(provider => {
    if (provider.distance === null) return false;
    return provider.distance <= maxDistance;
  });
};

/**
 * Geocode address to coordinates (requires Google Maps API)
 * @param {string} address - Address to geocode
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const geocodeAddress = async (address) => {
  // This requires Google Maps Geocoding API key
  // Add your API key to environment variables: VITE_GOOGLE_MAPS_API_KEY
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: data.results[0].formatted_address,
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Check if location services are available
 * @returns {boolean}
 */
export const isGeolocationAvailable = () => {
  return 'geolocation' in navigator;
};

/**
 * Get Quebec postal code from coordinates (reverse geocode)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} Postal code
 */
export const getPostalCode = async (latitude, longitude) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Find postal code in address components
      for (const result of data.results) {
        for (const component of result.address_components) {
          if (component.types.includes('postal_code')) {
            return component.long_name;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};
