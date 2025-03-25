
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PrayerJournal from '@/components/resources/PrayerJournal';
import ScriptureVerse from '@/components/resources/ScriptureVerse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, BookOpen, UsersRound } from 'lucide-react';

const PrayerJournalPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Prayer Journal</h1>
          <p className="text-muted-foreground mt-1">Track your prayer requests and answered prayers</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Main journal column */}
          <div className="md:col-span-8">
            <PrayerJournal />
          </div>

          {/* Sidebar column */}
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardContent className="p-0">
                <ScriptureVerse />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Prayer Resources
                </CardTitle>
                <CardDescription>
                  Tools to enhance your prayer life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal" className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="group" className="flex items-center gap-1.5">
                      <UsersRound className="h-4 w-4" />
                      Group
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">ACTS Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Structure your prayer with Adoration, Confession, Thanksgiving, and Supplication.
                      </p>
                    </div>
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">Prayer Walking</h3>
                      <p className="text-sm text-muted-foreground">
                        Combine physical activity with prayer by walking through areas you're evangelizing.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Lectio Divina</h3>
                      <p className="text-sm text-muted-foreground">
                        Meditative prayer where you read scripture slowly and pray through it.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="group" className="space-y-4 mt-4">
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">Prayer Circles</h3>
                      <p className="text-sm text-muted-foreground">
                        Gather in small groups to pray for specific evangelistic efforts.
                      </p>
                    </div>
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">Intercessory Prayer</h3>
                      <p className="text-sm text-muted-foreground">
                        Assign team members to pray for specific areas or people groups.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Prayer Mapping</h3>
                      <p className="text-sm text-muted-foreground">
                        Create visual maps of areas and pray systematically for each region.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrayerJournalPage;
