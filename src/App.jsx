import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProvidersPage from './pages/ProvidersPage';
import BookServicePage from './pages/BookServicePage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import ProviderDashboard from './pages/ProviderDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import ProviderServicesPage from './pages/ProviderServicesPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

function App() {
  const [language, setLanguage] = useState('en');
  const [cartOpen, setCartOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header 
              language={language} 
              toggleLanguage={toggleLanguage} 
              onCartClick={() => setCartOpen(true)}
            />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage language={language} />} />
                <Route path="/services" element={<ServicesPage language={language} />} />
                <Route path="/services/:category" element={<ServicesPage language={language} />} />
                <Route path="/providers" element={<ProvidersPage language={language} />} />
                <Route path="/providers/:providerId/book" element={<BookServicePage language={language} />} />
                <Route path="/checkout" element={<CheckoutPage language={language} />} />
                <Route path="/about" element={<AboutPage language={language} />} />
                <Route path="/contact" element={<ContactPage language={language} />} />
                <Route path="/profile" element={<ProfilePage language={language} />} />
                <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />
                <Route path="/provider/services" element={<ProviderServicesPage language={language} />} />
                <Route path="/seeker/dashboard" element={<SeekerDashboard language={language} />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/privacy" element={<PrivacyPage language={language} />} />
                <Route path="/terms" element={<TermsPage language={language} />} />
                <Route path="*" element={<HomePage language={language} />} />
              </Routes>
            </main>
            <Footer language={language} />
            <Cart 
              language={language} 
              isOpen={cartOpen} 
              onClose={() => setCartOpen(false)} 
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

    
