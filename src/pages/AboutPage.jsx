import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage = ({ language }) => {
  const content = {
    en: {
      title: 'About myTROUVEpro',
      subtitle: 'Connecting communities with trusted local services',
      
      missionTitle: 'Our Mission',
      missionText: 'To create a seamless bridge between service seekers and trusted local providers, making it easier than ever to find quality services in your community.',
      
      storyTitle: 'Our Story',
      storyText1: 'myTROUVEpro was founded with a simple idea: finding reliable local service providers shouldn\'t be difficult. Based in Laval, Quebec, we understand the challenges of finding trustworthy professionals for your home and business needs.',
      storyText2: 'We\'ve built a platform that verifies providers, facilitates transparent reviews, and connects you with the best professionals in your area.',
      
      valuesTitle: 'Our Values',
      values: [
        { icon: Users, title: 'Community First', desc: 'We prioritize local businesses and community connections.' },
        { icon: Target, title: 'Quality Service', desc: 'Every provider is vetted to ensure top-quality service.' },
        { icon: Award, title: 'Trust & Transparency', desc: 'Real reviews from real customers you can trust.' },
        { icon: Heart, title: 'Customer Care', desc: 'Your satisfaction is our top priority.' },
      ],
      
      teamTitle: 'Based in Quebec',
      teamText: 'myTROUVEpro is proudly operated by Performance Cristal Technologies Avancées S.A., based in Laval, Quebec. We\'re committed to serving the Canadian community.',
      
      neq: 'NEQ: 2280629637',
    },
    fr: {
      title: 'À propos de myTROUVEpro',
      subtitle: 'Connecter les communautés avec des services locaux de confiance',
      
      missionTitle: 'Notre Mission',
      missionText: 'Créer un pont transparent entre les chercheurs de services et les fournisseurs locaux de confiance, rendant plus facile que jamais de trouver des services de qualité dans votre communauté.',
      
      storyTitle: 'Notre Histoire',
      storyText1: 'myTROUVEpro a été fondé avec une idée simple: trouver des fournisseurs de services locaux fiables ne devrait pas être difficile. Basés à Laval, Québec, nous comprenons les défis de trouver des professionnels dignes de confiance.',
      storyText2: 'Nous avons construit une plateforme qui vérifie les fournisseurs, facilite les avis transparents et vous connecte avec les meilleurs professionnels de votre région.',
      
      valuesTitle: 'Nos Valeurs',
      values: [
        { icon: Users, title: 'Communauté d\'Abord', desc: 'Nous priorisons les entreprises locales et les connexions communautaires.' },
        { icon: Target, title: 'Service de Qualité', desc: 'Chaque fournisseur est vérifié pour assurer un service de qualité.' },
        { icon: Award, title: 'Confiance & Transparence', desc: 'De vrais avis de vrais clients auxquels vous pouvez faire confiance.' },
        { icon: Heart, title: 'Soin du Client', desc: 'Votre satisfaction est notre priorité.' },
      ],
      
      teamTitle: 'Basé au Québec',
      teamText: 'myTROUVEpro est fièrement exploité par Performance Cristal Technologies Avancées S.A., basée à Laval, Québec. Nous sommes engagés à servir la communauté canadienne.',
      
      neq: 'NEQ: 2280629637',
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative text-white py-16 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-blue-100 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.missionTitle}</h2>
          <p className="text-xl text-gray-600 leading-relaxed">{t.missionText}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.storyTitle}</h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>{t.storyText1}</p>
            <p>{t.storyText2}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t.valuesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Company */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t.teamTitle}</h2>
          <p className="text-xl text-blue-200 mb-4">{t.teamText}</p>
          <p className="text-blue-300">{t.neq}</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
