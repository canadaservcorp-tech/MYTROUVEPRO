import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, language = 'en' }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const content = {
    en: {
      title: 'Sign In',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
      cancel: 'Cancel',
      switchPrompt: "Don't have an account?",
      switchAction: 'Sign Up',
      errorFallback: 'Login failed. Please try again.',
    },
    fr: {
      title: 'Connexion',
      email: 'Courriel',
      password: 'Mot de passe',
      submit: 'Connexion',
      cancel: 'Annuler',
      switchPrompt: 'Pas de compte?',
      switchAction: 'Inscription',
      errorFallback: 'La connexion a échoué. Veuillez réessayer.',
    },
  };

  const t = content[language] || content.en;

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
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

    const result = await login(formData.email, formData.password);
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
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
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
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
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
          {onSwitchToRegister && (
            <button
              type="button"
              onClick={onSwitchToRegister}
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

export default LoginModal;
