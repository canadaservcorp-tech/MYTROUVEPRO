import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, Phone, Mail, MapPin, Calendar, Clock, Download, Share2 } from 'lucide-react';

const BookingSuccessPage = ({ language }) => {
  const location = useLocation();
  const booking = location.state?.booking || {};

  const content = {
    en: {
      title: 'Booking Confirmed!',
      subtitle: 'Your payment was successful',
      bookingId: 'Booking ID',

      contactUnlocked: 'Contact Information Unlocked',
      contactUnlockedDesc: 'You can now contact the service provider directly:',

      bookingDetails: 'Booking Details',
      provider: 'Provider',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      total: 'Total Paid',

      nextSteps: 'Next Steps',
      nextStepsItems: [
        'Contact the provider to confirm the appointment',
        'Prepare the service area for the provider\'s arrival',
        'Have your booking confirmation ready',
      ],

      downloadReceipt: 'Download Receipt',
      shareBooking: 'Share Booking',

      backHome: 'Back to Home',
      viewProviders: 'View More Providers',

      callNow: 'Call Now',
      sendEmail: 'Send Email',
      viewMap: 'View on Map',
    },
    fr: {
      title: 'Reservation Confirmee!',
      subtitle: 'Votre paiement a ete effectue avec succes',
      bookingId: 'ID de Reservation',

      contactUnlocked: 'Coordonnees Debloquees',
      contactUnlockedDesc: 'Vous pouvez maintenant contacter le fournisseur directement:',

      bookingDetails: 'Details de la Reservation',
      provider: 'Fournisseur',
      service: 'Service',
      date: 'Date',
      time: 'Heure',
      total: 'Total Paye',

      nextSteps: 'Prochaines Etapes',
      nextStepsItems: [
        'Contactez le fournisseur pour confirmer le rendez-vous',
        'Preparez la zone de service pour l\'arrivee du fournisseur',
        'Ayez votre confirmation de reservation prete',
      ],

      downloadReceipt: 'Telecharger le Recu',
      shareBooking: 'Partager la Reservation',

      backHome: 'Retour a l\'Accueil',
      viewProviders: 'Voir Plus de Fournisseurs',

      callNow: 'Appeler',
      sendEmail: 'Envoyer un Courriel',
      viewMap: 'Voir sur la Carte',
    }
  };

  const t = content[language];

  // Generate a mock booking ID
  const bookingId = `MTP-${Date.now().toString(36).toUpperCase()}`;

  const timeLabels = {
    en: {
      morning: 'Morning (8AM-12PM)',
      afternoon: 'Afternoon (12PM-5PM)',
      evening: 'Evening (5PM-8PM)',
    },
    fr: {
      morning: 'Matin (8h-12h)',
      afternoon: 'Apres-midi (12h-17h)',
      evening: 'Soir (17h-20h)',
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-green-100">{t.subtitle}</p>
          <div className="mt-4 inline-block bg-green-700 px-4 py-2 rounded-lg">
            <span className="text-green-200 text-sm">{t.bookingId}: </span>
            <span className="font-mono font-bold">{bookingId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 -mt-8">
        {/* Contact Information Card - UNLOCKED */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-green-400">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t.contactUnlocked}</h2>
              <p className="text-gray-600 text-sm">{t.contactUnlockedDesc}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Phone */}
            <a
              href={`tel:${booking.providerPhone}`}
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Phone className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">{t.callNow}</p>
                <p className="font-semibold text-gray-900">{booking.providerPhone || '+1 (438) 555-0123'}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${booking.providerEmail}`}
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Mail className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">{t.sendEmail}</p>
                <p className="font-semibold text-gray-900">{booking.providerEmail || 'contact@provider.ca'}</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <MapPin className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">{t.viewMap}</p>
                <p className="font-semibold text-gray-900 text-sm">{booking.providerAddress || '123 Rue, Laval, QC'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.bookingDetails}</h2>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">{t.provider}</span>
              <span className="font-semibold">{booking.provider || 'ProPlumb Solutions'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">{t.service}</span>
              <span className="font-semibold">{booking.service || 'Plumbing'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                {t.date}
              </div>
              <span className="font-semibold">
                {booking.date ? new Date(booking.date).toLocaleDateString(language === 'en' ? 'en-CA' : 'fr-CA', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'January 20, 2026'}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2" />
                {t.time}
              </div>
              <span className="font-semibold">
                {booking.time ? timeLabels[language][booking.time] : 'Morning (8AM-12PM)'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-900 font-semibold">{t.total}</span>
              <span className="text-2xl font-bold text-green-600">${booking.total || '88.47'} CAD</span>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.nextSteps}</h2>
          <ul className="space-y-3">
            {t.nextStepsItems.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="flex-1 flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={20} className="mr-2" />
            {t.downloadReceipt}
          </button>
          <button className="flex-1 flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 size={20} className="mr-2" />
            {t.shareBooking}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            {t.backHome}
          </Link>
          <Link
            to="/providers"
            className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            {t.viewProviders}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
