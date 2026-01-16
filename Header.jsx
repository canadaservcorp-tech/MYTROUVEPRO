import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthMode('choose-role');
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="myTROUVEpro"
                className="h-10 w-auto"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services near you..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="hidden md:block px-4 py-2 text-gray-700 font-medium hover:text-red-600"
                  >
                    Sign In
                  </button>
                  {/* Sign Up Button */}
                  <button
                    onClick={openSignup}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700"
                  >
                    Join Free
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
                  placeholder="Search services..."
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
                Home
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                Find Services
              </Link>
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => { openLogin(); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { openSignup(); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 px-3 rounded-lg bg-red-600 text-white"
                  >
                    Join Free
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
