import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProvidersPage from './pages/ProvidersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import ProviderDashboard from './pages/ProviderDashboard';
import SeekerDashboard from './pages/SeekerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Content with Auth Context
const AppContent = () => {
  const [language, setLanguage] = useState('en');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const { isAuthenticated, isProvider, isSeeker } = useAuth();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          language={language}
          toggleLanguage={toggleLanguage}
          onOpenAuthModal={openAuthModal}
        />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage language={language} onOpenAuthModal={openAuthModal} />} />
            <Route path="/services" element={<ServicesPage language={language} />} />
            <Route path="/services/:category" element={<ServicesPage language={language} />} />
            <Route path="/providers" element={<ProvidersPage language={language} />} />
            <Route path="/providers/:id" element={<ProvidersPage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/terms" element={<TermsPage language={language} />} />

            {/* Provider Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderDashboard language={language} />
                </ProtectedRoute>
              }
            />

            {/* Seeker Dashboard */}
            <Route
              path="/my-dashboard"
              element={
                <ProtectedRoute requiredRole="seeker">
                  <SeekerDashboard language={language} />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer language={language} />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          language={language}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
