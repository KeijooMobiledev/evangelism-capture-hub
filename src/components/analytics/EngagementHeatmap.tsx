import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({length: 24}, (_, i) => i);

const heatmapData = days.flatMap(day => 
  hours.map(hour => ({
    day,
    hour,
    value: Math.floor(Math.random() * 50) // Sample random data
  }))
);

const getColor = (value: number) => {
  if (value < 10) return '#f0f9ff';
  if (value < 20) return '#bae6fd';
  if (value < 30) return '#7dd3fc';
  if (value < 40) return '#38bdf8';
  return '#0284c7';
};

const EngagementHeatmap = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={heatmapData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            barCategoryGap={1}
            barGap={1}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="hour" 
              reversed
              tickFormatter={(h) => `${h}:00`}
            />
            <Tooltip 
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p>Day: {data.day}</p>
                    <p>Hour: {data.hour}:00</p>
                    <p>Engagement: {data.value}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="value">
              {heatmapData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.value)}
                  width={20}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EngagementHeatmap;
