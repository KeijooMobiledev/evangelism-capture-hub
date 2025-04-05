import React from "react";
import { FileText, BookOpen, Users, Video, MessageSquare, Cross, Bookmark, Calendar, Map, Mic, FileDown, BarChart, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const Features = () => {
  const { t } = useLanguage();

  const features: FeatureCard[] = [
    // Études Bibliques
    {
      title: "Lecteur Biblique",
      description: "Accès complet aux Écritures avec fonctionnalités de recherche avancée",
      icon: <BookOpen className="w-8 h-8" />,
      category: "Études Bibliques"
    },
    {
      title: "Outils d'étude",
      description: "Commentaires, concordances et dictionnaires bibliques intégrés",
      icon: <Bookmark className="w-8 h-8" />,
      category: "Études Bibliques"
    },
    
    // Interaction Communautaire
    {
      title: "Réunions de prière",
      description: "Vidéoconférences intégrées avec suivi des sujets de prière",
      icon: <Cross className="w-8 h-8" />,
      category: "Communauté"
    },
    {
      title: "Q&A Live",
      description: "Module de questions-réponses avec votes et suivi des réponses",
      icon: <MessageSquare className="w-8 h-8" />,
      category: "Communauté"
    },

    // Formations
    {
      title: "Supports de cours",
      description: "Accès aux ressources pédagogiques (PDF, vidéos, présentations)",
      icon: <FileDown className="w-8 h-8" />,
      category: "Formation"
    },
    {
      title: "Quiz interactifs",
      description: "Évaluations en temps réel avec résultats instantanés",
      icon: <BarChart className="w-8 h-8" />,
      category: "Formation"
    },

    // Gestion d'évangélisation  
    {
      title: "Événements",
      description: "Organisation et suivi des activités d'évangélisation",
      icon: <Calendar className="w-8 h-8" />,
      category: "Mission"
    },
    {
      title: "Cartographie",
      description: "Visualisation géographique des activités et ressources",
      icon: <Map className="w-8 h-8" />,
      category: "Mission"
    },

    // Ressources
    {
      title: "Médiathèque",
      description: "Bibliothèque de ressources prêtes à l'emploi",
      icon: <FileText className="w-8 h-8" />,
      category: "Ressources"
    },
    {
      title: "Enregistrements",
      description: "Archivage et partage des enseignements",
      icon: <Mic className="w-8 h-8" />,
      category: "Ressources"
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('nav.features')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'ensemble des outils conçus pour accompagner votre mission évangélique
          </p>
        </div>

        {categories.map(category => (
          <section key={category} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features
                .filter(f => f.category === category)
                .map((feature, index) => (
                  <div 
                    key={index}
                    className="border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <span className="mr-3 text-primary">
                        {feature.icon}
                      </span>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Features;
