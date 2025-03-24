
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyDownloads from '../resources/MyDownloads';
import AIFeatures from './AIFeatures';
import { BarChart3, BookOpen } from 'lucide-react';

interface AdvancedStatsProps {
  className?: string;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('ai');
  
  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            My Downloads
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai" className="pt-3">
          <AIFeatures />
        </TabsContent>
        
        <TabsContent value="downloads" className="pt-3">
          <MyDownloads />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedStats;
