import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, Shield, Clock, MapPin, Plus, Check, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookServicePage = ({ language }) => {
  const { providerId } = useParams();
  const { addItem } = useCart();
  const [selectedServices, setSelectedServices] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const content = {
    en: {
      backToProviders: 'Back to Providers',
      bookService: 'Book Service',
      selectServices: 'Select Services',
      aboutProvider: 'About Provider',
      reviews: 'reviews',
      verified: 'Verified',
      responseTime: 'Response Time',
      hours: 'hours',
      selectedServices: 'Selected Services',
      noServices: 'Select services to continue',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart!',
      goToCart: 'Go to Cart',
      continueShopping: 'Continue Shopping',
      popular: 'Popular',
    },
    fr: {
      backToProviders: 'Retour aux fournisseurs',
      bookService: 'Reserver un service',
      selectServices: 'Selectionner les services',
      aboutProvider: 'A propos du fournisseur',
      reviews: 'avis',
      verified: 'Verifie',
      responseTime: 'Temps de reponse',
      hours: 'heures',
      selectedServices: 'Services selectionnes',
      noServices: 'Selectionnez des services pour continuer',
      addToCart: 'Ajouter au panier',
      addedToCart: 'Ajoute au panier!',
      goToCart: 'Aller au panier',
      continueShopping: 'Continuer les achats',
      popular: 'Populaire',
    }
  };

  const t = content[language];

  const providers = {
    1: {
      id: 1,
      name: 'ProPlumb Solutions',
      category: language === 'en' ? 'Plumbing' : 'Plomberie',
      categoryIcon: '🔧',
      rating: 4.9,
      reviewCount: 127,
      location: 'Laval, QC',
      responseTime: 2,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      verified: true,
      description: language === 'en'
        ? 'Professional plumbing services for residential and commercial properties. Licensed and insured with over 15 years of experience.'
        : 'Services de plomberie professionnels pour proprietes residentielles et commerciales. Licence et assure avec plus de 15 ans d\'experience.',
      services: [
        { id: 's1', name: language === 'en' ? 'Drain Cleaning' : 'Nettoyage de drain', price: 125, duration: '1-2h', popular: true },
        { id: 's2', name: language === 'en' ? 'Faucet Repair' : 'Reparation de robinet', price: 85, duration: '1h', popular: false },
        { id: 's3', name: language === 'en' ? 'Toilet Repair' : 'Reparation de toilette', price: 95, duration: '1h', popular: true },
        { id: 's4', name: language === 'en' ? 'Water Heater Service' : 'Service chauffe-eau', price: 175, duration: '2-3h', popular: false },
        { id: 's5', name: language === 'en' ? 'Pipe Repair' : 'Reparation de tuyaux', price: 150, duration: '2h', popular: false },
        { id: 's6', name: language === 'en' ? 'Emergency Service' : 'Service d\'urgence', price: 200, duration: 'ASAP', popular: true },
      ],
    },
    2: {
      id: 2,
      name: 'Elite Electric',
      category: language === 'en' ? 'Electrical' : 'Electricite',
      categoryIcon: '⚡',
      rating: 4.8,
      reviewCount: 98,
      location: 'Laval, QC',
      responseTime: 3,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
      verified: true,
      description: language === 'en'
        ? 'Licensed electricians providing residential and commercial electrical services. Safety is our priority.'
        : 'Electriciens licencies offrant des services electriques residentiels et commerciaux. La securite est notre priorite.',
      services: [
        { id: 'e1', name: language === 'en' ? 'Outlet Installation' : 'Installation de prise', price: 95, duration: '1h', popular: true },
        { id: 'e2', name: language === 'en' ? 'Light Fixture Install' : 'Installation luminaire', price: 85, duration: '1h', popular: true },
        { id: 'e3', name: language === 'en' ? 'Panel Upgrade' : 'Mise a niveau du panneau', price: 450, duration: '4-6h', popular: false },
        { id: 'e4', name: language === 'en' ? 'Ceiling Fan Install' : 'Installation ventilateur', price: 125, duration: '1-2h', popular: false },
        { id: 'e5', name: language === 'en' ? 'Electrical Inspection' : 'Inspection electrique', price: 150, duration: '2h', popular: false },
      ],
    },
    3: {
      id: 3,
      name: 'Clean & Shine',
      category: language === 'en' ? 'Cleaning' : 'Nettoyage',
      categoryIcon: '🧹',
      rating: 4.9,
      reviewCount: 215,
      location: 'Montreal, QC',
      responseTime: 1,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      verified: true,
      description: language === 'en'
        ? 'Professional cleaning services for homes and offices. Eco-friendly products available.'
        : 'Services de nettoyage professionnels pour maisons et bureaux. Produits ecologiques disponibles.',
      services: [
        { id: 'c1', name: language === 'en' ? 'Standard Cleaning' : 'Nettoyage standard', price: 120, duration: '2-3h', popular: true },
        { id: 'c2', name: language === 'en' ? 'Deep Cleaning' : 'Nettoyage en profondeur', price: 220, duration: '4-5h', popular: true },
        { id: 'c3', name: language === 'en' ? 'Move-out Cleaning' : 'Nettoyage demenagement', price: 280, duration: '5-6h', popular: false },
        { id: 'c4', name: language === 'en' ? 'Office Cleaning' : 'Nettoyage de bureau', price: 150, duration: '2-3h', popular: false },
        { id: 'c5', name: language === 'en' ? 'Window Cleaning' : 'Nettoyage de vitres', price: 85, duration: '1-2h', popular: false },
      ],
    },
  };

  const provider = providers[providerId] || providers[1];

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
    setAddedToCart(false);
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const handleAddToCart = () => {
    selectedServices.forEach(service => {
      addItem({
        id: `${provider.id}-${service.id}`,
        name: service.name,
        price: service.price,
        category: provider.category,
        providerName: provider.name,
        icon: provider.categoryIcon,
        duration: service.duration,
      });
    });
    setAddedToCart(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/providers"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          {t.backToProviders}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Provider Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="h-48 bg-gray-200">
                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                    <p className="text-blue-600">{provider.category}</p>
                  </div>
                  {provider.verified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                      <Shield size={14} className="mr-1" /> {t.verified}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1 font-medium">{provider.rating}</span>
                    <span className="ml-1">({provider.reviewCount} {t.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {provider.location}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {t.responseTime}: {provider.responseTime} {t.hours}
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{provider.description}</p>
              </div>
            </div>

            {/* Services Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">{t.selectServices}</h2>

              <div className="space-y-3">
                {provider.services.map((service) => {
                  const isSelected = selectedServices.find(s => s.id === service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{service.name}</span>
                            {service.popular && (
                              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                                {t.popular}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{service.duration}</span>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">${service.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Services */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <ShoppingCart size={20} className="mr-2 text-blue-600" />
                {t.selectedServices}
              </h3>

              {selectedServices.length === 0 ? (
                <p className="text-gray-500 text-center py-6">{t.noServices}</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center">
                        <span className="text-sm">{service.name}</span>
                        <span className="font-medium">${service.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${getTotalPrice()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+ taxes (TPS/TVQ)</p>
                  </div>

                  {addedToCart ? (
                    <div className="space-y-3">
                      <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center justify-center">
                        <Check size={18} className="mr-2" />
                        {t.addedToCart}
                      </div>
                      <Link
                        to="/checkout"
                        className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-700"
                      >
                        {t.goToCart}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedServices([]);
                          setAddedToCart(false);
                        }}
                        className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                      >
                        {t.continueShopping}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Plus size={18} className="mr-2" />
                      {t.addToCart}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
