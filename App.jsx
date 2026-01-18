import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext-Supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProvidersPage from './pages/ProvidersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header 
            language={language} 
            toggleLanguage={toggleLanguage}
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage language={language} />} />
              <Route path="/services" element={<ServicesPage language={language} />} />
              <Route path="/services/:category" element={<ServicesPage language={language} />} />
              <Route path="/providers" element={<ProvidersPage language={language} />} />
              <Route path="/about" element={<AboutPage language={language} />} />
              <Route path="/contact" element={<ContactPage language={language} />} />
              <Route path="*" element={<HomePage language={language} />} />
            </Routes>
          </main>
          <Footer language={language} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
