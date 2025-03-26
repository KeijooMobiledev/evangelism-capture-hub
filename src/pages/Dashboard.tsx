import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentContacts from '@/components/dashboard/RecentContacts';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RegionalInsights from '@/components/dashboard/RegionalInsights';
import AreaPerformance from '@/components/dashboard/AreaPerformance';
import AdvancedStats from '@/components/dashboard/AdvancedStats';
import ScriptureVerse from '@/components/resources/ScriptureVerse';
import EvangelizationTips from '@/components/dashboard/EvangelizationTips';
import { useAuth } from '@/contexts/AuthContext';
import { Users, MessageSquare, Map, Calendar, BarChart3, BellRing, Sparkles, Search, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sampleContacts = [
  { id: 1, name: "John Smith", area: "Downtown", avatarUrl: "" },
  { id: 2, name: "Maria Rodriguez", area: "North Side", avatarUrl: "" },
  { id: 3, name: "David Kim", area: "East District", avatarUrl: "" },
  { id: 4, name: "Sarah Johnson", area: "West End", avatarUrl: "" },
];

const sampleEvents = [
  { id: 1, title: "Prayer Meeting", date: "Tomorrow, 6:00 PM", attendees: 12 },
  { id: 2, title: "Community Outreach", date: "Saturday, 10:00 AM", attendees: 8 },
  { id: 3, title: "Bible Study", date: "Wednesday, 7:30 PM", attendees: 15 },
];

const sampleAreas = [
  { name: "Downtown", percentage: 78, color: "#4f46e5" },
  { name: "North Side", percentage: 65, color: "#0ea5e9" },
  { name: "East District", percentage: 82, color: "#10b981" },
  { name: "West End", percentage: 56, color: "#f59e0b" },
];

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Bienvenue sur EvangelioTrack",
      description: "Votre tableau de bord est prêt avec les dernières statistiques.",
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Bienvenue, {profile?.full_name || user?.email}</h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de vos activités d'évangélisation</p>
        </div>

        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Nouveauté: Fonctionnalités d'IA ajoutées!</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Explorez nos nouvelles fonctionnalités d'intelligence artificielle pour améliorer votre évangélisation.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <StatCard 
            title="Total Contacts"
            value={189}
            change={12}
            changeText="+12% from last month"
            icon={Users}
          />
          <StatCard 
            title="Conversations"
            value={42}
            change={8}
            changeText="+8% from last month"
            icon={MessageSquare}
          />
          <StatCard 
            title="Areas Covered"
            value={12}
            change={0}
            changeText="Same as last month"
            icon={Map}
          />
          <StatCard 
            title="Upcoming Events"
            value={5}
            change={3}
            changeText="+3 from last month"
            icon={Calendar}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Activity Overview</CardTitle>
              </div>
              <CardDescription>
                Your evangelization activity over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <ScriptureVerse />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="p-0">
              <EvangelizationTips />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>
                People you've recently evangelized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentContacts contacts={sampleContacts} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your scheduled evangelistic activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingEvents events={sampleEvents} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Area Performance</CardTitle>
              <CardDescription>
                Evangelization effectiveness by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaPerformance areas={sampleAreas} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Regional Insights</CardTitle>
              <CardDescription>
                Top performing regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegionalInsights />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950 dark:to-indigo-950 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <CardTitle>IA pour l'Évangélisation</CardTitle>
              </div>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Découvrez nos outils d'IA pour améliorer votre ministère
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-purple-100 dark:border-purple-900">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
                    <Search className="h-4 w-4" /> Recherche de Scriptures
                  </h3>
                  <p className="text-sm mt-1">Trouvez des versets pertinents pour toute situation d'évangélisation.</p>
                </div>
                
                <div className="rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-indigo-100 dark:border-indigo-900">
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                    <Map className="h-4 w-4" /> Analyse de Zones
                  </h3>
                  <p className="text-sm mt-1">Identifiez les zones stratégiques pour votre ministère.</p>
                </div>
                
                <div className="rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-violet-100 dark:border-violet-900">
                  <h3 className="font-medium text-violet-800 dark:text-violet-300 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Analyses Prédictives
                  </h3>
                  <p className="text-sm mt-1">Visualisez les tendances futures pour planifier efficacement.</p>
                </div>
              </div>
              
              <button 
                onClick={() => toast({
                  title: "Fonctionnalité IA activée",
                  description: "Accédez aux outils d'IA dans la section 'Fonctionnalités avancées' ci-dessous."
                })}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer les outils d'IA
              </button>
            </CardContent>
          </Card>

          <AdvancedStats className="lg:col-span-2" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
