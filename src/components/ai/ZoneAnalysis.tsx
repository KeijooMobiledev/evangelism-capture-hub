
import React, { useState, useEffect } from 'react';
import { useAiEvangelism } from '@/hooks/use-ai-evangelism';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map, Clock, BarChart3, Loader2, MapPin, Calendar } from 'lucide-react';

// Sample data for demonstration purposes
const sampleRegions = [
  { id: 'downtown', name: 'Downtown' },
  { id: 'westside', name: 'Westside' },
  { id: 'north', name: 'North District' },
  { id: 'east', name: 'East Area' },
  { id: 'south', name: 'South Neighborhood' },
];

const sampleHistoricalData = {
  'downtown': [
    { contacts: 150, conversions: 12, timeOfDay: 'morning', dayOfWeek: 'Saturday', strategy: 'door-to-door', receptivity: 75 },
    { contacts: 180, conversions: 15, timeOfDay: 'afternoon', dayOfWeek: 'Sunday', strategy: 'event', receptivity: 80 },
    { contacts: 120, conversions: 8, timeOfDay: 'evening', dayOfWeek: 'Wednesday', strategy: 'street', receptivity: 65 },
  ],
  'westside': [
    { contacts: 100, conversions: 5, timeOfDay: 'morning', dayOfWeek: 'Saturday', strategy: 'door-to-door', receptivity: 55 },
    { contacts: 90, conversions: 4, timeOfDay: 'afternoon', dayOfWeek: 'Sunday', strategy: 'event', receptivity: 60 },
    { contacts: 110, conversions: 6, timeOfDay: 'evening', dayOfWeek: 'Friday', strategy: 'street', receptivity: 70 },
  ],
  'north': [
    { contacts: 130, conversions: 10, timeOfDay: 'morning', dayOfWeek: 'Saturday', strategy: 'door-to-door', receptivity: 70 },
    { contacts: 140, conversions: 12, timeOfDay: 'afternoon', dayOfWeek: 'Tuesday', strategy: 'event', receptivity: 75 },
    { contacts: 100, conversions: 7, timeOfDay: 'evening', dayOfWeek: 'Thursday', strategy: 'street', receptivity: 60 },
  ],
  'east': [
    { contacts: 80, conversions: 4, timeOfDay: 'morning', dayOfWeek: 'Monday', strategy: 'door-to-door', receptivity: 50 },
    { contacts: 95, conversions: 6, timeOfDay: 'afternoon', dayOfWeek: 'Wednesday', strategy: 'event', receptivity: 65 },
    { contacts: 75, conversions: 3, timeOfDay: 'evening', dayOfWeek: 'Sunday', strategy: 'street', receptivity: 45 },
  ],
  'south': [
    { contacts: 160, conversions: 13, timeOfDay: 'morning', dayOfWeek: 'Saturday', strategy: 'door-to-door', receptivity: 77 },
    { contacts: 170, conversions: 14, timeOfDay: 'afternoon', dayOfWeek: 'Sunday', strategy: 'event', receptivity: 79 },
    { contacts: 130, conversions: 9, timeOfDay: 'evening', dayOfWeek: 'Friday', strategy: 'street', receptivity: 68 },
  ],
};

const ZoneAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');
  
  const {
    zoneAnalysisData,
    zoneAnalysisLoading,
    zoneAnalysisError,
    analyzeZone
  } = useAiEvangelism();
  
  useEffect(() => {
    if (selectedRegion && !zoneAnalysisData) {
      handleAnalyze();
    }
  }, [selectedRegion]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to use this feature',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedRegion) {
      toast({
        title: 'Region required',
        description: 'Please select a region to analyze',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const region = sampleRegions.find(r => r.id === selectedRegion)?.name || selectedRegion;
      const historicalData = sampleHistoricalData[selectedRegion] || [];
      
      await analyzeZone({
        region,
        historicalData
      });
    } catch (error) {
      console.error('Zone analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: 'Unable to perform zone analysis. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const getRegionReceptivityColor = (region: string) => {
    const data = sampleHistoricalData[region] || [];
    if (!data.length) return 'bg-gray-200';
    
    const avgReceptivity = data.reduce((sum, item) => sum + item.receptivity, 0) / data.length;
    
    if (avgReceptivity >= 75) return 'bg-emerald-500';
    if (avgReceptivity >= 65) return 'bg-amber-500';
    if (avgReceptivity >= 55) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          AI Zone Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered recommendations for evangelization zones and times
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {sampleRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getRegionReceptivityColor(region.id)}`}></span>
                        {region.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full sm:w-1/3"
              onClick={handleAnalyze} 
              disabled={zoneAnalysisLoading || !selectedRegion}
            >
              {zoneAnalysisLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          {zoneAnalysisError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              Error: {zoneAnalysisError instanceof Error ? zoneAnalysisError.message : 'Failed to analyze zone'}
            </div>
          )}
          
          {zoneAnalysisData && (
            <div className="mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="times">Best Times</TabsTrigger>
                  <TabsTrigger value="strategies">Strategies</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="pt-4">
                  <ScrollArea className="h-[250px] rounded-md border p-4">
                    <div className="whitespace-pre-line">
                      {zoneAnalysisData.analysis}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="times" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Recommended Times</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {zoneAnalysisData.recommendedTimes.map((time, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 rounded-md border bg-muted/50"
                        >
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{time}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">
                        <p>These times are recommended based on historical reception rates and conversion success.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="strategies" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Strategy Suggestions</h3>
                    </div>
                    
                    {zoneAnalysisData.strategySuggestions.map((strategy, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Strategy {index + 1}</h4>
                          <span className="text-xs text-muted-foreground">
                            Effectiveness: {70 + index * 5}%
                          </span>
                        </div>
                        <Progress value={70 + index * 5} className="h-2" />
                        <p className="text-sm pt-1">{strategy}</p>
                        {index < zoneAnalysisData.strategySuggestions.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneAnalysis;
