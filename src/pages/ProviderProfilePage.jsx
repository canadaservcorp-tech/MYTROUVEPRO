import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Shield, Clock, Phone, Mail, Lock, Calendar, ChevronRight, MessageCircle, Navigation } from 'lucide-react';

const ProviderProfilePage = ({ language }) => {
  const { id } = useParams();
  const [userLocation, setUserLocation] = useState(null);

  // Sample provider data - in production, this would come from API
  const providers = {
    '1': {
      id: 1,
      name: 'ProPlumb Solutions',
      owner: 'Jean-Pierre M.',
      category: language === 'en' ? 'Plumbing' : 'Plomberie',
      services: [
        { name: language === 'en' ? 'Plumbing' : 'Plomberie', price: 75, description: language === 'en' ? 'Professional plumbing services' : 'Services de plomberie professionnels' },
        { name: language === 'en' ? 'Drain Cleaning' : 'Nettoyage de drains', price: 120, description: language === 'en' ? 'Complete drain cleaning' : 'Nettoyage complet des drains' },
      ],
      rating: 4.9,
      reviews: 127,
      reviewsList: [
        { id: 1, author: 'Marie L.', rating: 5, text: language === 'en' ? 'Excellent service! Very professional.' : 'Excellent service! Tres professionnel.', date: '2025-12-15' },
        { id: 2, author: 'Robert T.', rating: 5, text: language === 'en' ? 'Quick response and fair pricing.' : 'Reponse rapide et prix juste.', date: '2025-12-10' },
      ],
      location: { lat: 45.5617, lng: -73.7230 },
      address: 'Laval, QC',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
      portfolioImages: [
        'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
      ],
      verified: true,
      responseTime: 2,
      experience: '10+',
      bio: language === 'en'
        ? 'Licensed plumber with over 10 years of experience serving the Laval and Montreal areas. Specializing in residential and commercial plumbing services.'
        : 'Plombier licence avec plus de 10 ans d\'experience desservant les regions de Laval et Montreal. Specialise dans les services de plomberie residentiels et commerciaux.',
      // Contact info - protected until booking is paid
      phone: '+1 (438) 555-0123',
      email: 'contact@proplumb.ca',
      fullAddress: '123 Rue Principale, Laval, QC H7V 1A1',
    },
    '2': {
      id: 2,
      name: 'Elite Electric',
      owner: 'Marc B.',
      category: language === 'en' ? 'Electrical' : 'Electricite',
      services: [
        { name: language === 'en' ? 'Electrical Installation' : 'Installation Electrique', price: 85, description: language === 'en' ? 'Professional electrical work' : 'Travaux electriques professionnels' },
      ],
      rating: 4.8,
      reviews: 98,
      reviewsList: [],
      location: { lat: 45.5088, lng: -73.5878 },
      address: 'Montreal, QC',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600',
      portfolioImages: [],
      verified: true,
      responseTime: 3,
      experience: '8',
      bio: language === 'en' ? 'Licensed electrician serving Montreal.' : 'Electricien licence desservant Montreal.',
      phone: '+1 (514) 555-0456',
      email: 'info@eliteelectric.ca',
      fullAddress: '456 Ave Mont-Royal, Montreal, QC H2J 1W7',
    },
    '3': {
      id: 3,
      name: 'Dr. Home Care',
      owner: 'Sophie D.',
      category: language === 'en' ? 'Medical Services' : 'Services Medicaux',
      services: [
        { name: language === 'en' ? 'Home Nursing' : 'Soins Infirmiers a Domicile', price: 95, description: language === 'en' ? 'Professional nursing care at home' : 'Soins infirmiers professionnels a domicile' },
        { name: language === 'en' ? 'Physiotherapy' : 'Physiotherapie', price: 110, description: language === 'en' ? 'In-home physiotherapy sessions' : 'Seances de physiotherapie a domicile' },
        { name: language === 'en' ? 'Senior Care' : 'Soins aux Aines', price: 75, description: language === 'en' ? 'Companionship and care for seniors' : 'Accompagnement et soins pour les aines' },
      ],
      rating: 4.9,
      reviews: 215,
      reviewsList: [],
      location: { lat: 45.5300, lng: -73.6200 },
      address: 'Laval, QC',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
      portfolioImages: [],
      verified: true,
      responseTime: 1,
      experience: '15+',
      bio: language === 'en' ? 'Professional healthcare team providing in-home medical services.' : 'Equipe de soins de sante professionnelle offrant des services medicaux a domicile.',
      phone: '+1 (438) 555-0789',
      email: 'care@drhomecare.ca',
      fullAddress: '789 Boul. des Laurentides, Laval, QC H7G 2T1',
    },
  };

  const provider = providers[id] || providers['1'];

  const content = {
    en: {
      verified: 'Verified Provider',
      responseTime: 'Responds in',
      hours: 'hours',
      experience: 'years experience',
      services: 'Services Offered',
      startingAt: 'Starting at',
      perHour: '/hr',
      about: 'About',
      reviews: 'Reviews',
      portfolio: 'Portfolio',
      location: 'Service Area',
      bookNow: 'Book Now',
      contactLocked: 'Contact Information Protected',
      contactLockedDesc: 'Phone number, email, and exact address will be revealed after you complete a paid booking. This protects both you and the service provider.',
      bookToUnlock: 'Book to Unlock Contact Details',
      kmAway: 'km away',
      writeReview: 'Write a Review',
      noReviews: 'No reviews yet. Be the first to leave a review!',
    },
    fr: {
      verified: 'Fournisseur Verifie',
      responseTime: 'Repond en',
      hours: 'heures',
      experience: 'ans d\'experience',
      services: 'Services Offerts',
      startingAt: 'A partir de',
      perHour: '/h',
      about: 'A Propos',
      reviews: 'Avis',
      portfolio: 'Portfolio',
      location: 'Zone de Service',
      bookNow: 'Reserver',
      contactLocked: 'Informations de Contact Protegees',
      contactLockedDesc: 'Le numero de telephone, le courriel et l\'adresse exacte seront reveles apres que vous ayez complete une reservation payee. Cela protege vous et le fournisseur de services.',
      bookToUnlock: 'Reservez pour Debloquer les Contacts',
      kmAway: 'km',
      writeReview: 'Ecrire un Avis',
      noReviews: 'Pas encore d\'avis. Soyez le premier a laisser un avis!',
    }
  };

  const t = content[language];

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    }
  }, []);

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

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, provider.location.lat, provider.location.lng)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="h-64 md:h-80 bg-gray-200 relative">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {provider.verified && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Shield size={14} className="mr-1" /> {t.verified}
            </span>
          )}
          {distance !== null && (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Navigation size={14} className="mr-1" /> {distance.toFixed(1)} {t.kmAway}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{provider.name}</h1>
                  <p className="text-blue-600 font-medium">{provider.category}</p>
                  <p className="text-gray-500 text-sm mt-1">{language === 'en' ? 'By' : 'Par'} {provider.owner}</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <Star className="text-yellow-400 fill-yellow-400" size={24} />
                  <span className="ml-1 text-2xl font-bold">{provider.rating}</span>
                  <span className="text-gray-500 ml-1">({provider.reviews} {language === 'en' ? 'reviews' : 'avis'})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{t.responseTime} {provider.responseTime} {t.hours}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{provider.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield size={18} className="mr-2" />
                  <span>{provider.experience} {t.experience}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.about}</h2>
              <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.services}</h2>
              <div className="space-y-4">
                {provider.services.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-gray-500 text-sm">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{t.startingAt}</p>
                      <p className="text-lg font-bold text-green-600">${service.price}{t.perHour}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Section */}
            {provider.portfolioImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.portfolio}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.portfolioImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t.reviews} ({provider.reviews})</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  {t.writeReview}
                </button>
              </div>

              {provider.reviewsList.length > 0 ? (
                <div className="space-y-4">
                  {provider.reviewsList.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                      <p className="text-gray-400 text-xs mt-1">{review.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">{t.noReviews}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.bookNow}</h3>

              {/* Services Quick Select */}
              <div className="space-y-2 mb-4">
                {provider.services.map((service, idx) => (
                  <Link
                    key={idx}
                    to={`/booking/${provider.id}?service=${encodeURIComponent(service.name)}&price=${service.price}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-blue-700">{service.name}</span>
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold mr-2">${service.price}</span>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to={`/booking/${provider.id}`}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Calendar size={20} className="mr-2" />
                {t.bookNow}
              </Link>

              {/* Contact Protection Notice */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Lock className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">{t.contactLocked}</h4>
                    <p className="text-blue-700 text-xs mt-1">{t.contactLockedDesc}</p>
                  </div>
                </div>

                {/* Masked Contact Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Phone size={16} className="mr-2" />
                    <span className="blur-sm select-none">+1 (438) ***-****</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Mail size={16} className="mr-2" />
                    <span className="blur-sm select-none">c****@*****.ca</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    <span className="blur-sm select-none">*** Rue ***, Laval, QC</span>
                  </div>
                </div>

                <Link
                  to={`/booking/${provider.id}`}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                >
                  <Lock size={14} className="mr-1" />
                  {t.bookToUnlock}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;
