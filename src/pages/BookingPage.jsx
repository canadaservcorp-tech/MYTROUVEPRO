import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, Shield, Lock, Check, AlertCircle, User, Mail, Phone } from 'lucide-react';

const BookingPage = ({ language }) => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preSelectedService = searchParams.get('service') || '';
  const preSelectedPrice = searchParams.get('price') || '';

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    service: preSelectedService,
    date: '',
    time: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    // Customer info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  // Mock provider data - in production, fetch from API
  const provider = {
    id: providerId,
    name: 'ProPlumb Solutions',
    category: language === 'en' ? 'Plumbing' : 'Plomberie',
    services: [
      { name: language === 'en' ? 'Plumbing' : 'Plomberie', price: 75 },
      { name: language === 'en' ? 'Drain Cleaning' : 'Nettoyage de drains', price: 120 },
    ],
    // Contact info to be revealed after payment
    phone: '+1 (438) 555-0123',
    email: 'contact@proplumb.ca',
    fullAddress: '123 Rue Principale, Laval, QC H7V 1A1',
  };

  const content = {
    en: {
      title: 'Book Service',
      step1: 'Service & Schedule',
      step2: 'Your Information',
      step3: 'Review & Pay',

      selectService: 'Select Service',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      serviceAddress: 'Service Address',
      city: 'City',
      postalCode: 'Postal Code',
      notes: 'Additional Notes (optional)',
      notesPlaceholder: 'Describe your needs...',

      yourName: 'Your Name',
      yourEmail: 'Your Email',
      yourPhone: 'Your Phone',

      orderSummary: 'Order Summary',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      subtotal: 'Subtotal',
      tps: 'TPS/GST (5%)',
      tvq: 'TVQ/QST (9.975%)',
      total: 'Total',

      payNow: 'Pay Now',
      processing: 'Processing...',
      securePayment: 'Secure payment powered by Square',

      contactUnlock: 'Contact Details Will Be Unlocked',
      contactUnlockDesc: 'After payment, you will receive:',
      contactUnlockItems: [
        'Provider\'s phone number',
        'Provider\'s email address',
        'Exact service address',
        'Direct communication access',
      ],

      back: 'Back',
      next: 'Next',
      required: 'Required',

      morning: 'Morning (8AM-12PM)',
      afternoon: 'Afternoon (12PM-5PM)',
      evening: 'Evening (5PM-8PM)',
    },
    fr: {
      title: 'Reserver un Service',
      step1: 'Service et Horaire',
      step2: 'Vos Informations',
      step3: 'Revision et Paiement',

      selectService: 'Selectionnez un Service',
      selectDate: 'Selectionnez une Date',
      selectTime: 'Selectionnez une Heure',
      serviceAddress: 'Adresse du Service',
      city: 'Ville',
      postalCode: 'Code Postal',
      notes: 'Notes Additionnelles (optionnel)',
      notesPlaceholder: 'Decrivez vos besoins...',

      yourName: 'Votre Nom',
      yourEmail: 'Votre Courriel',
      yourPhone: 'Votre Telephone',

      orderSummary: 'Resume de la Commande',
      service: 'Service',
      date: 'Date',
      time: 'Heure',
      subtotal: 'Sous-total',
      tps: 'TPS (5%)',
      tvq: 'TVQ (9,975%)',
      total: 'Total',

      payNow: 'Payer Maintenant',
      processing: 'Traitement...',
      securePayment: 'Paiement securise par Square',

      contactUnlock: 'Coordonnees Seront Debloquees',
      contactUnlockDesc: 'Apres le paiement, vous recevrez:',
      contactUnlockItems: [
        'Numero de telephone du fournisseur',
        'Adresse courriel du fournisseur',
        'Adresse exacte du service',
        'Acces a la communication directe',
      ],

      back: 'Retour',
      next: 'Suivant',
      required: 'Obligatoire',

      morning: 'Matin (8h-12h)',
      afternoon: 'Apres-midi (12h-17h)',
      evening: 'Soir (17h-20h)',
    }
  };

  const t = content[language];

  const selectedServiceData = provider.services.find(s => s.name === formData.service) || provider.services[0];
  const subtotal = selectedServiceData?.price || 0;
  const tps = subtotal * 0.05;
  const tvq = subtotal * 0.09975;
  const total = subtotal + tps + tvq;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    // In production, this would call the Square payment API via the backend
    setTimeout(() => {
      // Navigate to success page with booking details
      navigate('/booking-success', {
        state: {
          booking: {
            provider: provider.name,
            service: formData.service,
            date: formData.date,
            time: formData.time,
            total: total.toFixed(2),
            // Unlocked contact info
            providerPhone: provider.phone,
            providerEmail: provider.email,
            providerAddress: provider.fullAddress,
          }
        }
      });
    }, 2000);
  };

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const timeSlots = [
    { value: 'morning', label: t.morning },
    { value: 'afternoon', label: t.afternoon },
    { value: 'evening', label: t.evening },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-blue-200">{provider.name} - {provider.category}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: t.step1 },
              { num: 2, label: t.step2 },
              { num: 3, label: t.step3 },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s.num < step ? 'bg-green-500 text-white' :
                  s.num === step ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s.num < step ? <Check size={20} /> : s.num}
                </div>
                <span className={`hidden sm:block ml-2 text-sm ${step === s.num ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {s.label}
                </span>
                {idx < 2 && (
                  <div className={`hidden sm:block w-16 lg:w-32 h-1 mx-4 ${s.num < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Step 1: Service & Schedule */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectService}</label>
                    <div className="space-y-2">
                      {provider.services.map((service, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.service === service.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="service"
                              value={service.name}
                              checked={formData.service === service.name}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="ml-3 font-medium">{service.name}</span>
                          </div>
                          <span className="text-green-600 font-semibold">${service.price}/hr</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      {t.selectDate}
                    </label>
                    <select
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">--</option>
                      {getAvailableDates().map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString(language === 'en' ? 'en-CA' : 'fr-CA', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-1" />
                      {t.selectTime}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, time: slot.value }))}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            formData.time === slot.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      {t.serviceAddress}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.city}</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.postalCode}</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.notes}</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder={t.notesPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Customer Info */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-1" />
                      {t.yourName}
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      {t.yourEmail}
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      {t.yourPhone}
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Pay */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Contact Unlock Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lock className="text-green-600 mt-0.5 mr-3 flex-shrink-0" size={24} />
                      <div>
                        <h4 className="font-semibold text-green-900">{t.contactUnlock}</h4>
                        <p className="text-green-700 text-sm mt-1">{t.contactUnlockDesc}</p>
                        <ul className="mt-2 space-y-1">
                          {t.contactUnlockItems.map((item, idx) => (
                            <li key={idx} className="flex items-center text-green-700 text-sm">
                              <Check size={14} className="mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{t.orderSummary}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.service}</span>
                        <span className="font-medium">{formData.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.date}</span>
                        <span className="font-medium">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.time}</span>
                        <span className="font-medium">{timeSlots.find(s => s.value === formData.time)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.serviceAddress}</span>
                        <span className="font-medium">{formData.address}, {formData.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section Placeholder */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CreditCard size={20} className="mr-2" />
                      {language === 'en' ? 'Payment Details' : 'Details de Paiement'}
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
                      {/* Square Web Payments SDK would be integrated here */}
                      <CreditCard size={32} className="mx-auto mb-2" />
                      <p className="text-sm">{language === 'en' ? 'Payment form will appear here' : 'Le formulaire de paiement apparaitra ici'}</p>
                      <p className="text-xs mt-1">{t.securePayment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t.back}
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 1 && (!formData.service || !formData.date || !formData.time)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t.processing}
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} className="mr-2" />
                        {t.payNow}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">{t.orderSummary}</h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.tps}</span>
                  <span>${tps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.tvq}</span>
                  <span>${tvq.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <span className="text-lg font-bold">{t.total}</span>
                <span className="text-lg font-bold text-green-600">${total.toFixed(2)} CAD</span>
              </div>

              <div className="mt-6 flex items-center text-xs text-gray-500">
                <Shield size={14} className="mr-1" />
                {t.securePayment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
