import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, Globe, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

const Header = ({ language, toggleLanguage, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

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
      profile: 'Profile',
      logoutBtn: 'Logout',
    },
    fr: {
      home: 'Accueil',
      services: 'Services',
      providers: 'Fournisseurs',
      about: 'A propos',
      contact: 'Contact',
      search: 'Rechercher des services...',
      location: 'Laval, QC',
      slogan: 'A cote de toi',
      signIn: 'Connexion',
      joinFree: 'Inscription',
      dashboard: 'Tableau de bord',
      profile: 'Profil',
      logoutBtn: 'Deconnexion',
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

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthMode('choose-role');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        {/* Top bar */}
        <div className="bg-blue-900 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <MapPin size={14} />
              <span>{t.location}</span>
            </div>
            <button
              type="button"
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
            <nav className="hidden lg:flex items-center space-x-6">
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

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Cart button */}
              <button
                type="button"
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  {/* User dropdown - Desktop */}
                  <div className="hidden md:flex items-center space-x-3">
                    <Link
                      to={user?.role === 'provider' ? '/provider-dashboard' : '/seeker-dashboard'}
                      className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                      {t.dashboard}
                    </Link>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.firstName?.[0] || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">{user?.firstName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title={t.logoutBtn}
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In Button - Desktop */}
                  <button
                    type="button"
                    onClick={openLogin}
                    className="hidden md:block px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  >
                    {t.signIn}
                  </button>
                  {/* Sign Up Button */}
                  <button
                    type="button"
                    onClick={openSignup}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                  >
                    {t.joinFree}
                  </button>
                </>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
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

              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'provider' ? '/provider-dashboard' : '/seeker-dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t.dashboard}
                  </Link>
                  <div className="flex items-center py-2 px-3 text-gray-700">
                    <User size={18} className="mr-2" />
                    <span>{user?.firstName} {user?.lastName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    {t.logoutBtn}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { openLogin(); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t.signIn}
                  </button>
                  <button
                    type="button"
                    onClick={() => { openSignup(); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 px-3 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    {t.joinFree}
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
