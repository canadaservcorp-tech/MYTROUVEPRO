import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, DollarSign, Clock, Lock, AlertCircle } from 'lucide-react';

const TermsPage = ({ language = 'en' }) => {
  const content = {
    en: {
      title: 'Terms and Conditions',
      subtitle: 'Please read these terms carefully before using myTROUVEpro',
      lastUpdated: 'Last updated: January 2026',
      backHome: 'Back to Home',
      sections: [
        {
          icon: Shield,
          title: '1. Acceptance of Terms',
          content: `By accessing and using myTROUVEpro, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our platform.

Both Seekers (users looking for services) and Providers (service professionals) must accept these terms to use the platform. Registration is FREE for both Seekers and Providers - there are no subscription fees.`
        },
        {
          icon: DollarSign,
          title: '2. Commission and Payment Structure',
          content: `Platform Commission: myTROUVEpro takes a 10% commission on every completed booking. This commission covers platform maintenance, payment processing, customer support, and marketing.

Provider Payout: Service providers receive 90% of the booking amount. Payments are processed within 2 business days after service completion to allow for customer confirmation and any potential disputes.

Payment Protection: All payments are securely processed through our platform. Providers must have a registered bank account to receive payouts.

Refunds: In case of service cancellation or disputes, refunds are processed according to our cancellation policy. The platform commission may be retained for administrative costs.`
        },
        {
          icon: Clock,
          title: '3. Payment Hold Policy',
          content: `Two-Day Hold: All provider payments are held for 2 business days after service completion before being released. This hold period ensures:

- Customers have time to confirm satisfactory service delivery
- Any disputes can be reviewed before payment release
- Protection for both parties in case of issues

After the 2-day hold period, payments are automatically transferred to the provider's registered bank account.`
        },
        {
          icon: Lock,
          title: '4. Contact Information Protection',
          content: `Hidden Contact Information: To ensure secure transactions through our platform, all provider contact information (phone numbers, email addresses) is hidden from public view until a booking is paid.

Photo Protection: All provider photos are watermarked with "myTROUVEpro" to prevent unauthorized sharing and ensure platform integrity. Photos containing visible contact information may be blocked or removed.

Communication: We encourage all booking-related communication to happen through our platform to ensure proper documentation and protection for both parties.`
        },
        {
          icon: AlertCircle,
          title: '5. User Responsibilities',
          content: `Seekers (Service Users):
- Provide accurate contact and booking information
- Make timely payments for booked services
- Report any service issues within 24 hours of completion
- Respect provider schedules and cancellation policies

Providers (Service Professionals):
- Maintain accurate profile and service information
- Provide services as described in listings
- Respond to booking requests promptly
- Complete services professionally and on time
- Keep bank account information updated for payouts`
        },
        {
          icon: Shield,
          title: '6. Platform Rules',
          content: `Prohibited Activities:
- Sharing personal contact information before booking is paid
- Attempting to conduct transactions outside the platform
- Posting false or misleading information
- Harassment or inappropriate behavior
- Creating multiple accounts
- Fraudulent bookings or cancellations

Violations may result in account suspension or termination.`
        }
      ],
      summary: {
        title: 'Summary of Key Terms',
        points: [
          'Registration is FREE for both Seekers and Providers',
          '10% platform commission on all bookings',
          'Providers receive 90% of booking amount',
          '2-day payment hold after service completion',
          'Contact info hidden until booking is paid',
          'All photos are watermarked for protection',
          'By registering, you agree to these terms'
        ]
      },
      contact: {
        title: 'Questions?',
        text: 'If you have any questions about these Terms and Conditions, please contact us at',
        email: 'support@mytrouvepro.com'
      },
      companyInfo: {
        name: 'Performance Cristal Technologies Avancées S.A.',
        neq: 'NEQ: 2280629637',
        location: 'Laval, Quebec, Canada'
      }
    },
    fr: {
      title: 'Termes et Conditions',
      subtitle: 'Veuillez lire attentivement ces conditions avant d\'utiliser myTROUVEpro',
      lastUpdated: 'Dernière mise à jour: Janvier 2026',
      backHome: 'Retour à l\'accueil',
      sections: [
        {
          icon: Shield,
          title: '1. Acceptation des Termes',
          content: `En accédant et en utilisant myTROUVEpro, vous acceptez d'être lié par ces Termes et Conditions. Si vous n'acceptez pas ces termes, vous ne pouvez pas utiliser notre plateforme.

Les Chercheurs (utilisateurs cherchant des services) et les Fournisseurs (professionnels de services) doivent accepter ces termes pour utiliser la plateforme. L'inscription est GRATUITE pour les Chercheurs et les Fournisseurs - il n'y a pas de frais d'abonnement.`
        },
        {
          icon: DollarSign,
          title: '2. Commission et Structure de Paiement',
          content: `Commission de la plateforme: myTROUVEpro prélève une commission de 10% sur chaque réservation complétée. Cette commission couvre la maintenance de la plateforme, le traitement des paiements, le support client et le marketing.

Paiement des fournisseurs: Les fournisseurs de services reçoivent 90% du montant de la réservation. Les paiements sont traités dans les 2 jours ouvrables suivant la fin du service pour permettre la confirmation du client et les litiges potentiels.

Protection des paiements: Tous les paiements sont traités de manière sécurisée via notre plateforme. Les fournisseurs doivent avoir un compte bancaire enregistré pour recevoir les paiements.

Remboursements: En cas d'annulation de service ou de litiges, les remboursements sont traités selon notre politique d'annulation. La commission de la plateforme peut être conservée pour les frais administratifs.`
        },
        {
          icon: Clock,
          title: '3. Politique de Retenue de Paiement',
          content: `Retenue de deux jours: Tous les paiements des fournisseurs sont retenus pendant 2 jours ouvrables après la fin du service avant d'être libérés. Cette période de retenue garantit:

- Les clients ont le temps de confirmer la livraison satisfaisante du service
- Tout litige peut être examiné avant la libération du paiement
- Protection pour les deux parties en cas de problèmes

Après la période de retenue de 2 jours, les paiements sont automatiquement transférés sur le compte bancaire enregistré du fournisseur.`
        },
        {
          icon: Lock,
          title: '4. Protection des Informations de Contact',
          content: `Informations de contact cachées: Pour assurer des transactions sécurisées via notre plateforme, toutes les informations de contact des fournisseurs (numéros de téléphone, adresses e-mail) sont cachées de la vue publique jusqu'à ce qu'une réservation soit payée.

Protection des photos: Toutes les photos des fournisseurs portent un filigrane "myTROUVEpro" pour empêcher le partage non autorisé et assurer l'intégrité de la plateforme. Les photos contenant des informations de contact visibles peuvent être bloquées ou supprimées.

Communication: Nous encourageons toute communication liée aux réservations à se faire via notre plateforme pour assurer une documentation appropriée et une protection pour les deux parties.`
        },
        {
          icon: AlertCircle,
          title: '5. Responsabilités des Utilisateurs',
          content: `Chercheurs (Utilisateurs de services):
- Fournir des informations de contact et de réservation exactes
- Effectuer des paiements à temps pour les services réservés
- Signaler tout problème de service dans les 24 heures suivant la fin
- Respecter les horaires des fournisseurs et les politiques d'annulation

Fournisseurs (Professionnels de services):
- Maintenir des informations de profil et de service exactes
- Fournir les services tels que décrits dans les annonces
- Répondre rapidement aux demandes de réservation
- Effectuer les services de manière professionnelle et à temps
- Garder les informations bancaires à jour pour les paiements`
        },
        {
          icon: Shield,
          title: '6. Règles de la Plateforme',
          content: `Activités interdites:
- Partager des informations de contact personnelles avant que la réservation soit payée
- Tenter d'effectuer des transactions en dehors de la plateforme
- Publier des informations fausses ou trompeuses
- Harcèlement ou comportement inapproprié
- Créer plusieurs comptes
- Réservations ou annulations frauduleuses

Les violations peuvent entraîner la suspension ou la résiliation du compte.`
        }
      ],
      summary: {
        title: 'Résumé des Termes Clés',
        points: [
          'L\'inscription est GRATUITE pour les Chercheurs et les Fournisseurs',
          'Commission de 10% de la plateforme sur toutes les réservations',
          'Les fournisseurs reçoivent 90% du montant de la réservation',
          'Retenue de paiement de 2 jours après la fin du service',
          'Informations de contact cachées jusqu\'au paiement de la réservation',
          'Toutes les photos portent un filigrane pour la protection',
          'En vous inscrivant, vous acceptez ces termes'
        ]
      },
      contact: {
        title: 'Questions?',
        text: 'Si vous avez des questions sur ces Termes et Conditions, veuillez nous contacter à',
        email: 'support@mytrouvepro.com'
      },
      companyInfo: {
        name: 'Performance Cristal Technologies Avancées S.A.',
        neq: 'NEQ: 2280629637',
        location: 'Laval, Québec, Canada'
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
            <ArrowLeft size={20} className="mr-2" />
            {t.backHome}
          </Link>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-blue-200">{t.subtitle}</p>
          <p className="text-sm text-blue-300 mt-2">{t.lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Key Terms Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">{t.summary.title}</h2>
          <ul className="space-y-2">
            {t.summary.points.map((point, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <span className="text-green-500 mr-2">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Full Terms */}
        <div className="space-y-8">
          {t.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <section.icon className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">{t.contact.title}</h3>
          <p className="text-gray-600">
            {t.contact.text}{' '}
            <a href={`mailto:${t.contact.email}`} className="text-blue-600 hover:underline">
              {t.contact.email}
            </a>
          </p>
        </div>

        {/* Company Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="font-medium">{t.companyInfo.name}</p>
          <p>{t.companyInfo.neq}</p>
          <p>{t.companyInfo.location}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
