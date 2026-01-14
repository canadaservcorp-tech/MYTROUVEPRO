import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = ({ language }) => {
  const content = {
    en: {
      slogan: 'Near To You',
      description: 'Connecting you with trusted local service providers in your area.',
      services: 'Services',
      company: 'Company',
      legal: 'Legal',
      contact: 'Contact',
      home: 'Home Maintenance',
      auto: 'Auto Services',
      professional: 'Professional',
      events: 'Events',
      about: 'About Us',
      careers: 'Careers',
      blog: 'Blog',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.',
      business: 'Performance Cristal Technologies Avancées S.A.',
    },
    fr: {
      slogan: 'À côté de toi',
      description: 'Vous connecter avec des fournisseurs de services locaux de confiance.',
      services: 'Services',
      company: 'Entreprise',
      legal: 'Légal',
      contact: 'Contact',
      home: 'Entretien maison',
      auto: 'Services auto',
      professional: 'Professionnel',
      events: 'Événements',
      about: 'À propos',
      careers: 'Carrières',
      blog: 'Blogue',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      rights: 'Tous droits réservés.',
      business: 'Performance Cristal Technologies Avancées S.A.',
    }
  };

  const t = content[language];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">mT</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">myTROUVE</span>
                <span className="text-xl font-bold text-green-400">pro</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">{t.description}</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.services}</h3>
            <ul className="space-y-2">
              <li><Link to="/services/home" className="hover:text-white transition-colors">{t.home}</Link></li>
              <li><Link to="/services/auto" className="hover:text-white transition-colors">{t.auto}</Link></li>
              <li><Link to="/services/professional" className="hover:text-white transition-colors">{t.professional}</Link></li>
              <li><Link to="/services/events" className="hover:text-white transition-colors">{t.events}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.company}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">{t.about}</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">{t.careers}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t.blog}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Laval, Quebec, Canada</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (438) 000-0000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@mytrouvepro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>{t.business}</p>
            <p>NEQ: 2280629637</p>
            <p>© {new Date().getFullYear()} myTROUVEpro. {t.rights}</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">{t.privacy}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
