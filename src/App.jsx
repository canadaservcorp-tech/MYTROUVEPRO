import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProvidersPage from './pages/ProvidersPage';
import BookServicePage from './pages/BookServicePage';
import CheckoutPage from './pages/CheckoutPage';
import ProviderDashboard from './pages/ProviderDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthModal from './components/AuthModal';

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthMode('choose-role');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header 
              language={language} 
              toggleLanguage={toggleLanguage}
              openLogin={openLogin}
              openSignup={openSignup}
            />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage language={language} openSignup={openSignup} />} />
                <Route path="/services" element={<ServicesPage language={language} />} />
                <Route path="/services/:category" element={<ServicesPage language={language} />} />
                <Route path="/providers" element={<ProvidersPage language={language} />} />
                <Route path="/providers/:providerId" element={<BookServicePage language={language} />} />
                <Route path="/providers/:providerId/book" element={<BookServicePage language={language} />} />
                <Route path="/checkout" element={<CheckoutPage language={language} />} />
                
                {/* Dashboards */}
                <Route path="/dashboard" element={<ProviderDashboard language={language} />} />
                <Route path="/my-bookings" element={<SeekerDashboard language={language} />} />
                <Route path="/profile" element={<ProfilePage language={language} />} />
                
                {/* Static Pages */}
                <Route path="/about" element={<AboutPage language={language} />} />
                <Route path="/contact" element={<ContactPage language={language} />} />
              </Routes>
            </main>
            
            <Footer language={language} />

            <AuthModal 
              isOpen={showAuthModal}
              onClose={closeAuthModal}
              initialMode={authMode}
            />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
