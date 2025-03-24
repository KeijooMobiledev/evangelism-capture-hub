
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyDownloads from '../resources/MyDownloads';
import AIFeatures from './AIFeatures';
import { BarChart3, BookOpen, Lightbulb } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AdvancedStatsProps {
  className?: string;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('ai');
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Advanced Features</CardTitle>
        </div>
        <CardDescription>
          Explore AI-powered tools for smarter evangelism
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b p-0">
            <TabsTrigger 
              value="ai" 
              className="flex items-center gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
            >
              <BarChart3 className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="downloads" 
              className="flex items-center gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
            >
              <BookOpen className="h-4 w-4" />
              My Downloads
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="p-4 pt-4">
            <AIFeatures />
          </TabsContent>
          
          <TabsContent value="downloads" className="p-4 pt-4">
            <MyDownloads />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedStats;
