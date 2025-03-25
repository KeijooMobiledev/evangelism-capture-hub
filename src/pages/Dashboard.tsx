
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
import { Users, MessageSquare, Map, Calendar, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name || user?.email}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your evangelization activities</p>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <StatCard 
            title="Total Contacts"
            value="189"
            change="+12% from last month"
            positive={true}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard 
            title="Conversations"
            value="42"
            change="+8% from last month"
            positive={true}
            icon={<MessageSquare className="h-5 w-5" />}
          />
          <StatCard 
            title="Areas Covered"
            value="12"
            change="Same as last month"
            positive={false}
            icon={<Map className="h-5 w-5" />}
          />
          <StatCard 
            title="Upcoming Events"
            value="5"
            change="+3 from last month"
            positive={true}
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Activity Chart */}
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

          {/* Scripture Verse */}
          <Card>
            <CardContent className="p-0">
              <ScriptureVerse />
            </CardContent>
          </Card>

          {/* Evangelization Tips */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="p-0">
              <EvangelizationTips />
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>
                People you've recently evangelized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentContacts />
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your scheduled evangelistic activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingEvents />
            </CardContent>
          </Card>

          {/* Area Performance */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Area Performance</CardTitle>
              <CardDescription>
                Evangelization effectiveness by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaPerformance />
            </CardContent>
          </Card>

          {/* Regional Insights */}
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

          {/* Advanced Stats */}
          <AdvancedStats className="lg:col-span-2" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
