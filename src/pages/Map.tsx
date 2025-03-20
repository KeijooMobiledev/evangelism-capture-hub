
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';

const MapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState<string>('all');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
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
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              {isSidebarOpen && <span>New Activity</span>}
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
      
      {/* Main content */}
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
        
        <div className="flex-1 relative overflow-hidden">
          {/* Map visualization */}
          <div className="absolute inset-0 bg-slate-800">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}></div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"></div>
            
            {/* Placeholder for evangelist positions */}
            <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-2/3 left-1/2 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
            
            {/* Placeholder for visited houses with different receptivity levels */}
            <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-green-300 rounded-sm"></div>
            <div className="absolute top-2/5 left-3/5 w-4 h-4 bg-yellow-300 rounded-sm"></div>
            <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-red-300 rounded-sm"></div>
            <div className="absolute top-3/5 left-1/3 w-4 h-4 bg-green-300 rounded-sm"></div>
            <div className="absolute top-2/3 left-2/5 w-4 h-4 bg-yellow-300 rounded-sm"></div>
          </div>
          
          {/* Map controls */}
          <div className="absolute top-4 right-4 glass p-2 rounded-lg">
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
          
          {/* Filter panel */}
          <div className="absolute top-4 left-4 glass p-4 rounded-lg max-w-xs">
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
                  <div className="w-4 h-4 bg-green-300 rounded-sm mr-2"></div>
                  <span className="text-sm">High Receptivity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-300 rounded-sm mr-2"></div>
                  <span className="text-sm">Medium Receptivity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-300 rounded-sm mr-2"></div>
                  <span className="text-sm">Low Receptivity</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="font-medium mb-3">Evangelist Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">John Smith</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Maria Garcia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">David Lee</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected area info */}
          <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Riverdale District</h3>
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
                <p className="text-lg font-semibold">157</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Visited</p>
                <p className="text-lg font-semibold">89 (57%)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Receptivity</p>
                <p className="text-lg font-semibold">45 (29%)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Evangelists</p>
                <p className="text-lg font-semibold">3</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
