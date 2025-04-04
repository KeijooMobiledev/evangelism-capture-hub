import React from 'react';
import ScriptureRecommender from '../ai/ScriptureRecommender';
import ScriptureSearch from '../ai/ScriptureSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search } from 'lucide-react';

const BibleStudyTool = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Bible Study Tools</h2>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Search Scriptures
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <BookOpen className="h-4 w-4 mr-2" />
            Recommended Verses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-6">
          <ScriptureSearch />
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          <ScriptureRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BibleStudyTool;
