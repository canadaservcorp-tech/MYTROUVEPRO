import React, { useState } from 'react';

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const content = {
    en: {
      title: 'myTROUVEpro',
      slogan: 'Near To You',
      description: 'Find trusted local service providers in your area',
      services: 'Our Services',
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      cleaning: 'Cleaning',
      renovation: 'Renovation',
      landscaping: 'Landscaping',
      moving: 'Moving',
      auto: 'Auto Services',
      tech: 'Tech Support',
      contact: 'Contact Us',
      location: 'Laval, Quebec, Canada',
      langSwitch: 'FR',
      search: 'Search services...',
      searchBtn: 'Search',
      whyTitle: 'Why Choose Us?',
      verified: 'Verified Providers',
      verifiedDesc: 'All providers are verified and reviewed',
      fast: 'Quick Response',
      fastDesc: 'Get quotes within hours',
      trusted: 'Trusted Reviews',
      trustedDesc: 'Real reviews from real customers',
      cta: 'Are you a service provider?',
      ctaBtn: 'Register Now',
      rights: 'All rights reserved.'
    },
    fr: {
      title: 'myTROUVEpro',
      slogan: 'À côté de toi',
      description: 'Trouvez des fournisseurs de services locaux de confiance',
      services: 'Nos Services',
      plumbing: 'Plomberie',
      electrical: 'Électricité',
      cleaning: 'Nettoyage',
      renovation: 'Rénovation',
      landscaping: 'Aménagement',
      moving: 'Déménagement',
      auto: 'Services Auto',
      tech: 'Support Tech',
      contact: 'Contactez-nous',
      location: 'Laval, Québec, Canada',
      langSwitch: 'EN',
      search: 'Rechercher des services...',
      searchBtn: 'Rechercher',
      whyTitle: 'Pourquoi Nous Choisir?',
      verified: 'Fournisseurs Vérifiés',
      verifiedDesc: 'Tous les fournisseurs sont vérifiés',
      fast: 'Réponse Rapide',
      fastDesc: 'Obtenez des devis en quelques heures',
      trusted: 'Avis de Confiance',
      trustedDesc: 'De vrais avis de vrais clients',
      cta: 'Êtes-vous un fournisseur de services?',
      ctaBtn: 'Inscrivez-vous',
      rights: 'Tous droits réservés.'
    }
  };

  const t = content[language];

  const services = [
    { icon: '🔧', name: t.plumbing },
    { icon: '⚡', name: t.electrical },
    { icon: '🧹', name: t.cleaning },
    { icon: '🏠', name: t.renovation },
    { icon: '🌿', name: t.landscaping },
    { icon: '📦', name: t.moving },
    { icon: '🚗', name: t.auto },
    { icon: '💻', name: t.tech },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-950 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>📍 {t.location}</span>
          <button 
            onClick={toggleLanguage}
            className="hover:text-blue-200"
          >
            🌐 {t.langSwitch}
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="myTROUVEpro"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <span className="text-xl font-bold text-blue-900">myTROUVE</span>
              <span className="text-xl font-bold text-green-500">pro</span>
              <p className="text-xs text-gray-500">{t.slogan}</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#services" className="text-gray-700 hover:text-blue-600">{t.services}</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">{t.contact}</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative text-white py-20"
        style={{
          backgroundImage: 'url(/hero-bg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.description.split(' ').slice(0, 3).join(' ')}
            <br />
            <span className="text-green-400">{t.description.split(' ').slice(3).join(' ')}</span>
          </h1>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2">
              <input 
                type="text" 
                placeholder={t.search}
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600">
                {t.searchBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.services}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center cursor-pointer transition-shadow">
                <span className="text-4xl block mb-3">{service.icon}</span>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.whyTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.verified}</h3>
              <p className="text-gray-600">{t.verifiedDesc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.fast}</h3>
              <p className="text-gray-600">{t.fastDesc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.trusted}</h3>
              <p className="text-gray-600">{t.trustedDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.cta}</h2>
          <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 mt-4">
            {t.ctaBtn}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/logo.png"
              alt="myTROUVEpro"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <span className="text-xl font-bold">myTROUVE</span>
              <span className="text-xl font-bold text-green-400">pro</span>
            </div>
          </div>
          <p className="text-gray-400">{t.location}</p>
          <p className="text-gray-500 mt-4">Performance Cristal Technologies Avancées S.A.</p>
          <p className="text-gray-500">NEQ: 2280629637</p>
          <p className="text-gray-600 mt-4">© 2026 myTROUVEpro. {t.rights}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
