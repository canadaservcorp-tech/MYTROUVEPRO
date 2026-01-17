    import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../AuthContext-Supabase';
import { CartProvider } from '../CartContext';
import Header from '../Header';
import Footer from '../Footer';
import Cart from '../Cart';
import HomePage from '../HomePage';
import ServicesPage from '../ServicesPage';
import ProvidersPage from '../ProvidersPage';
import BookServicePage from '../BookServicePage';
import CheckoutPage from '../CheckoutPage';
import AboutPage from '../AboutPage';
import ContactPage from '../ContactPage';
import ProfilePage from '../ProfilePage';
import ProviderDashboard from '../ProviderDashboard';
import SeekerDashboard from '../SeekerDashboard';
import AddServicePage from './pages/AddServicePage';

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
                <Route path="/my-services/add" element={<AddServicePage language={language} />} />
                <Route path="/seeker/dashboard" element={<SeekerDashboard language={language} />} />
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

    
