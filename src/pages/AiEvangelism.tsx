
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScriptureSearch from '@/components/ai/ScriptureSearch';
import ZoneAnalysis from '@/components/ai/ZoneAnalysis';
import PredictiveAnalytics from '@/components/ai/PredictiveAnalytics';

const AiEvangelism = () => {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">AI Evangelism Tools</h1>
        <p className="text-muted-foreground mb-6">Leverage artificial intelligence to enhance your evangelism efforts</p>
        
        <Tabs defaultValue="scripture">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scripture">Scripture Search</TabsTrigger>
            <TabsTrigger value="zone">Zone Analysis</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripture" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scripture Search</CardTitle>
                <CardDescription>
                  Find the perfect Bible verses for any evangelism situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScriptureSearch />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="zone" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Zone Analysis</CardTitle>
                <CardDescription>
                  Analyze geographic areas to optimize evangelism efforts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ZoneAnalysis />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictive" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>
                  Forecast evangelism trends and outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictiveAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AiEvangelism;
