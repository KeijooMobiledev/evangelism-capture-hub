
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScriptureSearch from '../ai/ScriptureSearch';
import ZoneAnalysis from '../ai/ZoneAnalysis';
import PredictiveAnalytics from '../ai/PredictiveAnalytics';
import { Search, Map, TrendingUp, Sparkles } from 'lucide-react';

interface AIFeaturesProps {
  className?: string;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <p className="text-sm text-muted-foreground">
          AI-powered tools to enhance your evangelism strategies
        </p>
      </div>
      
      <Tabs defaultValue="scripture">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scripture" className="flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Scripture Search</span>
            <span className="sm:hidden">Scripture</span>
          </TabsTrigger>
          <TabsTrigger value="zone" className="flex items-center gap-1.5">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Zone Analysis</span>
            <span className="sm:hidden">Zones</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Predictive Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scripture">
          <ScriptureSearch />
        </TabsContent>
        
        <TabsContent value="zone">
          <ZoneAnalysis />
        </TabsContent>
        
        <TabsContent value="analytics">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFeatures;
