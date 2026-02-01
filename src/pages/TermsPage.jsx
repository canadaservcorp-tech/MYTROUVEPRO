import React from 'react';

const TermsPage = ({ language }) => {
  const content = {
    en: {
      title: 'Terms of Service',
      subtitle: 'Please review these terms before using our platform',
      updated: 'Last updated: Feb 1, 2026',
      sections: [
        {
          title: 'Using our platform',
          body: 'By using myTROUVEpro, you agree to provide accurate information and use the platform responsibly. You are responsible for maintaining the confidentiality of your account.',
        },
        {
          title: 'Service providers',
          body: 'Providers must deliver services in good faith and comply with applicable laws. We may suspend accounts that violate our guidelines.',
        },
        {
          title: 'Payments and fees',
          body: 'Any fees or commissions are disclosed before you confirm a booking. Payment processing may be handled by trusted third-party providers.',
        },
        {
          title: 'Limitation of liability',
          body: 'myTROUVEpro is not liable for disputes between users and providers. We work to maintain a safe marketplace, but services are performed by independent providers.',
        },
      ],
      contact: 'If you have questions about these terms, contact us at info@mytrouvepro.com.',
    },
    fr: {
      title: 'Conditions d’utilisation',
      subtitle: 'Veuillez lire ces conditions avant d’utiliser notre plateforme',
      updated: 'Dernière mise à jour : 1 févr. 2026',
      sections: [
        {
          title: 'Utilisation de la plateforme',
          body: 'En utilisant myTROUVEpro, vous acceptez de fournir des informations exactes et d’utiliser la plateforme de manière responsable. Vous êtes responsable de la confidentialité de votre compte.',
        },
        {
          title: 'Fournisseurs de services',
          body: 'Les fournisseurs doivent offrir leurs services de bonne foi et respecter les lois applicables. Nous pouvons suspendre les comptes qui enfreignent nos directives.',
        },
        {
          title: 'Paiements et frais',
          body: 'Les frais ou commissions sont indiqués avant la confirmation d’une réservation. Le traitement des paiements peut être assuré par des tiers de confiance.',
        },
        {
          title: 'Limitation de responsabilité',
          body: 'myTROUVEpro n’est pas responsable des litiges entre utilisateurs et fournisseurs. Nous travaillons à maintenir un marché sûr, mais les services sont réalisés par des fournisseurs indépendants.',
        },
      ],
      contact: 'Pour toute question concernant ces conditions, contactez-nous à info@mytrouvepro.com.',
    },
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-blue-200">{t.subtitle}</p>
          <p className="text-sm text-blue-200 mt-2">{t.updated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {t.sections.map((section, index) => (
          <section key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
        <p className="text-gray-600">{t.contact}</p>
      </div>
    </div>
  );
};

export default TermsPage;
