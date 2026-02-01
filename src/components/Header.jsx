import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, Globe } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = ({ language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const location = useLocation();

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
      signUp: 'Sign Up',
    },
    fr: {
      home: 'Accueil',
      services: 'Services',
      providers: 'Fournisseurs',
      about: 'À propos',
      contact: 'Contact',
      search: 'Rechercher des services...',
      location: 'Laval, QC',
      slogan: 'À côté de toi',
      signIn: 'Connexion',
      signUp: 'Inscription',
    },
  };

  const t = content[language];

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/services', label: t.services },
    { path: '/providers', label: t.providers },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  const openLogin = () => {
    setIsMenuOpen(false);
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsMenuOpen(false);
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        {/* Top bar */}
        <div className="bg-[#2c2c2c] text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <MapPin size={14} />
              <span>{t.location}</span>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
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
            <Link to="/" className="flex items-center space-x-3">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <rect width="44" height="44" rx="10" fill="#2c2c2c" />
                <circle cx="22" cy="22" r="8" fill="#c41e3a" />
                <circle cx="22" cy="22" r="3" fill="#fff" />
                <circle cx="10" cy="10" r="3" fill="#888" />
                <circle cx="34" cy="10" r="3" fill="#888" />
                <circle cx="10" cy="34" r="3" fill="#888" />
                <circle cx="34" cy="34" r="3" fill="#888" />
                <line x1="12" y1="12" x2="18" y2="18" stroke="#c41e3a" strokeWidth="1.5" />
                <line x1="32" y1="12" x2="26" y2="18" stroke="#c41e3a" strokeWidth="1.5" />
                <line x1="12" y1="32" x2="18" y2="26" stroke="#c41e3a" strokeWidth="1.5" />
                <line x1="32" y1="32" x2="26" y2="26" stroke="#c41e3a" strokeWidth="1.5" />
              </svg>
              <div>
                <div>
                  <span className="text-xl font-bold" style={{ color: '#2c2c2c' }}>my</span>
                  <span className="text-xl font-bold" style={{ color: '#c41e3a' }}>TROUVE</span>
                  <span className="text-xl font-bold" style={{ color: '#2c2c2c' }}>pro</span>
                </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent"
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
                      ? 'text-[#c41e3a]'
                      : 'text-gray-700 hover:text-[#c41e3a]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3 ml-4">
              <button
                type="button"
                onClick={openLogin}
                className="text-sm font-medium text-gray-700 hover:text-[#c41e3a]"
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="text-sm font-semibold bg-[#c41e3a] text-white px-4 py-2 rounded-lg hover:bg-[#a0182f] transition-colors"
              >
                {t.signUp}
              </button>
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
                      ? 'bg-gray-100 text-[#c41e3a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={openLogin}
                  className="w-full text-left py-2 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {t.signIn}
                </button>
                <button
                  type="button"
                  onClick={openRegister}
                  className="w-full text-left py-2 px-3 rounded-lg bg-[#c41e3a] text-white hover:bg-[#a0182f]"
                >
                  {t.signUp}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
        language={language}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
        language={language}
      />
    </>
  );
};

export default Header;
