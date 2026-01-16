import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Briefcase, Users, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', language = 'en' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: 'Laval',
    // Provider-specific
    businessName: '',
    category: '',
    description: '',
  });

  const content = {
    en: {
      signIn: 'Sign In',
      joinTitle: 'Join myTROUVEpro',
      providerReg: 'Provider Registration',
      createAccount: 'Create Account',
      lookingFor: "I'm looking for services",
      lookingForDesc: 'Find and book local service providers',
      alwaysFree: 'Always FREE',
      serviceProvider: "I'm a service provider",
      serviceProviderDesc: 'List your services and get new clients',
      freeToJoin: 'FREE to join',
      commission: '10% per booking',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      city: 'City',
      businessName: 'Business Name',
      category: 'Service Category',
      selectCategory: 'Select a category',
      description: 'Description',
      descPlaceholder: 'Tell customers about your services...',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      joinAsProvider: 'Join as Provider',
      backToRole: 'Back to role selection',
      termsText: 'I accept the',
      termsLink: 'Terms and Conditions',
      termsRequired: 'You must accept the Terms and Conditions to continue',
      passwordMismatch: 'Passwords do not match',
      passwordLength: 'Password must be at least 6 characters',
      freeJoinProvider: 'FREE to join!',
      onlyCommission: 'Only 10% commission on bookings',
    },
    fr: {
      signIn: 'Connexion',
      joinTitle: 'Rejoindre myTROUVEpro',
      providerReg: 'Inscription Fournisseur',
      createAccount: 'Créer un compte',
      lookingFor: 'Je cherche des services',
      lookingForDesc: 'Trouvez et réservez des fournisseurs locaux',
      alwaysFree: 'Toujours GRATUIT',
      serviceProvider: 'Je suis un fournisseur de services',
      serviceProviderDesc: 'Listez vos services et obtenez de nouveaux clients',
      freeToJoin: 'Inscription GRATUITE',
      commission: '10% par réservation',
      haveAccount: 'Vous avez déjà un compte?',
      noAccount: "Vous n'avez pas de compte?",
      signUp: "S'inscrire",
      email: 'Courriel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      city: 'Ville',
      businessName: "Nom de l'entreprise",
      category: 'Catégorie de service',
      selectCategory: 'Sélectionnez une catégorie',
      description: 'Description',
      descPlaceholder: 'Décrivez vos services aux clients...',
      signingIn: 'Connexion en cours...',
      creatingAccount: 'Création du compte...',
      joinAsProvider: 'Rejoindre en tant que fournisseur',
      backToRole: 'Retour au choix du rôle',
      termsText: "J'accepte les",
      termsLink: 'Termes et Conditions',
      termsRequired: 'Vous devez accepter les Termes et Conditions pour continuer',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordLength: 'Le mot de passe doit comporter au moins 6 caractères',
      freeJoinProvider: 'Inscription GRATUITE!',
      onlyCommission: 'Seulement 10% de commission sur les réservations',
    }
  };

  const t = content[language];

  const categories = [
    { id: 'healthcare', name: 'Healthcare', nameFr: 'Santé' },
    { id: 'home', name: 'Home Services', nameFr: 'Services à domicile' },
    { id: 'auto', name: 'Auto Services', nameFr: 'Services auto' },
    { id: 'beauty', name: 'Beauty & Wellness', nameFr: 'Beauté & Bien-être' },
    { id: 'education', name: 'Education', nameFr: 'Éducation' },
    { id: 'legal', name: 'Legal', nameFr: 'Juridique' },
    { id: 'tech', name: 'Tech & IT', nameFr: 'Tech & TI' },
    { id: 'repairs', name: 'Repairs', nameFr: 'Réparations' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      onClose();
      resetForm();
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check terms acceptance
    if (!termsAccepted) {
      setError(t.termsRequired);
      setLoading(false);
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.passwordLength);
      setLoading(false);
      return;
    }

    const result = await register({
      ...formData,
      role,
      termsAccepted: true,
    });

    if (result.success) {
      onClose();
      resetForm();
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setMode('register');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: 'Laval',
      businessName: '',
      category: '',
      description: '',
    });
    setTermsAccepted(false);
    setError('');
    setMode('login');
    setRole(null);
  };

  // Update mode when initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => { onClose(); resetForm(); }}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' && t.signIn}
              {mode === 'choose-role' && t.joinTitle}
              {mode === 'register' && (role === 'provider' ? t.providerReg : t.createAccount)}
            </h2>
            <button onClick={() => { onClose(); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Choose Role View */}
            {mode === 'choose-role' && (
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  {language === 'en' ? 'How do you want to use myTROUVEpro?' : 'Comment voulez-vous utiliser myTROUVEpro?'}
                </p>

                {/* Seeker Option */}
                <button
                  onClick={() => handleRoleSelect('seeker')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                      <Users className="text-blue-600" size={28} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t.lookingFor}</h3>
                      <p className="text-gray-500 text-sm">{t.lookingForDesc}</p>
                      <span className="text-green-600 text-sm font-medium">{t.alwaysFree}</span>
                    </div>
                  </div>
                </button>

                {/* Provider Option */}
                <button
                  onClick={() => handleRoleSelect('provider')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200">
                      <Briefcase className="text-green-600" size={28} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t.serviceProvider}</h3>
                      <p className="text-gray-500 text-sm">{t.serviceProviderDesc}</p>
                      <span className="text-green-600 text-sm font-medium">{t.freeToJoin} - {t.commission}</span>
                    </div>
                  </div>
                </button>

                <div className="text-center pt-4">
                  <span className="text-gray-500">{t.haveAccount} </span>
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {t.signIn}
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? t.signingIn : t.signIn}
                </button>

                <div className="text-center pt-2">
                  <span className="text-gray-500">{t.noAccount} </span>
                  <button
                    type="button"
                    onClick={() => setMode('choose-role')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {t.signUp}
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Provider Badge */}
                {role === 'provider' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🎉</span>
                      <div>
                        <p className="font-semibold text-green-800">{t.freeJoinProvider}</p>
                        <p className="text-sm text-green-600">{t.onlyCommission}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.firstName}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.lastName}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="(514) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.city}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Laval"
                    />
                  </div>
                </div>

                {/* Provider-specific fields */}
                {role === 'provider' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.businessName}</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Your Business Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t.selectCategory}</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {language === 'en' ? cat.name : cat.nameFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={t.descPlaceholder}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="********"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTermsAccepted(!termsAccepted)}
                    className="mt-0.5 text-gray-400 hover:text-blue-600"
                  >
                    {termsAccepted ? (
                      <CheckSquare size={24} className="text-blue-600" />
                    ) : (
                      <Square size={24} />
                    )}
                  </button>
                  <span className="text-sm text-gray-600">
                    {t.termsText}{' '}
                    <Link
                      to="/terms"
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.termsLink}
                    </Link>
                    {role === 'provider' && (
                      <span className="block text-xs text-gray-500 mt-1">
                        {language === 'en'
                          ? 'Including 10% commission and 2-day payment hold policy'
                          : 'Y compris la commission de 10% et la politique de retenue de paiement de 2 jours'}
                      </span>
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? t.creatingAccount : (role === 'provider' ? t.joinAsProvider : t.createAccount)}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('choose-role'); setRole(null); }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← {t.backToRole}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
