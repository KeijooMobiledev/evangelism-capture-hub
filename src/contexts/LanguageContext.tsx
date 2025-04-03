
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'es';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations object
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.map': 'Map',
    'nav.messages': 'Messages',
    'nav.events': 'Events',
    'nav.contact': 'Contact',
    'nav.pricing': 'Pricing',
    'nav.features': 'Features',
    'nav.api-docs': 'API Docs',
    'nav.blog': 'Blog',
    'login': 'Login',
    'register': 'Register',
    'language': 'Language',
    'english': 'English',
    'french': 'French',
    'spanish': 'Spanish',
    'blog.read_more': 'Read More',
    'blog.view_all': 'View All Articles',
    'blog.featured': 'Featured',
    'blog.latest': 'Latest Articles',
    'blog.search': 'Search',
    'blog.categories': 'Categories',
    'blog.tags': 'Tags',
    'blog.related': 'Related Articles',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.map': 'Carte',
    'nav.messages': 'Messages',
    'nav.events': 'Événements',
    'nav.contact': 'Contact',
    'nav.pricing': 'Tarification',
    'nav.features': 'Fonctionnalités',
    'nav.api-docs': 'Docs API',
    'nav.blog': 'Blog',
    'login': 'Connexion',
    'register': 'S\'inscrire',
    'language': 'Langue',
    'english': 'Anglais',
    'french': 'Français',
    'spanish': 'Espagnol',
    'blog.read_more': 'Lire Plus',
    'blog.view_all': 'Voir Tous Les Articles',
    'blog.featured': 'À la une',
    'blog.latest': 'Derniers Articles',
    'blog.search': 'Rechercher',
    'blog.categories': 'Catégories',
    'blog.tags': 'Étiquettes',
    'blog.related': 'Articles Connexes',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.map': 'Mapa',
    'nav.messages': 'Mensajes',
    'nav.events': 'Eventos',
    'nav.contact': 'Contacto',
    'nav.pricing': 'Precios',
    'nav.features': 'Características',
    'nav.api-docs': 'Documentación API',
    'nav.blog': 'Blog',
    'login': 'Iniciar sesión',
    'register': 'Registrarse',
    'language': 'Idioma',
    'english': 'Inglés',
    'french': 'Francés',
    'spanish': 'Español',
    'blog.read_more': 'Leer Más',
    'blog.view_all': 'Ver Todos Los Artículos',
    'blog.featured': 'Destacados',
    'blog.latest': 'Últimos Artículos',
    'blog.search': 'Buscar',
    'blog.categories': 'Categorías',
    'blog.tags': 'Etiquetas',
    'blog.related': 'Artículos Relacionados',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
