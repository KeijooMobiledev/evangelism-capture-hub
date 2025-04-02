
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, Bar, Pie } from 'recharts';
import { useApi } from '@/hooks/use-api';

// Sample data for the charts
const activityData = [
  { month: 'Jan', evangelism: 65, prayer: 28, training: 15 },
  { month: 'Feb', evangelism: 59, prayer: 40, training: 20 },
  { month: 'Mar', evangelism: 80, prayer: 50, training: 35 },
  { month: 'Apr', evangelism: 81, prayer: 42, training: 22 },
  { month: 'May', evangelism: 56, prayer: 35, training: 28 },
  { month: 'Jun', evangelism: 55, prayer: 45, training: 30 },
  { month: 'Jul', evangelism: 40, prayer: 30, training: 25 },
  { month: 'Aug', evangelism: 70, prayer: 50, training: 40 },
  { month: 'Sep', evangelism: 90, prayer: 60, training: 45 },
  { month: 'Oct', evangelism: 85, prayer: 55, training: 35 },
  { month: 'Nov', evangelism: 75, prayer: 45, training: 30 },
  { month: 'Dec', evangelism: 95, prayer: 65, training: 50 },
];

const regionData = [
  { name: 'Downtown', value: 35 },
  { name: 'Suburbs', value: 25 },
  { name: 'East Side', value: 15 },
  { name: 'West Side', value: 10 },
  { name: 'Industrial Area', value: 8 },
  { name: 'University Campus', value: 7 },
];

const demographicData = [
  { age: '18-24', male: 15, female: 20 },
  { age: '25-34', male: 25, female: 30 },
  { age: '35-44', male: 20, female: 25 },
  { age: '45-54', male: 15, female: 20 },
  { age: '55-64', male: 10, female: 15 },
  { age: '65+', male: 5, female: 10 },
];

const conversionData = [
  { month: 'Jan', online: 12, inPerson: 18 },
  { month: 'Feb', online: 15, inPerson: 20 },
  { month: 'Mar', online: 20, inPerson: 25 },
  { month: 'Apr', online: 22, inPerson: 28 },
  { month: 'May', online: 18, inPerson: 24 },
  { month: 'Jun', online: 25, inPerson: 30 },
];

const resourceData = [
  { name: 'Bibles', value: 30 },
  { name: 'Tracts', value: 45 },
  { name: 'Videos', value: 15 },
  { name: 'Audio', value: 10 },
];

const AnalyticsDashboard = () => {
  const [timeFrame, setTimeFrame] = useState('year');
  const { api, isLoading } = useApi();

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track and analyze your evangelism efforts</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">128</CardTitle>
                  <CardDescription>Total Events</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 dark:text-green-400">+12% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">2,543</CardTitle>
                  <CardDescription>People Reached</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 dark:text-green-400">+8% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">42</CardTitle>
                  <CardDescription>Areas Covered</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 dark:text-green-400">+3 new areas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">78%</CardTitle>
                  <CardDescription>Follow-up Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 dark:text-green-400">+5% from previous period</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Evangelism Activities</CardTitle>
                <CardDescription>
                  Trend of evangelism activities over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Replace with actual implementation using recharts */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Activity trend chart would render here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Channels</CardTitle>
                  <CardDescription>
                    Online vs. in-person evangelism effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Conversion channels chart would render here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>
                    Distribution of evangelism resources used
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Resource utilization chart would render here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="regions" className="space-y-6 mt-6">
            {/* Regional analytics content here */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>
                  Evangelism activities by geographic region
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {/* Map visualization would go here */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Regional map visualization would render here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Regions</CardTitle>
                  <CardDescription>
                    Regions with highest evangelism success rates
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Top regions chart would render here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                  <CardDescription>
                    Regions with highest growth potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Growth opportunities chart would render here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6 mt-6">
            {/* Demographics analytics content here */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Evangelism reach by age group
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Replace with actual implementation using recharts */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Age distribution chart would render here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>
                    Evangelism reach by gender
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Gender distribution chart would render here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Background Distribution</CardTitle>
                  <CardDescription>
                    Evangelism reach by religious background
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Background distribution chart would render here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6 mt-6">
            {/* Resources analytics content here */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>
                  Types of resources used in evangelism
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Replace with actual implementation using recharts */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Resource distribution chart would render here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Effectiveness</CardTitle>
                  <CardDescription>
                    Success rates by resource type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Resource effectiveness chart would render here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Trends</CardTitle>
                  <CardDescription>
                    Changes in resource usage over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Replace with actual implementation using recharts */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Resource trends chart would render here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
