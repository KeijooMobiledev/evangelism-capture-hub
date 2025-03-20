
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { name: "Mon", visits: 24, contacts: 10, followUps: 5 },
  { name: "Tue", visits: 36, contacts: 15, followUps: 8 },
  { name: "Wed", visits: 48, contacts: 20, followUps: 12 },
  { name: "Thu", visits: 42, contacts: 18, followUps: 9 },
  { name: "Fri", visits: 54, contacts: 23, followUps: 14 },
  { name: "Sat", visits: 30, contacts: 12, followUps: 7 },
  { name: "Sun", visits: 18, contacts: 8, followUps: 3 },
];

const areaData = [
  { name: "Jan", value: 68 },
  { name: "Feb", value: 92 },
  { name: "Mar", value: 134 },
  { name: "Apr", value: 98 },
  { name: "May", value: 156 },
  { name: "Jun", value: 127 },
  { name: "Jul", value: 166 },
  { name: "Aug", value: 145 },
  { name: "Sep", value: 178 },
  { name: "Oct", value: 165 },
  { name: "Nov", value: 143 },
  { name: "Dec", value: 136 },
];

interface ActivityChartProps {
  className?: string;
}

const ActivityChart = ({ className }: ActivityChartProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Evangelization Activity</CardTitle>
        <Tabs defaultValue="weekly">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="h-8">
              <TabsTrigger value="bar" className="text-xs">Bar</TabsTrigger>
              <TabsTrigger value="area" className="text-xs">Area</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Download Report
            </Button>
          </div>
          
          <TabsContent value="bar" className="h-[300px]">
            <ChartContainer 
              className="h-full" 
              config={{
                visits: {
                  label: "Visits",
                  theme: {
                    light: "#8B5CF6",
                    dark: "#A78BFA",
                  },
                },
                contacts: {
                  label: "Contacts",
                  theme: {
                    light: "#F97316",
                    dark: "#FB923C",
                  },
                },
                followUps: {
                  label: "Follow Ups",
                  theme: {
                    light: "#10B981",
                    dark: "#34D399",
                  },
                },
              }}
            >
              <BarChart
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="var(--color-visits)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={8}
                />
                <Bar 
                  dataKey="contacts" 
                  fill="var(--color-contacts)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={8}
                />
                <Bar 
                  dataKey="followUps" 
                  fill="var(--color-followUps)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={8}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconSize={8}
                  iconType="circle"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                    />
                  }
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="area" className="h-[300px]">
            <ChartContainer 
              className="h-full" 
              config={{
                value: {
                  label: "Total Activity",
                  theme: {
                    light: "rgba(139, 92, 246, 0.7)",
                    dark: "rgba(167, 139, 250, 0.7)",
                  },
                },
              }}
            >
              <AreaChart 
                data={areaData} 
                margin={{
                  top: 0,
                  right: 0,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Houses</span>
            <span className="text-lg font-bold">1,297</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Receptive</span>
            <span className="text-lg font-bold">483</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Follow-ups</span>
            <span className="text-lg font-bold">145</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
