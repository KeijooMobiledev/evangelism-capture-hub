
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BibleReader from '@/components/bible/BibleReader';
import BibleSearch from '@/components/bible/BibleSearch';
import BibleCommentary from '@/components/bible/BibleCommentary';
import BibleStudyPlanner from '@/components/bible/BibleStudyPlanner';
import BibleStudyTool from '@/components/bible/BibleStudyTool';
import { Book, Search, FileText, CalendarCheck } from 'lucide-react';

const BibleStudies = () => {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Bible Studies Tools</h1>
        <p className="text-muted-foreground mb-6">
          Explore, study, and understand the Bible with our comprehensive set of tools
        </p>
        
        <Tabs defaultValue="ai-tools" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="ai-tools" className="flex items-center gap-1.5">
              <Book className="h-4 w-4" />
              <span>AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="reader" className="flex items-center gap-1.5">
              <Book className="h-4 w-4" />
              <span>Bible Reader</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              <span>Bible Search</span>
            </TabsTrigger>
            <TabsTrigger value="commentary" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Commentary</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4" />
              <span>Study Planner</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-tools">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Bible Study</CardTitle>
                <CardDescription>
                  Search scriptures and get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BibleStudyTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reader">
            <Card>
              <CardHeader>
                <CardTitle>Bible Reader</CardTitle>
                <CardDescription>
                  Read the Bible in multiple translations and versions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BibleReader />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Bible Search</CardTitle>
                <CardDescription>
                  Search for specific verses, words, or phrases across the Bible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BibleSearch />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="commentary">
            <Card>
              <CardHeader>
                <CardTitle>Bible Commentary</CardTitle>
                <CardDescription>
                  Access explanations and interpretations from trusted sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BibleCommentary />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planner">
            <Card>
              <CardHeader>
                <CardTitle>Study Planner</CardTitle>
                <CardDescription>
                  Plan and track your Bible study progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BibleStudyPlanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BibleStudies;
