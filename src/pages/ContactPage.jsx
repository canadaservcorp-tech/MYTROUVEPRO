import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you',
      
      getInTouch: 'Get in Touch',
      address: 'Address',
      addressValue: 'Laval, Quebec, Canada',
      phone: 'Phone',
      phoneValue: '+1 (438) 000-0000',
      email: 'Email',
      emailValue: 'info@mytrouvepro.com',
      hours: 'Business Hours',
      hoursValue: 'Mon - Fri: 9:00 AM - 6:00 PM',
      
      formTitle: 'Send us a Message',
      name: 'Your Name',
      emailLabel: 'Your Email',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      
      thankYou: 'Thank You!',
      thankYouMessage: 'Your message has been sent. We\'ll get back to you soon.',
      sendAnother: 'Send Another Message',
    },
    fr: {
      title: 'Contactez-nous',
      subtitle: 'Nous aimerions avoir de vos nouvelles',
      
      getInTouch: 'Nous Joindre',
      address: 'Adresse',
      addressValue: 'Laval, Québec, Canada',
      phone: 'Téléphone',
      phoneValue: '+1 (438) 000-0000',
      email: 'Courriel',
      emailValue: 'info@mytrouvepro.com',
      hours: 'Heures d\'Ouverture',
      hoursValue: 'Lun - Ven: 9h00 - 18h00',
      
      formTitle: 'Envoyez-nous un Message',
      name: 'Votre Nom',
      emailLabel: 'Votre Courriel',
      subject: 'Sujet',
      message: 'Votre Message',
      send: 'Envoyer le Message',
      
      thankYou: 'Merci!',
      thankYouMessage: 'Votre message a été envoyé. Nous vous répondrons bientôt.',
      sendAnother: 'Envoyer un Autre Message',
    }
  };

  const t = content[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-blue-200">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.getInTouch}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.address}</h3>
                  <p className="text-gray-600">{t.addressValue}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.email}</h3>
                  <p className="text-gray-600">{t.emailValue}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.hours}</h3>
                  <p className="text-gray-600">{t.hoursValue}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">📍 Laval, Quebec</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.thankYou}</h3>
                <p className="text-gray-600 mb-6">{t.thankYouMessage}</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.formTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailLabel}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.subject}</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.message}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <Send size={18} className="mr-2" />
                    {t.send}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
