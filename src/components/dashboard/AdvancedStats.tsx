
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, Users, Target, HeartHandshake, 
  UserCheck, Clock, Calendar, TrendingUp 
} from "lucide-react";
import StatCard from "./StatCard";

const AdvancedStats = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role || 'evangelist';
  
  // Get KPIs based on user role
  const kpiData = getRoleBasedKPIs(role);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Analytics</h2>
        <Tabs defaultValue="daily" className="w-[300px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.mainStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeText={stat.changeText}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionMetrics role={role} />
        {role === 'supervisor' || role === 'community' ? <TeamPerformance /> : <PersonalGoals />}
      </div>
    </div>
  );
};

// Role-specific KPI generator
const getRoleBasedKPIs = (role: string) => {
  switch(role) {
    case 'community':
      return {
        mainStats: [
          { 
            title: "Total Evangelists", 
            value: "47", 
            icon: Users, 
            change: 15, 
            changeText: "+5 from last month" 
          },
          { 
            title: "Community Reach", 
            value: "3,842", 
            icon: Target, 
            change: 23, 
            changeText: "+842 from last month" 
          },
          { 
            title: "Conversion Rate", 
            value: "12.4%", 
            icon: TrendingUp, 
            change: 3, 
            changeText: "+1.5% improvement" 
          },
          { 
            title: "Active Campaigns", 
            value: "8", 
            icon: Calendar, 
            change: 0, 
            changeText: "Same as last month" 
          }
        ]
      };
    case 'supervisor':
      return {
        mainStats: [
          { 
            title: "Team Size", 
            value: "12", 
            icon: Users, 
            change: 20, 
            changeText: "+2 from last month" 
          },
          { 
            title: "Areas Covered", 
            value: "18", 
            icon: Target, 
            change: 5, 
            changeText: "+1 from last month" 
          },
          { 
            title: "Team Efficiency", 
            value: "87%", 
            icon: TrendingUp, 
            change: 9, 
            changeText: "+4% improvement" 
          },
          { 
            title: "Weekly Meetings", 
            value: "5", 
            icon: Calendar, 
            change: 25, 
            changeText: "+1 from last week" 
          }
        ]
      };
    default: // evangelist
      return {
        mainStats: [
          { 
            title: "People Reached", 
            value: "124", 
            icon: Users, 
            change: 18, 
            changeText: "+22 from last week" 
          },
          { 
            title: "Conversations", 
            value: "65", 
            icon: HeartHandshake, 
            change: 12, 
            changeText: "+7 from last week" 
          },
          { 
            title: "Follow-ups", 
            value: "28", 
            icon: UserCheck, 
            change: 40, 
            changeText: "+8 from last week" 
          },
          { 
            title: "Hours in Field", 
            value: "22", 
            icon: Clock, 
            change: 5, 
            changeText: "+1 from last week" 
          }
        ]
      };
  }
};

// Conversion Metrics Component
const ConversionMetrics = ({ role }: { role: string }) => {
  const metrics = [
    { name: "First Contact", value: role === 'community' ? 842 : role === 'supervisor' ? 342 : 64, percentage: 100 },
    { name: "Interested", value: role === 'community' ? 615 : role === 'supervisor' ? 258 : 41, percentage: 73 },
    { name: "Follow-up Meeting", value: role === 'community' ? 423 : role === 'supervisor' ? 187 : 28, percentage: 50 },
    { name: "Bible Study", value: role === 'community' ? 287 : role === 'supervisor' ? 112 : 18, percentage: 34 },
    { name: "Regular Attendee", value: role === 'community' ? 158 : role === 'supervisor' ? 68 : 11, percentage: 19 },
    { name: "Baptism", value: role === 'community' ? 63 : role === 'supervisor' ? 27 : 5, percentage: 7 },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{metric.name}</p>
                <p className="text-sm font-medium">{metric.value}</p>
              </div>
              <Progress 
                value={metric.percentage} 
                className="h-2" 
                indicatorClassName={
                  metric.percentage > 70 
                    ? "bg-emerald-500" 
                    : metric.percentage > 30 
                      ? "bg-amber-500" 
                      : "bg-purple-500"
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Team Performance Component
const TeamPerformance = () => {
  const teamMembers = [
    { name: "Maria Rodriguez", contacts: 86, conversion: 14, efficiency: 92 },
    { name: "John Smith", contacts: 72, conversion: 9, efficiency: 84 },
    { name: "Sarah Johnson", contacts: 64, conversion: 11, efficiency: 88 },
    { name: "David Chen", contacts: 58, conversion: 7, efficiency: 76 },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{member.name}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {member.efficiency}% Efficiency
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Contacts:</span> {member.contacts}
                </div>
                <div>
                  <span className="text-muted-foreground">Conversions:</span> {member.conversion}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Personal Goals Component
const PersonalGoals = () => {
  const goals = [
    { name: "Weekly Contacts", target: 35, current: 28, percentage: 80 },
    { name: "Bible Studies", target: 12, current: 8, percentage: 67 },
    { name: "Literature Distributed", target: 50, current: 43, percentage: 86 },
    { name: "Prayer Partners", target: 15, current: 9, percentage: 60 },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Personal Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{goal.name}</p>
                <p className="text-sm font-medium">{goal.current}/{goal.target}</p>
              </div>
              <Progress 
                value={goal.percentage} 
                className="h-2"
                indicatorClassName={
                  goal.percentage > 80 
                    ? "bg-emerald-500" 
                    : goal.percentage > 50 
                      ? "bg-amber-500" 
                      : "bg-rose-500"
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedStats;
