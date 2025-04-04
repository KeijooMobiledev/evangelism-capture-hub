import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const metrics = [
  { id: 'conversions', label: 'Conversions' },
  { id: 'engagements', label: 'Engagements' },
  { id: 'followups', label: 'Follow-ups' },
  { id: 'resources', label: 'Resource Usage' },
  { id: 'events', label: 'Events' },
];

const timeFrames = [
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

const ReportBuilder = () => {
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [timeFrame, setTimeFrame] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const generateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Report "${reportName}" generated successfully!`);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Report Name</Label>
          <Input 
            placeholder="My Custom Report"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Time Frame</Label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger>
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              {timeFrames.map((frame) => (
                <SelectItem key={frame.value} value={frame.value}>
                  {frame.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Metrics to Include</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => toggleMetric(metric.id)}
                />
                <Label htmlFor={metric.id}>{metric.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={generateReport}
          disabled={isGenerating || selectedMetrics.length === 0}
          className="w-full"
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportBuilder;
