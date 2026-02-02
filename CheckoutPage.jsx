import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShoppingCart, User, Mail, Phone, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';

const CheckoutPage = ({ language }) => {
  const navigate = useNavigate();
  const { items, total, gst, qst, grandTotal, itemCount, setBooking } = useCart();
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Laval',
    postalCode: '',
    date: '',
    time: '',
    notes: '',
  });

  const content = {
    en: {
      checkout: 'Checkout',
      backToCart: 'Back to Cart',
      step1: 'Your Information',
      step2: 'Payment',
      step3: 'Confirmation',
      paymentUnavailableTitle: 'Payments temporarily unavailable',
      paymentUnavailableMessage: 'We are finalizing our new payment provider. You can confirm your booking now and pay later.',
      confirmBooking: 'Confirm Booking (Pay Later)',
      backToInfo: 'Back to information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time',
      notes: 'Additional Notes',
      notesPlaceholder: 'Any special instructions...',
      continueToPayment: 'Continue to Payment',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      gst: 'GST (5%)',
      qst: 'QST (9.975%)',
      total: 'Total',
      emptyCart: 'Your cart is empty',
      browseServices: 'Browse Services',
      successTitle: 'Booking Confirmed!',
      successMessage: 'Thank you for your order. You will receive a confirmation email shortly.',
      bookingRef: 'Booking Reference',
      returnHome: 'Return to Home',
      viewBooking: 'View My Bookings',
      required: 'Required',
    },
    fr: {
      checkout: 'Paiement',
      backToCart: 'Retour au panier',
      step1: 'Vos Informations',
      step2: 'Paiement',
      step3: 'Confirmation',
      paymentUnavailableTitle: 'Paiements temporairement indisponibles',
      paymentUnavailableMessage: 'Nous finalisons notre nouveau fournisseur de paiement. Vous pouvez confirmer votre réservation maintenant et payer plus tard.',
      confirmBooking: 'Confirmer la réservation (payer plus tard)',
      backToInfo: 'Retour aux informations',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Courriel',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code Postal',
      preferredDate: 'Date préférée',
      preferredTime: 'Heure préférée',
      notes: 'Notes additionnelles',
      notesPlaceholder: 'Instructions spéciales...',
      continueToPayment: 'Continuer au paiement',
      orderSummary: 'Résumé de la commande',
      subtotal: 'Sous-total',
      gst: 'TPS (5%)',
      qst: 'TVQ (9.975%)',
      total: 'Total',
      emptyCart: 'Votre panier est vide',
      browseServices: 'Parcourir les services',
      successTitle: 'Réservation Confirmée!',
      successMessage: 'Merci pour votre commande. Vous recevrez un courriel de confirmation.',
      bookingRef: 'Référence de réservation',
      returnHome: 'Retour à l\'accueil',
      viewBooking: 'Voir mes réservations',
      required: 'Requis',
    }
  };

  const t = content[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setBooking(formData);
    setStep(2);
  };

  const handleConfirmBooking = () => {
    setStep(3);
  };

  // Empty cart view
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.emptyCart}</h2>
          <Link
            to="/services"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            {t.browseServices}
          </Link>
        </div>
      </div>
    );
  }

  // Success view
  if (step === 3) {
    const bookingRef = `MTP-${Date.now().toString(36).toUpperCase()}`;
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.successTitle}</h1>
            <p className="text-gray-600 mb-6">{t.successMessage}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t.bookingRef}</p>
              <p className="text-2xl font-mono font-bold text-blue-600">{bookingRef}</p>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                {t.returnHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            {t.backToCart}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t.checkout}</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="ml-2 font-medium">{t.step1}</span>
            </div>
            <div className={`w-20 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="ml-2 font-medium">{t.step2}</span>
            </div>
            <div className={`w-20 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="ml-2 font-medium">{t.step3}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleContinueToPayment} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <User className="mr-2 text-blue-600" size={24} />
                  {t.step1}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.firstName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.lastName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail size={14} className="inline mr-1" />
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone size={14} className="inline mr-1" />
                      {t.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={14} className="inline mr-1" />
                    {t.address} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.city}</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.postalCode}</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="H7X 1X1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar size={14} className="inline mr-1" />
                      {t.preferredDate}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock size={14} className="inline mr-1" />
                      {t.preferredTime}
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">--</option>
                      <option value="morning">8:00 - 12:00</option>
                      <option value="afternoon">12:00 - 17:00</option>
                      <option value="evening">17:00 - 20:00</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={t.notesPlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t.continueToPayment}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 mt-1" size={22} />
                  <div>
                    <h2 className="text-lg font-semibold text-yellow-800">
                      {t.paymentUnavailableTitle}
                    </h2>
                    <p className="text-sm text-yellow-700 mt-2">
                      {t.paymentUnavailableMessage}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {t.backToInfo}
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="inline-flex items-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    {t.confirmBooking}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">{t.orderSummary}</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {item.icon || '🔧'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.gst}</span>
                  <span>${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.qst}</span>
                  <span>${qst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t.total}</span>
                  <span className="text-blue-600">${grandTotal.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
