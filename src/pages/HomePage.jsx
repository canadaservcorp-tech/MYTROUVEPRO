import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Shield, Clock, ThumbsUp } from 'lucide-react';

const HomePage = ({ language }) => {
  const content = {
    en: {
      heroTitle: 'Find Trusted Service Providers',
      heroHighlight: 'Near You',
      heroSubtitle: 'Connect with verified local professionals for all your needs',
      searchPlaceholder: 'What service are you looking for?',
      locationPlaceholder: 'Laval, QC',
      searchButton: 'Search',
      
      categoriesTitle: 'Popular Services',
      categoriesSubtitle: 'Browse by category',
      
      whyTitle: 'Why Choose myTROUVEpro?',
      whyVerified: 'Verified Providers',
      whyVerifiedDesc: 'All service providers are verified and reviewed',
      whyFast: 'Quick Response',
      whyFastDesc: 'Get quotes within hours, not days',
      whyTrust: 'Trusted Reviews',
      whyTrustDesc: 'Real reviews from real customers',
      
      featuredTitle: 'Featured Providers',
      featuredSubtitle: 'Top-rated professionals in your area',
      viewAll: 'View All',
      
      ctaTitle: 'Are You a Service Provider?',
      ctaSubtitle: 'Join our network and grow your business',
      ctaButton: 'Register Now',
    },
    fr: {
      heroTitle: 'Trouvez des Fournisseurs de Services',
      heroHighlight: 'Près de Chez Vous',
      heroSubtitle: 'Connectez-vous avec des professionnels locaux vérifiés',
      searchPlaceholder: 'Quel service cherchez-vous?',
      locationPlaceholder: 'Laval, QC',
      searchButton: 'Rechercher',
      
      categoriesTitle: 'Services Populaires',
      categoriesSubtitle: 'Parcourir par catégorie',
      
      whyTitle: 'Pourquoi Choisir myTROUVEpro?',
      whyVerified: 'Fournisseurs Vérifiés',
      whyVerifiedDesc: 'Tous les fournisseurs sont vérifiés et évalués',
      whyFast: 'Réponse Rapide',
      whyFastDesc: 'Obtenez des devis en quelques heures',
      whyTrust: 'Avis de Confiance',
      whyTrustDesc: 'De vrais avis de vrais clients',
      
      featuredTitle: 'Fournisseurs en Vedette',
      featuredSubtitle: 'Professionnels les mieux notés de votre région',
      viewAll: 'Voir Tout',
      
      ctaTitle: 'Êtes-vous un Fournisseur de Services?',
      ctaSubtitle: 'Rejoignez notre réseau et développez votre entreprise',
      ctaButton: 'Inscrivez-vous',
    }
  };

  const t = content[language];

  const categories = [
    { id: 'plumbing', icon: '🔧', name: language === 'en' ? 'Plumbing' : 'Plomberie', count: 45 },
    { id: 'electrical', icon: '⚡', name: language === 'en' ? 'Electrical' : 'Électricité', count: 38 },
    { id: 'cleaning', icon: '🧹', name: language === 'en' ? 'Cleaning' : 'Nettoyage', count: 62 },
    { id: 'renovation', icon: '🏠', name: language === 'en' ? 'Renovation' : 'Rénovation', count: 54 },
    { id: 'landscaping', icon: '🌿', name: language === 'en' ? 'Landscaping' : 'Aménagement', count: 31 },
    { id: 'moving', icon: '📦', name: language === 'en' ? 'Moving' : 'Déménagement', count: 28 },
    { id: 'auto', icon: '🚗', name: language === 'en' ? 'Auto Services' : 'Services Auto', count: 41 },
    { id: 'tech', icon: '💻', name: language === 'en' ? 'Tech Support' : 'Support Tech', count: 35 },
  ];

  const featuredProviders = [
    {
      id: 1,
      name: 'ProPlumb Solutions',
      category: language === 'en' ? 'Plumbing' : 'Plomberie',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      verified: true,
    },
    {
      id: 2,
      name: 'Elite Electric',
      category: language === 'en' ? 'Electrical' : 'Électricité',
      rating: 4.8,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      verified: true,
    },
    {
      id: 3,
      name: 'Clean & Shine',
      category: language === 'en' ? 'Cleaning' : 'Nettoyage',
      rating: 4.9,
      reviews: 215,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      verified: true,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2c2c2c] via-[#3a3a3a] to-[#2c2c2c] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t.heroTitle}
            <br />
            <span className="text-green-400">{t.heroHighlight}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-2 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                />
              </div>
              <div className="relative md:w-48">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.locationPlaceholder}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                />
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                {t.searchButton}
              </button>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/services/${category.id}`}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-[#c41e3a] rounded-xl p-6 text-center transition-all group"
              >
                <span className="text-4xl block mb-3">{category.icon}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#c41e3a]">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} {language === 'en' ? 'providers' : 'fournisseurs'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.whyTitle}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#c41e3a]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.whyVerified}</h3>
              <p className="text-gray-600">{t.whyVerifiedDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.whyFast}</h3>
              <p className="text-gray-600">{t.whyFastDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.whyTrust}</h3>
              <p className="text-gray-600">{t.whyTrustDesc}</p>
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
            <Link to="/providers" className="text-[#c41e3a] hover:text-[#a0182f] font-medium flex items-center">
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
                      <Shield size={12} className="mr-1" /> {language === 'en' ? 'Verified' : 'Vérifié'}
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
          <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            {t.ctaButton}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
