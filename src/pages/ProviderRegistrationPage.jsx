import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Plus, X, Check, AlertCircle, Shield, Briefcase } from 'lucide-react';
import { QUEBEC_PROFESSIONS, getCategories } from '../data/professions';

const ProviderRegistrationPage = ({ language }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Location
    address: '',
    city: '',
    postalCode: '',
    serviceRadius: '25',
    // Services (up to 3)
    services: [{ category: '', profession: '', customProfession: '', description: '', price: '' }],
    // Profile
    profilePhoto: null,
    portfolioPhotos: [],
    bio: '',
    experience: '',
    // Agreement
    agreedToTerms: false,
    agreedToPhotoPolicy: false,
  });
  const [errors, setErrors] = useState({});

  const content = {
    en: {
      title: 'Become a Service Provider',
      subtitle: 'Join our network and grow your business',

      step1: 'Personal Information',
      step2: 'Location & Service Area',
      step3: 'Your Services (Up to 3)',
      step4: 'Profile & Photos',
      step5: 'Review & Submit',

      businessName: 'Business Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',

      address: 'Street Address',
      city: 'City',
      postalCode: 'Postal Code',
      serviceRadius: 'Service Radius (km)',

      category: 'Service Category',
      profession: 'Profession/Service',
      customProfession: 'Custom Profession (if not in list)',
      description: 'Service Description',
      price: 'Starting Price (CAD)',
      addService: 'Add Another Service',
      removeService: 'Remove',
      maxServices: 'Maximum 3 services per account',
      servicesHint: 'You can offer up to 3 different services',

      profilePhoto: 'Profile Photo',
      portfolioPhotos: 'Portfolio Photos (up to 5)',
      bio: 'About Your Business',
      experience: 'Years of Experience',

      photoPolicy: 'Photo Policy Agreement',
      photoPolicyText: 'I confirm that my photos do not contain any personal contact information (phone numbers, email addresses, websites). All contact must go through myTROUVEpro to protect both providers and customers.',
      termsText: 'I agree to the Terms of Service and Privacy Policy',

      next: 'Next',
      back: 'Back',
      submit: 'Submit Registration',

      contactProtection: 'Contact Protection',
      contactProtectionText: 'Your contact details will only be visible to customers after they complete a paid booking. This protects your privacy and ensures serious inquiries only.',

      successTitle: 'Registration Submitted!',
      successText: 'Your registration is being reviewed. You will receive an email once approved.',

      selectCategory: 'Select a category',
      selectProfession: 'Select a profession',
      orEnterCustom: 'Or enter a custom profession',

      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      invalidPhone: 'Please enter a valid phone number',
    },
    fr: {
      title: 'Devenez Fournisseur de Services',
      subtitle: 'Rejoignez notre reseau et developpez votre entreprise',

      step1: 'Informations Personnelles',
      step2: 'Emplacement et Zone de Service',
      step3: 'Vos Services (Jusqu\'a 3)',
      step4: 'Profil et Photos',
      step5: 'Revision et Soumission',

      businessName: 'Nom de l\'Entreprise',
      firstName: 'Prenom',
      lastName: 'Nom',
      email: 'Adresse Courriel',
      phone: 'Numero de Telephone',

      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code Postal',
      serviceRadius: 'Rayon de Service (km)',

      category: 'Categorie de Service',
      profession: 'Profession/Service',
      customProfession: 'Profession Personnalisee (si non listee)',
      description: 'Description du Service',
      price: 'Prix de Depart (CAD)',
      addService: 'Ajouter un Service',
      removeService: 'Supprimer',
      maxServices: 'Maximum 3 services par compte',
      servicesHint: 'Vous pouvez offrir jusqu\'a 3 services differents',

      profilePhoto: 'Photo de Profil',
      portfolioPhotos: 'Photos Portfolio (jusqu\'a 5)',
      bio: 'A Propos de Votre Entreprise',
      experience: 'Annees d\'Experience',

      photoPolicy: 'Accord sur la Politique de Photos',
      photoPolicyText: 'Je confirme que mes photos ne contiennent aucune information de contact personnelle (numeros de telephone, adresses courriel, sites web). Tous les contacts doivent passer par myTROUVEpro pour proteger les fournisseurs et les clients.',
      termsText: 'J\'accepte les Conditions d\'Utilisation et la Politique de Confidentialite',

      next: 'Suivant',
      back: 'Retour',
      submit: 'Soumettre l\'Inscription',

      contactProtection: 'Protection des Contacts',
      contactProtectionText: 'Vos coordonnees ne seront visibles qu\'apres qu\'un client ait complete une reservation payee. Cela protege votre vie privee et assure des demandes serieuses uniquement.',

      successTitle: 'Inscription Soumise!',
      successText: 'Votre inscription est en cours de revision. Vous recevrez un courriel une fois approuve.',

      selectCategory: 'Selectionnez une categorie',
      selectProfession: 'Selectionnez une profession',
      orEnterCustom: 'Ou entrez une profession personnalisee',

      required: 'Ce champ est obligatoire',
      invalidEmail: 'Veuillez entrer un courriel valide',
      invalidPhone: 'Veuillez entrer un numero de telephone valide',
    }
  };

  const t = content[language];
  const categories = getCategories(language);
  const professionData = QUEBEC_PROFESSIONS[language];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };

    // Reset profession when category changes
    if (field === 'category') {
      updatedServices[index].profession = '';
      updatedServices[index].customProfession = '';
    }

    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    if (formData.services.length < 3) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { category: '', profession: '', customProfession: '', description: '', price: '' }]
      }));
    }
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, services: updatedServices }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.businessName) newErrors.businessName = t.required;
      if (!formData.firstName) newErrors.firstName = t.required;
      if (!formData.lastName) newErrors.lastName = t.required;
      if (!formData.email) newErrors.email = t.required;
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.invalidEmail;
      if (!formData.phone) newErrors.phone = t.required;
    }

    if (stepNum === 2) {
      if (!formData.address) newErrors.address = t.required;
      if (!formData.city) newErrors.city = t.required;
      if (!formData.postalCode) newErrors.postalCode = t.required;
    }

    if (stepNum === 3) {
      formData.services.forEach((service, index) => {
        if (!service.category) newErrors[`service_${index}_category`] = t.required;
        if (!service.profession && !service.customProfession) newErrors[`service_${index}_profession`] = t.required;
      });
    }

    if (stepNum === 4) {
      if (!formData.bio) newErrors.bio = t.required;
    }

    if (stepNum === 5) {
      if (!formData.agreedToTerms) newErrors.agreedToTerms = t.required;
      if (!formData.agreedToPhotoPolicy) newErrors.agreedToPhotoPolicy = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(5)) {
      // In production, this would send to the backend
      console.log('Registration data:', formData);
      setStep(6); // Success step
    }
  };

  const getProfessionsForCategory = (categoryId) => {
    if (!categoryId || !professionData[categoryId]) return [];
    return professionData[categoryId].professions;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.step1}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase size={16} className="inline mr-1" />
                {t.businessName}
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="inline mr-1" />
                  {t.firstName}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.lastName}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail size={16} className="inline mr-1" />
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" />
                {t.phone}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.step2}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" />
                {t.address}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.city}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.postalCode}</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.serviceRadius}</label>
              <select
                name="serviceRadius"
                value={formData.serviceRadius}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
                <option value="0">{language === 'en' ? 'All Quebec' : 'Tout le Quebec'}</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{t.step3}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.servicesHint}</p>
            </div>

            {formData.services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}

                <h4 className="font-medium text-gray-700 mb-4">
                  {language === 'en' ? `Service ${index + 1}` : `Service ${index + 1}`}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                    <select
                      value={service.category}
                      onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors[`service_${index}_category`] ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">{t.selectCategory}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                    {errors[`service_${index}_category`] && <p className="text-red-500 text-sm mt-1">{errors[`service_${index}_category`]}</p>}
                  </div>

                  {service.category && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.profession}</label>
                      <select
                        value={service.profession}
                        onChange={(e) => handleServiceChange(index, 'profession', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors[`service_${index}_profession`] ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">{t.selectProfession}</option>
                        {getProfessionsForCategory(service.category).map(prof => (
                          <option key={prof} value={prof}>{prof}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.orEnterCustom}</label>
                    <input
                      type="text"
                      value={service.customProfession}
                      onChange={(e) => handleServiceChange(index, 'customProfession', e.target.value)}
                      placeholder={t.customProfession}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.price}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {formData.services.length < 3 && (
              <button
                type="button"
                onClick={addService}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                {t.addService}
              </button>
            )}

            {formData.services.length >= 3 && (
              <p className="text-center text-gray-500 text-sm">{t.maxServices}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.step4}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Camera size={16} className="inline mr-1" />
                {t.profilePhoto}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer">
                <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">{language === 'en' ? 'Click to upload' : 'Cliquez pour telecharger'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.portfolioPhotos}</label>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 cursor-pointer">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.bio}</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.experience}</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{language === 'en' ? 'Select...' : 'Selectionnez...'}</option>
                <option value="1">{language === 'en' ? '< 1 year' : '< 1 an'}</option>
                <option value="2">1-2 {language === 'en' ? 'years' : 'ans'}</option>
                <option value="5">3-5 {language === 'en' ? 'years' : 'ans'}</option>
                <option value="10">6-10 {language === 'en' ? 'years' : 'ans'}</option>
                <option value="15">10+ {language === 'en' ? 'years' : 'ans'}</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">{t.step5}</h3>

            {/* Contact Protection Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-blue-900">{t.contactProtection}</h4>
                  <p className="text-blue-700 text-sm mt-1">{t.contactProtectionText}</p>
                </div>
              </div>
            </div>

            {/* Photo Policy Agreement */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToPhotoPolicy"
                  checked={formData.agreedToPhotoPolicy}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-5 w-5"
                />
                <div>
                  <span className="font-semibold text-yellow-900">{t.photoPolicy}</span>
                  <p className="text-yellow-700 text-sm mt-1">{t.photoPolicyText}</p>
                </div>
              </label>
              {errors.agreedToPhotoPolicy && <p className="text-red-500 text-sm mt-2">{errors.agreedToPhotoPolicy}</p>}
            </div>

            {/* Terms Agreement */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mr-3 h-5 w-5"
                />
                <span className="text-gray-700">{t.termsText}</span>
              </label>
              {errors.agreedToTerms && <p className="text-red-500 text-sm mt-2">{errors.agreedToTerms}</p>}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{language === 'en' ? 'Summary' : 'Resume'}</h4>
              <div className="space-y-2 text-sm">
                <p><strong>{t.businessName}:</strong> {formData.businessName}</p>
                <p><strong>{language === 'en' ? 'Name' : 'Nom'}:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>{t.city}:</strong> {formData.city}</p>
                <p><strong>{language === 'en' ? 'Services' : 'Services'}:</strong></p>
                <ul className="ml-4 list-disc">
                  {formData.services.map((s, i) => (
                    <li key={i}>{s.profession || s.customProfession || '-'}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
            <p className="text-gray-600 mb-8">{t.successText}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {language === 'en' ? 'Return Home' : 'Retour a l\'Accueil'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-blue-200">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        {step <= 5 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s < step ? 'bg-green-500 text-white' :
                    s === step ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {s < step ? <Check size={20} /> : s}
                  </div>
                  {s < 5 && (
                    <div className={`hidden sm:block w-16 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            {step <= 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 && step < 6 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t.back}
                  </button>
                )}
                {step === 1 && <div />}

                {step < 5 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    {t.next}
                  </button>
                )}

                {step === 5 && (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    {t.submit}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationPage;
