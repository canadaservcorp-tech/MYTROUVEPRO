import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Shield, Clock } from 'lucide-react';

const ServicesPage = ({ language }) => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const content = {
    en: {
      title: 'Browse Services',
      subtitle: 'Find the perfect provider for your needs',
      searchPlaceholder: 'Search services...',
      filter: 'Filter',
      allCategories: 'All Categories',
      providers: 'providers',
      viewProfile: 'View Profile',
      verified: 'Verified',
      responseTime: 'Responds in',
      hours: 'hours',
    },
    fr: {
      title: 'Parcourir les Services',
      subtitle: 'Trouvez le fournisseur parfait pour vos besoins',
      searchPlaceholder: 'Rechercher des services...',
      filter: 'Filtrer',
      allCategories: 'Toutes les Catégories',
      providers: 'fournisseurs',
      viewProfile: 'Voir le Profil',
      verified: 'Vérifié',
      responseTime: 'Répond en',
      hours: 'heures',
    }
  };

  const t = content[language];

  const categories = [
    { id: 'all', name: t.allCategories, icon: '📋' },
    { id: 'plumbing', name: language === 'en' ? 'Plumbing' : 'Plomberie', icon: '🔧' },
    { id: 'electrical', name: language === 'en' ? 'Electrical' : 'Électricité', icon: '⚡' },
    { id: 'cleaning', name: language === 'en' ? 'Cleaning' : 'Nettoyage', icon: '🧹' },
    { id: 'renovation', name: language === 'en' ? 'Renovation' : 'Rénovation', icon: '🏠' },
    { id: 'landscaping', name: language === 'en' ? 'Landscaping' : 'Aménagement', icon: '🌿' },
    { id: 'moving', name: language === 'en' ? 'Moving' : 'Déménagement', icon: '📦' },
    { id: 'auto', name: language === 'en' ? 'Auto Services' : 'Services Auto', icon: '🚗' },
    { id: 'tech', name: language === 'en' ? 'Tech Support' : 'Support Tech', icon: '💻' },
  ];

  const providers = [
    {
      id: 1,
      name: 'ProPlumb Solutions',
      category: 'plumbing',
      categoryName: language === 'en' ? 'Plumbing' : 'Plomberie',
      rating: 4.9,
      reviews: 127,
      location: 'Laval, QC',
      responseTime: 2,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      verified: true,
      description: language === 'en' 
        ? 'Professional plumbing services for residential and commercial properties.'
        : 'Services de plomberie professionnels pour propriétés résidentielles et commerciales.',
    },
    {
      id: 2,
      name: 'Elite Electric',
      category: 'electrical',
      categoryName: language === 'en' ? 'Electrical' : 'Électricité',
      rating: 4.8,
      reviews: 98,
      location: 'Laval, QC',
      responseTime: 3,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      verified: true,
      description: language === 'en'
        ? 'Licensed electricians for all your electrical needs.'
        : 'Électriciens licenciés pour tous vos besoins électriques.',
    },
    {
      id: 3,
      name: 'Clean & Shine',
      category: 'cleaning',
      categoryName: language === 'en' ? 'Cleaning' : 'Nettoyage',
      rating: 4.9,
      reviews: 215,
      location: 'Montreal, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      verified: true,
      description: language === 'en'
        ? 'Professional cleaning services for homes and offices.'
        : 'Services de nettoyage professionnels pour maisons et bureaux.',
    },
    {
      id: 4,
      name: 'Reno Masters',
      category: 'renovation',
      categoryName: language === 'en' ? 'Renovation' : 'Rénovation',
      rating: 4.7,
      reviews: 89,
      location: 'Laval, QC',
      responseTime: 4,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      verified: true,
      description: language === 'en'
        ? 'Complete home renovation and remodeling services.'
        : 'Services complets de rénovation et remodelage de maison.',
    },
    {
      id: 5,
      name: 'Green Thumb Landscaping',
      category: 'landscaping',
      categoryName: language === 'en' ? 'Landscaping' : 'Aménagement',
      rating: 4.8,
      reviews: 156,
      location: 'Laval, QC',
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
      categoryName: language === 'en' ? 'Moving' : 'Déménagement',
      rating: 4.6,
      reviews: 72,
      location: 'Montreal, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
      verified: true,
      description: language === 'en'
        ? 'Reliable moving services for local and long-distance moves.'
        : 'Services de déménagement fiables pour déménagements locaux et longue distance.',
    },
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = !category || category === 'all' || provider.category === category;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2c2c2c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-300">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">{t.allCategories}</h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.id === 'all' ? '/services' : `/services/${cat.id}`}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      (category === cat.id || (!category && cat.id === 'all'))
                        ? 'bg-gray-100 text-[#c41e3a]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search & Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent"
                  />
                </div>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={20} className="mr-2" />
                  {t.filter}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-4">
              {filteredProviders.length} {t.providers}
            </p>

            {/* Provider Cards */}
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 flex-shrink-0">
                      <img 
                        src={provider.image} 
                        alt={provider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-[#c41e3a]">{provider.categoryName}</p>
                        </div>
                        {provider.verified && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                            <Shield size={14} className="mr-1" /> {t.verified}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{provider.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                          <span className="font-medium text-gray-900">{provider.rating}</span>
                          <span className="ml-1">({provider.reviews})</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {provider.location}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {t.responseTime} {provider.responseTime} {t.hours}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Link
                          to={`/providers/${provider.id}`}
                          className="inline-block bg-[#c41e3a] hover:bg-[#a0182f] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          {t.viewProfile}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
