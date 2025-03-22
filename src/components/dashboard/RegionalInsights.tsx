
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const RegionalInsights = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role || 'evangelist';
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Regional Insights</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Tabs defaultValue="map" className="w-[180px]">
            <TabsList className="grid h-8 grid-cols-2">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map">
          <TabsContent value="map" className="mt-0">
            <div className="relative h-[300px] w-full bg-muted/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Interactive map visualization will be shown here</p>
                </div>
              </div>
              
              {/* Map Hotspots - These would be positioned properly with actual map integration */}
              <div className="absolute top-1/4 left-1/3">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
                  <div className="absolute -inset-1 h-6 w-6 rounded-full bg-primary opacity-30 animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-1/2 left-2/3">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-amber-500 animate-pulse"></div>
                  <div className="absolute -inset-1 h-6 w-6 rounded-full bg-amber-500 opacity-30 animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-3/4 left-1/4">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="absolute -inset-1 h-6 w-6 rounded-full bg-emerald-500 opacity-30 animate-ping"></div>
                </div>
              </div>
              
              <Link to="/map" className="absolute inset-0 z-10">
                <div className="absolute bottom-4 right-4">
                  <Button size="sm">View Full Map</Button>
                </div>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <RegionCard 
                name="Downtown"
                stats={{
                  contacted: 287,
                  bibleStudies: 45,
                  conversions: 18,
                  receptivity: 76
                }}
                highlight="High receptivity area"
                color="emerald"
              />
              <RegionCard 
                name="Westside"
                stats={{
                  contacted: 164,
                  bibleStudies: 23,
                  conversions: 8,
                  receptivity: 52
                }}
                highlight="Growing interest"
                color="amber"
              />
              <RegionCard 
                name="North District"
                stats={{
                  contacted: 219,
                  bibleStudies: 31,
                  conversions: 12,
                  receptivity: 64
                }}
                highlight="Needs more workers"
                color="purple"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0 space-y-4">
            {['Downtown', 'Westside', 'North District', 'Industrial Zone', 'University Area', 'Suburban District'].map((region, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    i % 3 === 0 ? 'bg-emerald-500/20 text-emerald-500' : 
                    i % 3 === 1 ? 'bg-amber-500/20 text-amber-500' : 
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{region}</p>
                    <p className="text-sm text-muted-foreground">
                      {120 + (i * 40)} contacts, {15 + (i * 5)} follow-ups
                    </p>
                  </div>
                </div>
                <Link to="/map">
                  <Button variant="ghost" size="sm" className="h-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RegionCardProps {
  name: string;
  stats: {
    contacted: number;
    bibleStudies: number;
    conversions: number;
    receptivity: number;
  };
  highlight: string;
  color: 'emerald' | 'amber' | 'purple';
}

const RegionCard = ({ name, stats, highlight, color }: RegionCardProps) => {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          color === 'emerald' ? 'bg-emerald-500/20 text-emerald-500' :
          color === 'amber' ? 'bg-amber-500/20 text-amber-500' :
          'bg-purple-500/20 text-purple-500'
        }`}>
          {highlight}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 text-sm mb-3">
        <div>
          <p className="text-muted-foreground">Contacted</p>
          <p className="font-medium">{stats.contacted}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Bible Studies</p>
          <p className="font-medium">{stats.bibleStudies}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Conversions</p>
          <p className="font-medium">{stats.conversions}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Receptivity</p>
          <p className="font-medium">{stats.receptivity}%</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span>Receptivity Score</span>
          <span>{stats.receptivity}%</span>
        </div>
        <Progress 
          value={stats.receptivity} 
          className="h-1.5" 
          indicatorClassName={
            color === 'emerald' ? 'bg-emerald-500' :
            color === 'amber' ? 'bg-amber-500' :
            'bg-purple-500'
          }
        />
      </div>
      
      <div className="mt-3 pt-3 border-t border-border flex justify-end">
        <Link to="/map">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            View on Map
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RegionalInsights;
