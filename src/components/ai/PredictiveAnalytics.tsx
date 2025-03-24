
import React, { useState } from 'react';
import { useAiEvangelism } from '@/hooks/use-ai-evangelism';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Loader2, Target, Users, ArrowRight } from 'lucide-react';

// Sample data for demonstration purposes
const targetAreas = [
  { id: 'downtown', name: 'Downtown' },
  { id: 'westside', name: 'Westside' },
  { id: 'north', name: 'North District' },
  { id: 'east', name: 'East Area' },
  { id: 'south', name: 'South Neighborhood' },
  { id: 'university', name: 'University Campus' },
  { id: 'suburban', name: 'Suburban District' },
];

const strategies = [
  { id: 'door-to-door', name: 'Door-to-Door Visits' },
  { id: 'street-evangelism', name: 'Street Evangelism' },
  { id: 'community-events', name: 'Community Events' },
  { id: 'digital-outreach', name: 'Digital Outreach' },
  { id: 'service-projects', name: 'Service Projects' },
  { id: 'bible-studies', name: 'Small Group Bible Studies' },
  { id: 'youth-programs', name: 'Youth-Focused Programs' },
];

const sampleHistoricalData = [
  { region: 'Downtown', strategy: 'Door-to-Door Visits', contacts: 350, conversions: 28, timeframe: 'Last Month' },
  { region: 'Downtown', strategy: 'Community Events', contacts: 520, conversions: 47, timeframe: 'Last Month' },
  { region: 'Westside', strategy: 'Street Evangelism', contacts: 280, conversions: 19, timeframe: 'Last Month' },
  { region: 'North District', strategy: 'Digital Outreach', contacts: 650, conversions: 32, timeframe: 'Last Month' },
  { region: 'East Area', strategy: 'Service Projects', contacts: 180, conversions: 21, timeframe: 'Last Month' },
  { region: 'South Neighborhood', strategy: 'Small Group Bible Studies', contacts: 120, conversions: 34, timeframe: 'Last Month' },
  { region: 'University Campus', strategy: 'Youth-Focused Programs', contacts: 410, conversions: 37, timeframe: 'Last Month' },
];

const PredictiveAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [targetArea, setTargetArea] = useState('');
  const [strategy, setStrategy] = useState('');
  
  const {
    predictiveAnalyticsData,
    predictiveAnalyticsLoading,
    predictiveAnalyticsError,
    predictImpact
  } = useAiEvangelism();

  const handlePredict = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to use this feature',
        variant: 'destructive'
      });
      return;
    }
    
    if (!targetArea || !strategy) {
      toast({
        title: 'Missing information',
        description: 'Please select both a target area and strategy',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await predictImpact({
        historicalData: sampleHistoricalData,
        targetArea: targetAreas.find(a => a.id === targetArea)?.name || targetArea,
        strategy: strategies.find(s => s.id === strategy)?.name || strategy
      });
    } catch (error) {
      console.error('Predictive analytics error:', error);
      toast({
        title: 'Prediction failed',
        description: 'Unable to generate prediction. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          AI Predictive Analytics
        </CardTitle>
        <CardDescription>
          Forecast evangelization impact based on area and approach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Target Area</label>
              <Select value={targetArea} onValueChange={setTargetArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target area" />
                </SelectTrigger>
                <SelectContent>
                  {targetAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">Evangelism Strategy</label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handlePredict} 
            disabled={predictiveAnalyticsLoading || !targetArea || !strategy}
            className="w-full"
          >
            {predictiveAnalyticsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Predict Impact
              </>
            )}
          </Button>
          
          {predictiveAnalyticsError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              Error: {predictiveAnalyticsError instanceof Error ? predictiveAnalyticsError.message : 'Failed to generate prediction'}
            </div>
          )}
          
          {predictiveAnalyticsData && (
            <div className="mt-4 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Predicted Outcomes</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Contact Rate</span>
                      <span className="font-medium">{predictiveAnalyticsData.metrics.contactRate}</span>
                    </div>
                    <Progress value={Math.min(predictiveAnalyticsData.metrics.contactRate, 100)} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium">{predictiveAnalyticsData.metrics.conversionRate}%</span>
                    </div>
                    <Progress value={predictiveAnalyticsData.metrics.conversionRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium">{predictiveAnalyticsData.metrics.growthRate}%</span>
                    </div>
                    <Progress value={predictiveAnalyticsData.metrics.growthRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Overall Effectiveness</span>
                      <span className="font-medium">{predictiveAnalyticsData.metrics.effectiveness}%</span>
                    </div>
                    <Progress value={predictiveAnalyticsData.metrics.effectiveness} className="h-2" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Detailed Prediction</h3>
                </div>
                
                <ScrollArea className="h-[150px] rounded-md border p-4">
                  <div className="whitespace-pre-line">
                    {predictiveAnalyticsData.prediction}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs">
                  Apply to Campaign <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
