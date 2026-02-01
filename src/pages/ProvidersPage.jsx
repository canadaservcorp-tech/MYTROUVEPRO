import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Shield, Filter } from 'lucide-react';

const ProvidersPage = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const content = {
    en: {
      title: 'All Providers',
      subtitle: 'Browse our network of verified service providers',
      searchPlaceholder: 'Search providers...',
      sortBy: 'Sort by',
      rating: 'Highest Rated',
      reviews: 'Most Reviews',
      newest: 'Newest',
      verified: 'Verified',
      viewProfile: 'View Profile',
      reviews_count: 'reviews',
    },
    fr: {
      title: 'Tous les Fournisseurs',
      subtitle: 'Parcourez notre réseau de fournisseurs vérifiés',
      searchPlaceholder: 'Rechercher des fournisseurs...',
      sortBy: 'Trier par',
      rating: 'Mieux Notés',
      reviews: 'Plus d\'Avis',
      newest: 'Plus Récents',
      verified: 'Vérifié',
      viewProfile: 'Voir le Profil',
      reviews_count: 'avis',
    }
  };

  const t = content[language];

  const providers = [
    { id: 1, name: 'ProPlumb Solutions', category: language === 'en' ? 'Plumbing' : 'Plomberie', rating: 4.9, reviews: 127, location: 'Laval, QC', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', verified: true },
    { id: 2, name: 'Elite Electric', category: language === 'en' ? 'Electrical' : 'Électricité', rating: 4.8, reviews: 98, location: 'Laval, QC', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', verified: true },
    { id: 3, name: 'Clean & Shine', category: language === 'en' ? 'Cleaning' : 'Nettoyage', rating: 4.9, reviews: 215, location: 'Montreal, QC', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400', verified: true },
    { id: 4, name: 'Reno Masters', category: language === 'en' ? 'Renovation' : 'Rénovation', rating: 4.7, reviews: 89, location: 'Laval, QC', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', verified: true },
    { id: 5, name: 'Green Thumb', category: language === 'en' ? 'Landscaping' : 'Aménagement', rating: 4.8, reviews: 156, location: 'Laval, QC', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400', verified: true },
    { id: 6, name: 'Swift Movers', category: language === 'en' ? 'Moving' : 'Déménagement', rating: 4.6, reviews: 72, location: 'Montreal, QC', image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400', verified: true },
    { id: 7, name: 'AutoCare Plus', category: language === 'en' ? 'Auto Services' : 'Services Auto', rating: 4.7, reviews: 134, location: 'Laval, QC', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', verified: true },
    { id: 8, name: 'TechFix Pro', category: language === 'en' ? 'Tech Support' : 'Support Tech', rating: 4.8, reviews: 67, location: 'Montreal, QC', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400', verified: true },
  ];

  const filteredProviders = providers
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return 0;
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
        {/* Search & Sort */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c41e3a]"
            >
              <option value="rating">{t.rating}</option>
              <option value="reviews">{t.reviews}</option>
              <option value="newest">{t.newest}</option>
            </select>
          </div>
        </div>

        {/* Provider Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={provider.image} 
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                {provider.verified && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Shield size={12} className="mr-1" /> {t.verified}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
                <p className="text-[#c41e3a] text-sm">{provider.category}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="ml-1 font-medium">{provider.rating}</span>
                  <span className="text-gray-400 ml-1">({provider.reviews} {t.reviews_count})</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  {provider.location}
                </div>
                <Link
                  to={`/providers/${provider.id}`}
                  className="mt-4 block text-center bg-[#c41e3a] hover:bg-[#a0182f] text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {t.viewProfile}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
