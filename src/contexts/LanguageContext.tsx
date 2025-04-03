
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
    'login': 'Login',
    'register': 'Register',
    'language': 'Language',
    'english': 'English',
    'french': 'French',
    'spanish': 'Spanish',
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
    'login': 'Connexion',
    'register': 'S\'inscrire',
    'language': 'Langue',
    'english': 'Anglais',
    'french': 'Français',
    'spanish': 'Espagnol',
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
    'login': 'Iniciar sesión',
    'register': 'Registrarse',
    'language': 'Idioma',
    'english': 'Inglés',
    'french': 'Francés',
    'spanish': 'Español',
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
