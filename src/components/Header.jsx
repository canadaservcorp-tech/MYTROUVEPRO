import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

const Header = ({ language = 'en', toggleLanguage, openLogin, openSignup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const content = {
    en: {
      location: 'Laval, QC',
      slogan: 'Near To You',
      search: 'Search services...',
    },
    fr: {
      location: 'Laval, QC',
      slogan: 'À côté de toi',
      search: 'Rechercher des services...',
    }
  };

  const t = content[language] || content['en'];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <MapPin size={14} />
            <span>{t.location}</span>
          </div>
          <button 
            onClick={toggleLanguage}
            className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
          >
            <Globe size={14} />
            <span>{language === 'en' ? 'FR' : 'EN'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/favicon.svg" alt="myTROUVEpro Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <span className="text-xl font-bold text-blue-900">myTROUVE</span>
              <span className="text-xl font-bold text-green-500">pro</span>
              <p className="text-xs text-gray-500 -mt-1">{t.slogan}</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Bell size={22} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                </button>
                {/* User Menu */}
                <UserMenu />
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <button
                  onClick={openLogin}
                  className="hidden md:block px-4 py-2 text-gray-700 font-medium hover:text-green-600"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </button>
                {/* Sign Up Button */}
                <button
                  onClick={openSignup}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700"
                >
                   {language === 'fr' ? 'Rejoindre Gratuitement' : 'Join Free'}
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <nav className="px-4 pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              {language === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <Link
              to="/services"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              {language === 'fr' ? 'Services' : 'Find Services'}
            </Link>
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => { openLogin(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </button>
                <button
                  onClick={() => { openSignup(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 rounded-lg bg-green-600 text-white"
                >
                   {language === 'fr' ? 'Rejoindre Gratuitement' : 'Join Free'}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
