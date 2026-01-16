import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Briefcase, Calendar, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout, isProvider } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
        <span className="hidden md:block font-medium text-gray-700">
          {user?.firstName || 'User'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isProvider ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isProvider ? 'Provider' : 'Customer'}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {isProvider ? (
              // Provider Menu
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Briefcase size={18} className="mr-3 text-gray-400" />
                  Dashboard
                </Link>
                <Link
                  to="/my-services"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={18} className="mr-3 text-gray-400" />
                  My Services
                </Link>
                <Link
                  to="/bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Calendar size={18} className="mr-3 text-gray-400" />
                  Bookings
                </Link>
              </>
            ) : (
              // Seeker Menu
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Calendar size={18} className="mr-3 text-gray-400" />
                  My Bookings
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Heart size={18} className="mr-3 text-gray-400" />
                  Favorites
                </Link>
              </>
            )}

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <User size={18} className="mr-3 text-gray-400" />
              Profile Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t pt-2">
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
