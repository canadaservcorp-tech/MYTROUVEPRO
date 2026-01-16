import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProvidersPage from './pages/ProvidersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProviderRegistrationPage from './pages/ProviderRegistrationPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header language={language} toggleLanguage={toggleLanguage} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/services" element={<ServicesPage language={language} />} />
            <Route path="/services/:category" element={<ServicesPage language={language} />} />
            <Route path="/providers" element={<ProvidersPage language={language} />} />
            <Route path="/providers/:id" element={<ProviderProfilePage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/register" element={<ProviderRegistrationPage language={language} />} />
            <Route path="/booking/:providerId" element={<BookingPage language={language} />} />
            <Route path="/booking-success" element={<BookingSuccessPage language={language} />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
