import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const funnelData = [
  { name: 'Awareness', value: 100, color: '#8884d8' },
  { name: 'Interest', value: 60, color: '#83a6ed' },
  { name: 'Engagement', value: 40, color: '#8dd1e1' },
  { name: 'Decision', value: 20, color: '#82ca9d' },
  { name: 'Conversion', value: 10, color: '#a4de6c' },
];

const FunnelTracking = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FunnelTracking;
