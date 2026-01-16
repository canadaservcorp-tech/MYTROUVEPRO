import React from 'react';
import { Lock } from 'lucide-react';

// Component to display provider images with watermark
const ProtectedImage = ({
  src,
  alt,
  className = '',
  showWatermark = true,
  isBlurred = false
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isBlurred ? 'blur-md' : ''}`}
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Watermark overlay */}
      {showWatermark && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
          <span
            className="text-white/30 text-lg font-bold transform rotate-[-25deg] select-none"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '2px'
            }}
          >
            myTROUVEpro
          </span>
        </div>
      )}

      {/* Blur overlay for blocked images */}
      {isBlurred && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <Lock className="mx-auto mb-2" size={32} />
            <p className="text-sm font-medium">Image blocked</p>
            <p className="text-xs opacity-75">Contains contact info</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Component to display provider contact info (hidden until booking paid)
const ProtectedContactInfo = ({
  phone,
  email,
  isBookingPaid = false,
  language = 'en'
}) => {
  const content = {
    en: {
      contactHidden: 'Contact info available after booking',
      phone: 'Phone',
      email: 'Email',
      bookToReveal: 'Complete your booking to reveal contact information'
    },
    fr: {
      contactHidden: 'Coordonnées disponibles après réservation',
      phone: 'Téléphone',
      email: 'Courriel',
      bookToReveal: 'Complétez votre réservation pour révéler les coordonnées'
    }
  };

  const t = content[language];

  if (!isBookingPaid) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <Lock className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-gray-600 font-medium text-sm">{t.contactHidden}</p>
        <p className="text-gray-400 text-xs mt-1">{t.bookToReveal}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {phone && (
        <div className="flex items-center text-gray-700">
          <span className="font-medium w-20">{t.phone}:</span>
          <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
        </div>
      )}
      {email && (
        <div className="flex items-center text-gray-700">
          <span className="font-medium w-20">{t.email}:</span>
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
        </div>
      )}
    </div>
  );
};

// Provider card component with protected info
const ProviderCard = ({
  provider,
  language = 'en',
  showContactInfo = false,
  isBookingPaid = false
}) => {
  const content = {
    en: {
      verified: 'Verified',
      reviews: 'reviews',
      viewProfile: 'View Profile',
      contactAfterBooking: 'Contact info available after booking'
    },
    fr: {
      verified: 'Vérifié',
      reviews: 'avis',
      viewProfile: 'Voir le profil',
      contactAfterBooking: 'Coordonnées disponibles après réservation'
    }
  };

  const t = content[language];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <ProtectedImage
        src={provider.image}
        alt={provider.name}
        className="h-48"
        showWatermark={true}
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
          {provider.verified && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              {t.verified}
            </span>
          )}
        </div>
        <p className="text-blue-600 text-sm">{provider.category}</p>

        {provider.rating && (
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-medium">{provider.rating}</span>
            <span className="text-gray-400 ml-1">({provider.reviews} {t.reviews})</span>
          </div>
        )}

        {showContactInfo && (
          <div className="mt-3 pt-3 border-t">
            <ProtectedContactInfo
              phone={provider.phone}
              email={provider.email}
              isBookingPaid={isBookingPaid}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { ProtectedImage, ProtectedContactInfo, ProviderCard };
