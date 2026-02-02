import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, language = 'en' }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    businessName: '',
    serviceCategory: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const content = {
    en: {
      title: 'Sign Up',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      city: 'City',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      businessName: 'Business Name',
      serviceCategory: 'Service Category',
      termsPrefix: 'I accept the',
      termsLink: 'Terms and Conditions',
      submit: 'Register',
      submitting: 'Registering...',
      success: 'Registration successful! You can now sign in.',
      termsError: 'Please accept the Terms and Conditions.',
      passwordMismatch: 'Passwords do not match.',
      cancel: 'Cancel',
      switchPrompt: 'Already have an account?',
      switchAction: 'Sign In',
      errorFallback: 'Registration failed. Please try again.',
    },
    fr: {
      title: 'Inscription',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Courriel',
      city: 'Ville',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      businessName: 'Nom de l\'entreprise',
      serviceCategory: 'Catégorie de service',
      termsPrefix: 'J\'accepte les',
      termsLink: 'Conditions générales',
      submit: 'S\'inscrire',
      submitting: 'Inscription en cours...',
      success: 'Inscription réussie! Vous pouvez vous connecter.',
      termsError: 'Veuillez accepter les conditions générales.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
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
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        businessName: '',
        serviceCategory: '',
        password: '',
        confirmPassword: '',
      });
      setError('');
      setSuccess('');
      setSubmitting(false);
      setTermsAccepted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!termsAccepted) {
      setError(t.termsError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      businessName: formData.businessName,
      service: formData.serviceCategory,
      city: formData.city,
      role: 'provider',
    };

    const result = await register(payload);
    if (!result.success) {
      setError(result.error || t.errorFallback);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(t.success);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
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
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.firstName}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.lastName}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.city}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="address-level2"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.serviceCategory}
              </label>
              <input
                type="text"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span>
              {t.termsPrefix}{' '}
              <Link to="/terms" className="font-semibold text-green-700 hover:text-green-800">
                {t.termsLink}
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={!termsAccepted || submitting}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? t.submitting : t.submit}
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
              className="font-semibold text-[#c41e3a] hover:text-[#a0182f]"
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
