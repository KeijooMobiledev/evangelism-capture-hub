
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  BarChart3, 
  Users, 
  Map as MapIcon, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  BellRing, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown, 
  Search,
  Filter,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MapboxMap from '@/components/map/MapboxMap';
import LocationTracker from '@/components/map/LocationTracker';
import HouseMarker from '@/components/map/HouseMarker';
import EvangelistMarker from '@/components/map/EvangelistMarker';
import HeatmapLayer from '@/components/map/HeatmapLayer';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xxOHlyZnUyMDB6eTJrcTQzN3I1dm44aCJ9.jbSNL0eJVG_h9Px7qQJQaQ';

interface Evangelist {
  id: string;
  name: string;
  position: [number, number];
  color: string;
  online: boolean;
  lastActive: string;
}

interface VisitedHouse {
  id: string;
  position: [number, number];
  receptivity: 'high' | 'medium' | 'low';
  notes: string;
  visitedAt: string;
  evangelistId: string;
}

interface MapArea {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  totalHouses: number;
  visitedHouses: number;
  highReceptivity: number;
  activeEvangelists: number;
}

const sampleEvangelists: Evangelist[] = [
  { id: '1', name: 'John Smith', position: [-74.006, 40.7128], color: 'blue', online: true, lastActive: new Date().toISOString() },
  { id: '2', name: 'Maria Garcia', position: [-74.009, 40.7135], color: 'green', online: true, lastActive: new Date().toISOString() },
  { id: '3', name: 'David Lee', position: [-74.0055, 40.7115], color: 'yellow', online: false, lastActive: new Date(Date.now() - 3600000).toISOString() }
];

const sampleHouses: VisitedHouse[] = [
  { id: '1', position: [-74.005, 40.713], receptivity: 'high', notes: 'Very interested in Bible study', visitedAt: new Date().toISOString(), evangelistId: '1' },
  { id: '2', position: [-74.0045, 40.7125], receptivity: 'medium', notes: 'Accepted literature', visitedAt: new Date().toISOString(), evangelistId: '2' },
  { id: '3', position: [-74.006, 40.7122], receptivity: 'low', notes: 'Not interested', visitedAt: new Date().toISOString(), evangelistId: '3' },
  { id: '4', position: [-74.0065, 40.7128], receptivity: 'high', notes: 'Wants to join church', visitedAt: new Date().toISOString(), evangelistId: '1' },
  { id: '5', position: [-74.0035, 40.7132], receptivity: 'medium', notes: 'Asked questions about faith', visitedAt: new Date().toISOString(), evangelistId: '2' }
];

const sampleArea: MapArea = {
  id: '1',
  name: 'Riverdale District',
  bounds: [[-74.01, 40.71], [-74.00, 40.72]],
  totalHouses: 157,
  visitedHouses: 89,
  highReceptivity: 45,
  activeEvangelists: 3
};

const MapPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(sampleArea);
  const [evangelists, setEvangelists] = useState<Evangelist[]>(sampleEvangelists);
  const [houses, setHouses] = useState<VisitedHouse[]>(sampleHouses);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapToken, setMapToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateEvangelistLocation = (evangelistId: string, position: [number, number]) => {
    setEvangelists(prevEvangelists => 
      prevEvangelists.map(ev => 
        ev.id === evangelistId 
          ? { ...ev, position, lastActive: new Date().toISOString(), online: true } 
          : ev
      )
    );
  };
  
  const heatmapData = {
    type: 'FeatureCollection',
    features: houses.map(house => ({
      type: 'Feature',
      properties: {
        intensity: house.receptivity === 'high' ? 3 : house.receptivity === 'medium' ? 2 : 1
      },
      geometry: {
        type: 'Point',
        coordinates: house.position
      }
    }))
  } as GeoJSON.FeatureCollection;
  
  const handleMapLoaded = () => {
    setIsMapLoaded(true);
    if (selectedArea) {
      // We can add logic to fit map to bounds here when we have a real map instance
    }
  };
  
  const handleLocationAdded = (location: { lng: number; lat: number; receptivity: 'high' | 'medium' | 'low' }) => {
    const newHouse: VisitedHouse = {
      id: Date.now().toString(),
      position: [location.lng, location.lat],
      receptivity: location.receptivity,
      notes: 'New visited house',
      visitedAt: new Date().toISOString(),
      evangelistId: user?.id || '1'
    };
    
    setHouses([...houses, newHouse]);
  };
  
  const handleLocationShared = (location: { lng: number; lat: number; userId: string }) => {
    updateEvangelistLocation('1', [location.lng, location.lat]);
    
    toast({
      title: 'Location shared',
      description: 'Your current location has been updated on the map',
    });
  };
  
  // Simulate realtime updates for evangelists
  useEffect(() => {
    const interval = setInterval(() => {
      setEvangelists(prevEvangelists => 
        prevEvangelists.map(ev => {
          if (ev.online && ev.id !== '1') { // Don't move the current user automatically
            const newLng = ev.position[0] + (Math.random() - 0.5) * 0.001;
            const newLat = ev.position[1] + (Math.random() - 0.5) * 0.001;
            return { ...ev, position: [newLng, newLat] };
          }
          return ev;
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Subscribe to presence channel for realtime tracking
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase.channel('evangelists-map');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('Presence state updated:', presenceState);
        
        // Update evangelists based on presence data
        Object.keys(presenceState).forEach(key => {
          presenceState[key].forEach((presence: any) => {
            if (presence.location) {
              updateEvangelistLocation(
                presence.user_id, 
                [presence.location.lng, presence.location.lat]
              );
            }
          });
        });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside 
        className={`bg-sidebar border-r border-border transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } relative`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 rounded-full"></div>
                <span className="relative text-white font-bold text-lg">E</span>
              </div>
              <span className={`text-lg font-semibold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                EvangelioTrack
              </span>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleSidebar}
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
          </div>
          
          <div className="p-3">
            <LocationTracker onLocationShared={handleLocationShared} />
          </div>
          
          <nav className="flex-1 py-3">
            <div className="px-3 pb-2">
              {isSidebarOpen && <p className="text-xs text-muted-foreground px-3 pb-1">Main</p>}
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Dashboard</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/people" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Users className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>People</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="flex items-center text-sm px-3 py-2 bg-primary/10 text-primary rounded-md">
                    <MapIcon className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Map</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Messages</span>}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="px-3 py-2">
              {isSidebarOpen && <p className="text-xs text-muted-foreground px-3 pb-1">Features</p>}
              <ul className="space-y-1">
                <li>
                  <Link to="/calendar" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Calendar className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Calendar</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Resources</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/notifications" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BellRing className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Notifications</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Settings className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Settings</span>}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="p-3 mt-auto border-t border-border">
            <div className={`flex items-center justify-between ${isSidebarOpen ? '' : 'flex-col'}`}>
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                
                {isSidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">Sarah Connor</p>
                    <p className="text-xs text-muted-foreground">Community Admin</p>
                  </div>
                )}
              </div>
              
              {isSidebarOpen && (
                <Button variant="ghost" size="icon" className="rounded-full">
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search address or area..." 
                className="pl-9 w-[300px] h-9 bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </header>
        
        {!mapToken || mapToken.includes('exampleuser') ? (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="max-w-md p-6 rounded-lg bg-background border border-border shadow-sm">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-center mb-2">Mapbox token required</h3>
              <p className="text-muted-foreground text-center mb-4">
                This is a demo using a placeholder Mapbox token. For a real implementation, you would need to create a Mapbox account and get your own access token.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="mapbox-token" className="text-sm font-medium">
                    Enter your Mapbox token:
                  </label>
                  <Input 
                    id="mapbox-token"
                    value={mapToken}
                    onChange={(e) => setMapToken(e.target.value)}
                    placeholder="Enter Mapbox token here" 
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Visit <a href="https://mapbox.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a> to sign up and get your own token.
                  </p>
                </div>
                <Button className="w-full" disabled={!mapToken || mapToken === MAPBOX_ACCESS_TOKEN}>
                  Apply Token
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative overflow-hidden">
            <MapboxMap 
              accessToken={mapToken}
              initialCenter={[-74.006, 40.7128]}
              initialZoom={14}
              onMapLoaded={handleMapLoaded}
              onLocationAdded={handleLocationAdded}
            />
            
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg max-w-xs shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Map Layers</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <button 
                  className={`flex items-center justify-between w-full p-2 rounded-md ${
                    activeLayer === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveLayer('all')}
                >
                  <span className="text-sm">All Activities</span>
                  {activeLayer === 'all' && <Check className="h-4 w-4" />}
                </button>
                
                <button 
                  className={`flex items-center justify-between w-full p-2 rounded-md ${
                    activeLayer === 'evangelists' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveLayer('evangelists')}
                >
                  <span className="text-sm">Evangelists</span>
                  {activeLayer === 'evangelists' && <Check className="h-4 w-4" />}
                </button>
                
                <button 
                  className={`flex items-center justify-between w-full p-2 rounded-md ${
                    activeLayer === 'houses' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveLayer('houses')}
                >
                  <span className="text-sm">Visited Houses</span>
                  {activeLayer === 'houses' && <Check className="h-4 w-4" />}
                </button>
                
                <button 
                  className={`flex items-center justify-between w-full p-2 rounded-md ${
                    activeLayer === 'heatmap' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveLayer('heatmap')}
                >
                  <span className="text-sm">Receptivity Heatmap</span>
                  {activeLayer === 'heatmap' && <Check className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-medium mb-3">Receptivity Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                    <span className="text-sm">High Receptivity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-sm mr-2"></div>
                    <span className="text-sm">Medium Receptivity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                    <span className="text-sm">Low Receptivity</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-medium mb-3">Evangelist Legend</h3>
                <div className="space-y-2">
                  {evangelists.map(ev => (
                    <div key={ev.id} className="flex items-center">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: ev.color }}></div>
                        {ev.online && (
                          <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-green-500 rounded-full border border-background"></div>
                        )}
                      </div>
                      <span className="text-sm">{ev.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {selectedArea && (
              <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{selectedArea.name}</h3>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12" y2="16"></line>
                      </svg>
                      Details
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Navigate
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Houses</p>
                    <p className="text-lg font-semibold">{selectedArea.totalHouses}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Visited</p>
                    <p className="text-lg font-semibold">{selectedArea.visitedHouses} ({Math.round(selectedArea.visitedHouses / selectedArea.totalHouses * 100)}%)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">High Receptivity</p>
                    <p className="text-lg font-semibold">{selectedArea.highReceptivity} ({Math.round(selectedArea.highReceptivity / selectedArea.totalHouses * 100)}%)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Evangelists</p>
                    <p className="text-lg font-semibold">{selectedArea.activeEvangelists}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MapPage;
