èèimport React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Map, MessageSquare, Calendar, BookOpen, GraduationCap, ShoppingBag, Sparkles, FileText, Folder, User, Settings, Shield } from 'lucide-react';

const DashboardSidebar = ({ role = 'user' }: { role?: string }) => {
  return (
    <aside className="w-64 bg-background border-r p-4 space-y-4 hidden md:block">
      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary">
          <Home className="h-5 w-5" /> Accueil
        </Link>
        <Link to="/contacts" className="flex items-center gap-2 hover:text-primary">
          <Users className="h-5 w-5" /> Mes contacts
        </Link>
        <Link to="/map" className="flex items-center gap-2 hover:text-primary">
          <Map className="h-5 w-5" /> Carte
        </Link>
        <Link to="/messages" className="flex items-center gap-2 hover:text-primary">
          <MessageSquare className="h-5 w-5" /> Messages
        </Link>
        <Link to="/events" className="flex items-center gap-2 hover:text-primary">
          <Calendar className="h-5 w-5" /> Événements
        </Link>
        <Link to="/bible-studies" className="flex items-center gap-2 hover:text-primary">
          <BookOpen className="h-5 w-5" /> Études bibliques
        </Link>
        <Link to="/courses" className="flex items-center gap-2 hover:text-primary">
          <GraduationCap className="h-5 w-5" /> Formations
        </Link>
        <Link to="/store" className="flex items-center gap-2 hover:text-primary">
          <ShoppingBag className="h-5 w-5" /> Boutique
        </Link>
        <Link to="/design" className="flex items-center gap-2 hover:text-primary">
          <Sparkles className="h-5 w-5" /> Création IA
        </Link>
        <Link to="/saved-posts" className="flex items-center gap-2 hover:text-primary">
          <FileText className="h-5 w-5" /> Mes publications
        </Link>
        <Link to="/resources" className="flex items-center gap-2 hover:text-primary">
          <Folder className="h-5 w-5" /> Ressources
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-primary">
          <User className="h-5 w-5" /> Profil
        </Link>
        <Link to="/settings" className="flex items-center gap-2 hover:text-primary">
          <Settings className="h-5 w-5" /> Paramètres
        </Link>

        {role === 'admin' && (
          <>
            <Link to="/admin" className="flex items-center gap-2 hover:text-primary">
              <Shield className="h-5 w-5" /> Admin
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-2 hover:text-primary">
              <Settings className="h-5 w-5" /> Réglages plateforme
            </Link>
            <Link to="/teams" className="flex items-center gap-2 hover:text-primary">
              <Users className="h-5 w-5" /> Équipes
            </Link>
            <Link to="/areas" className="flex items-center gap-2 hover:text-primary">
              <Map className="h-5 w-5" /> Zones
            </Link>

            <div className="mt-4 border-t pt-4 space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Gestion Église</p>
              <Link to="/church/accounts" className="flex items-center gap-2 hover:text-primary">
                <Users className="h-5 w-5" /> Comptes Églises
              </Link>
              <Link to="/church/members" className="flex items-center gap-2 hover:text-primary">
                <User className="h-5 w-5" /> Membres
              </Link>
              <Link to="/church/messages" className="flex items-center gap-2 hover:text-primary">
                <MessageSquare className="h-5 w-5" /> Messages
              </Link>
              <Link to="/church/contacts" className="flex items-center gap-2 hover:text-primary">
                <Users className="h-5 w-5" /> Contacts
              </Link>
              <Link to="/church/map" className="flex items-center gap-2 hover:text-primary">
                <Map className="h-5 w-5" /> Carte
              </Link>
              <Link to="/church/events" className="flex items-center gap-2 hover:text-primary">
                <Calendar className="h-5 w-5" /> Événements
              </Link>
              <Link to="/church/bible-studies" className="flex items-center gap-2 hover:text-primary">
                <BookOpen className="h-5 w-5" /> Études bibliques
              </Link>
              <Link to="/church/courses" className="flex items-center gap-2 hover:text-primary">
                <GraduationCap className="h-5 w-5" /> Formations
              </Link>
              <Link to="/church/store" className="flex items-center gap-2 hover:text-primary">
                <ShoppingBag className="h-5 w-5" /> Boutique
              </Link>
              <Link to="/church/posts" className="flex items-center gap-2 hover:text-primary">
                <FileText className="h-5 w-5" /> Publications
              </Link>
              <Link to="/church/stats" className="flex items-center gap-2 hover:text-primary">
                <Sparkles className="h-5 w-5" /> Statistiques
              </Link>
              <Link to="/church/settings" className="flex items-center gap-2 hover:text-primary">
                <Settings className="h-5 w-5" /> Paramètres Église
              </Link>
              <Link to="/church/history" className="flex items-center gap-2 hover:text-primary">
                <BookOpen className="h-5 w-5" /> Historique
              </Link>
              <Link to="/church/schedule" className="flex items-center gap-2 hover:text-primary">
                <Calendar className="h-5 w-5" /> Planification
              </Link>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
