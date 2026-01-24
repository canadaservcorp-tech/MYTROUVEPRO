import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProviderList from './pages/ProviderList';
import BookServicePage from './pages/BookServicePage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProviderDashboard from './pages/ProviderDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import ProviderServicesPage from './pages/ProviderServicesPage';
import ProfilePage from './pages/ProfilePage';

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
                <Route path="/providers" element={<ProviderList language={language} />} />
                <Route path="/providers/:category" element={<ProviderList language={language} />} />
                <Route path="/providers/:providerId/book" element={<BookServicePage language={language} />} />
                <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />
                <Route path="/provider/services" element={<ProviderServicesPage language={language} />} />
                <Route path="/seeker/dashboard" element={<SeekerDashboard language={language} />} />
                <Route path="/profile" element={<ProfilePage language={language} />} />
                <Route path="/checkout" element={<CheckoutPage language={language} />} />
                <Route path="/about" element={<AboutPage language={language} />} />
                <Route path="/contact" element={<ContactPage language={language} />} />
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
