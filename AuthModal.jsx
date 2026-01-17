import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Briefcase, Users } from 'lucide-react';
import { useAuth } from './AuthContext-Supabase';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', language = 'en' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'choose-role'
  const [role, setRole] = useState(null); // 'seeker' or 'provider'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const content = {
    en: {
      signIn: 'Sign In',
      join: 'Join myTROUVEpro',
      providerReg: 'Provider Registration',
      createAccount: 'Create Account',
      howToUse: 'How do you want to use myTROUVEpro?',
      lookingFor: 'I\'m looking for services',
      findAndBook: 'Find and book local service providers',
      alwaysFree: 'Always FREE',
      imProvider: 'I\'m a service provider',
      listServices: 'List your services and get new clients',
      freeToJoin: 'FREE to join • 10% per booking',
      alreadyHave: 'Already have an account?',
      dontHave: 'Don\'t have an account?',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signingIn: 'Signing in...',
      creating: 'Creating account...',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      city: 'City',
      businessName: 'Business Name',
      category: 'Service Category',
      selectCategory: 'Select a category',
      description: 'Description',
      tellCustomers: 'Tell customers about your services...',
      terms: 'By signing up, you agree to our',
      tos: 'Terms of Service',
      commission: 'and 10% commission on all bookings',
      back: '← Back to role selection',
      joinAsProvider: 'Join as Provider',
      freeJoinDesc: 'FREE to join!',
      commissionDesc: 'Only 10% commission on bookings',
    },
    fr: {
      signIn: 'Connexion',
      join: 'Rejoindre myTROUVEpro',
      providerReg: 'Inscription Fournisseur',
      createAccount: 'Créer un compte',
      howToUse: 'Comment voulez-vous utiliser myTROUVEpro ?',
      lookingFor: 'Je cherche des services',
      findAndBook: 'Trouvez et réservez des fournisseurs locaux',
      alwaysFree: 'Toujours GRATUIT',
      imProvider: 'Je suis un fournisseur',
      listServices: 'Listez vos services et trouvez des clients',
      freeToJoin: 'GRATUIT • 10% par réservation',
      alreadyHave: 'Déjà un compte ?',
      dontHave: 'Pas de compte ?',
      signUp: 'S\'inscrire',
      email: 'Courriel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      signingIn: 'Connexion...',
      creating: 'Création du compte...',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      city: 'Ville',
      businessName: 'Nom de l\'entreprise',
      category: 'Catégorie de service',
      selectCategory: 'Sélectionnez une catégorie',
      description: 'Description',
      tellCustomers: 'Parlez de vos services aux clients...',
      terms: 'En vous inscrivant, vous acceptez nos',
      tos: 'Conditions d\'utilisation',
      commission: 'et 10% de commission sur les réservations',
      back: '← Retour à la sélection du rôle',
      joinAsProvider: 'Devenir Fournisseur',
      freeJoinDesc: 'GRATUIT pour s\'inscrire !',
      commissionDesc: 'Seulement 10% de commission',
    }
  };

  const t = content[language || 'en'];

  const categories = [
    { id: 'healthcare', name: language === 'en' ? 'Healthcare' : 'Santé' },
    { id: 'home', name: language === 'en' ? 'Home Services' : 'Services à domicile' },
    { id: 'auto', name: language === 'en' ? 'Auto Services' : 'Services auto' },
    { id: 'beauty', name: language === 'en' ? 'Beauty & Wellness' : 'Beauté & Bien-être' },
    { id: 'education', name: language === 'en' ? 'Education' : 'Éducation' },
    { id: 'legal', name: language === 'en' ? 'Legal' : 'Juridique' },
    { id: 'tech', name: language === 'en' ? 'Tech & IT' : 'Tech & TI' },
    { id: 'repairs', name: language === 'en' ? 'Repairs' : 'Réparations' },
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
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit faire au moins 6 caractères');
      setLoading(false);
      return;
    }

    const result = await register({
      ...formData,
      role,
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error || (language === 'en' ? 'Registration failed' : 'L\'inscription a échoué'));
    }
    setLoading(false);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setMode('register');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' && t.signIn}
              {mode === 'choose-role' && t.join}
              {mode === 'register' && (role === 'provider' ? t.providerReg : t.createAccount)}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
                  {t.howToUse}
                </p>

                {/* Seeker Option */}
                <button
                  onClick={() => handleRoleSelect('seeker')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-red-100">
                      <Users className="text-blue-600 group-hover:text-red-600" size={28} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t.lookingFor}</h3>
                      <p className="text-gray-500 text-sm">{t.findAndBook}</p>
                      <span className="text-green-600 text-sm font-medium">{t.alwaysFree}</span>
                    </div>
                  </div>
                </button>

                {/* Provider Option */}
                <button
                  onClick={() => handleRoleSelect('provider')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-red-100">
                      <Briefcase className="text-green-600 group-hover:text-red-600" size={28} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t.imProvider}</h3>
                      <p className="text-gray-500 text-sm">{t.listServices}</p>
                      <span className="text-green-600 text-sm font-medium">{t.freeToJoin}</span>
                    </div>
                  </div>
                </button>

                <div className="text-center pt-4">
                  <span className="text-gray-500">{t.alreadyHave} </span>
                  <button 
                    onClick={() => setMode('login')}
                    className="text-red-600 font-semibold hover:underline"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="••••••••"
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
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? t.signingIn : t.signIn}
                </button>

                <div className="text-center pt-2">
                  <span className="text-gray-500">{t.dontHave} </span>
                  <button 
                    type="button"
                    onClick={() => setMode('choose-role')}
                    className="text-red-600 font-semibold hover:underline"
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
                        <p className="font-semibold text-green-800">{t.freeJoinDesc}</p>
                        <p className="text-sm text-green-600">{t.commissionDesc}</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">{t.selectCategory}</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder={t.tellCustomers}
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
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="••••••••"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="text-sm text-gray-500">
                  {t.terms}{' '}
                  <a href="/terms" className="text-red-600 hover:underline">{t.tos}</a>
                  {role === 'provider' && (
                    <span> {t.commission}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? t.creating : (role === 'provider' ? t.joinAsProvider : t.createAccount)}
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => { setMode('choose-role'); setRole(null); }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t.back}
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
