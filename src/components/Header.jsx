import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ language, toggleLanguage, onOpenAuthModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isProvider, isSeeker } = useAuth();

  const content = {
    en: {
      home: 'Home',
      services: 'Services',
      providers: 'Providers',
      about: 'About',
      contact: 'Contact',
      search: 'Search services...',
      location: 'Laval, QC',
      slogan: 'Near To You',
      signIn: 'Sign In',
      joinFree: 'Join Free',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    fr: {
      home: 'Accueil',
      services: 'Services',
      providers: 'Fournisseurs',
      about: 'À propos',
      contact: 'Contact',
      search: 'Rechercher des services...',
      location: 'Laval, QC',
      slogan: 'Près de toi',
      signIn: 'Connexion',
      joinFree: 'Inscription',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion',
    }
  };

  const t = content[language];

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/services', label: t.services },
    { path: '/providers', label: t.providers },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
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

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">mT</span>
            </div>
            <div>
              <span className="text-xl font-bold text-blue-900">myTROUVE</span>
              <span className="text-xl font-bold text-green-500">pro</span>
              <p className="text-xs text-gray-500 -mt-1">{t.slogan}</p>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={isProvider ? '/dashboard' : '/my-dashboard'}
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <User size={18} className="mr-1" />
                  {t.dashboard}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <LogOut size={18} className="mr-1" />
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  {t.signIn}
                </button>
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('choose-role')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {t.joinFree}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <nav className="px-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 px-3 rounded-lg ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={isProvider ? '/dashboard' : '/my-dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <User size={18} className="mr-2" />
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onOpenAuthModal && onOpenAuthModal('login'); setIsMenuOpen(false); }}
                    className="w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t.signIn}
                  </button>
                  <button
                    onClick={() => { onOpenAuthModal && onOpenAuthModal('choose-role'); setIsMenuOpen(false); }}
                    className="w-full py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-center"
                  >
                    {t.joinFree}
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
