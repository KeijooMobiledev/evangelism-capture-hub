import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    bible_studies: 'Bible Studies',
    events: 'Events',
    resources: 'Resources',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    // Add more translations as needed
  }
};

// French translations
const fr = {
  translation: {
    welcome: 'Bienvenue',
    login: 'Connexion',
    register: 'S\'inscrire',
    dashboard: 'Tableau de bord',
    bible_studies: 'Études bibliques',
    events: 'Événements',
    resources: 'Ressources',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    // Add more translations as needed
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie']
    }
  });

export default i18n;
