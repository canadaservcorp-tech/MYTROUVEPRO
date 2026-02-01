import React from 'react';

const PrivacyPage = ({ language }) => {
  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your information',
      updated: 'Last updated: Feb 1, 2026',
      sections: [
        {
          title: 'Information we collect',
          body: 'We collect information you provide during registration, such as your name, email, phone number, and service details. We also collect information needed to deliver and improve our services.',
        },
        {
          title: 'How we use information',
          body: 'We use your information to create your account, connect you with service providers, and communicate important updates. We do not sell your personal information.',
        },
        {
          title: 'Sharing',
          body: 'We only share information with service providers when it is necessary to fulfill your requests. We may share information when required by law.',
        },
        {
          title: 'Your choices',
          body: 'You can update your account details or request deletion by contacting support. You may also opt out of marketing communications at any time.',
        },
      ],
      contact: 'Questions? Contact us at info@mytrouvepro.com.',
    },
    fr: {
      title: 'Politique de confidentialité',
      subtitle: 'Comment nous collectons, utilisons et protégeons vos informations',
      updated: 'Dernière mise à jour : 1 févr. 2026',
      sections: [
        {
          title: 'Informations collectées',
          body: 'Nous recueillons les informations fournies lors de l’inscription, telles que votre nom, courriel, téléphone et détails de service. Nous collectons également les informations nécessaires pour offrir et améliorer nos services.',
        },
        {
          title: 'Utilisation des informations',
          body: 'Nous utilisons vos informations pour créer votre compte, vous connecter avec des fournisseurs et communiquer des mises à jour importantes. Nous ne vendons pas vos informations personnelles.',
        },
        {
          title: 'Partage',
          body: 'Nous partageons uniquement les informations avec les fournisseurs lorsqu’elles sont nécessaires pour répondre à vos demandes. Nous pouvons partager des informations si la loi l’exige.',
        },
        {
          title: 'Vos choix',
          body: 'Vous pouvez mettre à jour vos informations ou demander la suppression de votre compte en contactant le support. Vous pouvez également vous désabonner des communications marketing à tout moment.',
        },
      ],
      contact: 'Des questions? Contactez-nous à info@mytrouvepro.com.',
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

export default PrivacyPage;
