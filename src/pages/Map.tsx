import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
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
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(sampleArea);
  const [evangelists, setEvangelists] = useState<Evangelist[]>(sampleEvangelists);
  const [houses, setHouses] = useState<VisitedHouse[]>(sampleHouses);
  const [newHouseReceptivity, setNewHouseReceptivity] = useState<'high' | 'medium' | 'low'>('medium');
  const [mapAddingMode, setMapAddingMode] = useState<'none' | 'house'>('none');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddHouse = (e: mapboxgl.MapMouseEvent) => {
    if (mapAddingMode === 'house') {
      const lngLat = e.lngLat;
      const newHouse: VisitedHouse = {
        id: Date.now().toString(),
        position: [lngLat.lng, lngLat.lat],
        receptivity: newHouseReceptivity,
        notes: 'New visited house',
        visitedAt: new Date().toISOString(),
        evangelistId: user?.id || '1'
      };
      
      setHouses([...houses, newHouse]);
      
      addHouseMarker(newHouse);
      
      toast({
        title: 'House added',
        description: `New house marked with ${newHouseReceptivity} receptivity`,
      });
      
      setMapAddingMode('none');
    }
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
  
  const addEvangelistMarker = (evangelist: Evangelist) => {
    if (!map.current || !isMapLoaded) return;
    
    const el = document.createElement('div');
    el.className = 'evangelist-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.background = evangelist.color;
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    
    if (evangelist.online) {
      const pulse = document.createElement('div');
      pulse.className = 'pulse';
      pulse.style.position = 'absolute';
      pulse.style.width = '100%';
      pulse.style.height = '100%';
      pulse.style.borderRadius = '50%';
      pulse.style.background = evangelist.color;
      pulse.style.opacity = '0.4';
      pulse.style.animation = 'pulse 1.5s infinite';
      el.appendChild(pulse);
    }
    
    new mapboxgl.Marker(el)
      .setLngLat(evangelist.position)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<strong>${evangelist.name}</strong><br>${evangelist.online ? 'Online now' : 'Last active: ' + new Date(evangelist.lastActive).toLocaleTimeString()}`))
      .addTo(map.current);
  };
  
  const addHouseMarker = (house: VisitedHouse) => {
    if (!map.current || !isMapLoaded) return;
    
    const el = document.createElement('div');
    el.className = 'house-marker';
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.background = house.receptivity === 'high' ? '#10b981' : house.receptivity === 'medium' ? '#f59e0b' : '#ef4444';
    el.style.border = '1px solid white';
    el.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
    
    new mapboxgl.Marker(el)
      .setLngLat(house.position)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>House Visit</strong><br>
          Receptivity: ${house.receptivity}<br>
          Notes: ${house.notes}<br>
          Visited: ${new Date(house.visitedAt).toLocaleString()}
        `))
      .addTo(map.current);
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.006, 40.7128],
      zoom: 14
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      map.current?.addSource('houses-heat', {
        type: 'geojson',
        data: {
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
        }
      });
      
      map.current?.addLayer({
        id: 'houses-heat',
        type: 'heatmap',
        source: 'houses-heat',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 255, 255, 0.5)',
            0.4, 'rgba(0, 255, 0, 0.5)',
            0.6, 'rgba(255, 255, 0, 0.5)',
            0.8, 'rgba(255, 0, 0, 0.5)'
          ],
          'heatmap-radius': 20,
          'heatmap-opacity': 0.7
        },
        layout: {
          visibility: activeLayer === 'heatmap' || activeLayer === 'all' ? 'visible' : 'none'
        }
      });
      
      if (selectedArea) {
        map.current?.fitBounds(selectedArea.bounds, { padding: 50 });
      }
    });
    
    map.current.on('click', handleAddHouse);
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());
    
    if (activeLayer === 'evangelists' || activeLayer === 'all') {
      evangelists.forEach(addEvangelistMarker);
    }
    
    if (activeLayer === 'houses' || activeLayer === 'all') {
      houses.forEach(addHouseMarker);
    }
    
    if (map.current.getSource('houses-heat')) {
      (map.current.getSource('houses-heat') as mapboxgl.GeoJSONSource).setData({
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
      });
    }
    
    if (map.current.getLayer('houses-heat')) {
      map.current.setLayoutProperty('houses-heat', 'visibility', 
        activeLayer === 'heatmap' || activeLayer === 'all' ? 'visible' : 'none');
    }
  }, [evangelists, houses, activeLayer, isMapLoaded]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEvangelists(prevEvangelists => 
        prevEvangelists.map(ev => {
          if (ev.online) {
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
  
  const shareMyLocation = () => {
    if (!user) return;
    
    const newPosition: [number, number] = [
      -74.006 + (Math.random() - 0.5) * 0.002,
      40.7128 + (Math.random() - 0.5) * 0.002
    ];
    
    updateEvangelistLocation('1', newPosition);
    
    toast({
      title: 'Location shared',
      description: 'Your current location has been updated on the map',
    });
  };
  
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
            <Button 
              variant="outline" 
              className={`w-full justify-start border-dashed transition-all ${isSidebarOpen ? '' : 'p-2 justify-center'}`}
              onClick={shareMyLocation}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              {isSidebarOpen && <span>Share My Location</span>}
            </Button>
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
            
            <div className="flex items-center gap-2">
              {mapAddingMode === 'house' ? (
                <>
                  <Badge variant="outline" className="bg-background border-primary text-primary">
                    Click on map to add house
                  </Badge>
                  <Select 
                    value={newHouseReceptivity} 
                    onValueChange={(value) => setNewHouseReceptivity(value as 'high' | 'medium' | 'low')}
                  >
                    <SelectTrigger className="h-9 w-[130px]">
                      <SelectValue placeholder="Receptivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-9"
                    onClick={() => setMapAddingMode('none')}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-9"
                  onClick={() => setMapAddingMode('house')}
                >
                  Add Visited House
                </Button>
              )}
            </div>
            
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </header>
        
        {!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN.includes('exampleuser') ? (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="max-w-md p-6 rounded-lg bg-background border border-border shadow-sm">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-center mb-2">Mapbox token required</h3>
              <p className="text-muted-foreground text-center mb-4">
                This is a demo using a placeholder Mapbox token. For a real implementation, you would need to create a Mapbox account and get your own access token.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Visit <a href="https://mapbox.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a> to sign up and get your own token.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0" />
            
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M5 12h14"></path>
                  </svg>
                </Button>
              </div>
            </div>
            
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
