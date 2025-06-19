import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
    create_post: 'Create Post',
    my_posts: 'My Posts',
    shop: 'Shop',
    courses: 'Courses',
    contacts: 'Contacts',
    map: 'Map',
    messages: 'Messages',
    teams: 'Teams',
    admin: 'Admin',
    platform_settings: 'Platform Settings',
    saved_posts: 'Saved Posts',
    design_ai: 'AI Design',
    analytics: 'Analytics',
    features: 'Features',
    pricing: 'Pricing',
    contact_us: 'Contact Us',
    notifications: 'Notifications',
    search: 'Search',
    language: 'Language',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    home: 'Home',
    blog: 'Blog',
    store: 'Store',
    formations: 'Trainings',
    community: 'Community',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    // Add more as needed
  }
};

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
    create_post: 'Créer un post',
    my_posts: 'Mes publications',
    shop: 'Boutique',
    courses: 'Formations',
    contacts: 'Contacts',
    map: 'Carte',
    messages: 'Messages',
    teams: 'Équipes',
    admin: 'Admin',
    platform_settings: 'Réglages plateforme',
    saved_posts: 'Posts sauvegardés',
    design_ai: 'Création IA',
    analytics: 'Statistiques',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    contact_us: 'Contactez-nous',
    notifications: 'Notifications',
    search: 'Rechercher',
    language: 'Langue',
    dark_mode: 'Mode sombre',
    light_mode: 'Mode clair',
    home: 'Accueil',
    blog: 'Blog',
    store: 'Boutique',
    formations: 'Formations',
    community: 'Communauté',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Envoyer',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès',
    // Add more as needed
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
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie']
    }
  });

export default i18n;
