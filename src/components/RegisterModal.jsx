import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, language = 'en' }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    service: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const content = {
    en: {
      title: 'Sign Up',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      businessName: 'Business Name',
      service: 'Service',
      submit: 'Create Account',
      cancel: 'Cancel',
      switchPrompt: 'Already have an account?',
      switchAction: 'Sign In',
      errorFallback: 'Registration failed. Please try again.',
    },
    fr: {
      title: 'Inscription',
      name: 'Nom complet',
      email: 'Courriel',
      phone: 'Téléphone',
      password: 'Mot de passe',
      businessName: 'Nom de l\'entreprise',
      service: 'Service',
      submit: 'Créer un compte',
      cancel: 'Annuler',
      switchPrompt: 'Déjà un compte?',
      switchAction: 'Connexion',
      errorFallback: 'Inscription échouée. Veuillez réessayer.',
    },
  };

  const t = content[language] || content.en;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        businessName: '',
        service: '',
      });
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      role: 'provider',
    };

    const result = await register(payload);
    if (!result.success) {
      setError(result.error || t.errorFallback);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.businessName}
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.service}
              </label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? `${t.submit}...` : t.submit}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="hover:text-gray-800"
          >
            {t.cancel}
          </button>
          {onSwitchToLogin && (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {t.switchPrompt} {t.switchAction}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
