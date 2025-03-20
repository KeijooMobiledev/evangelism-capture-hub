
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Map, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  BellRing, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown, 
  Search,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
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
                  <Link to="/dashboard" className="flex items-center text-sm px-3 py-2 bg-primary/10 text-primary rounded-md">
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
                  <Link to="/map" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Map className="h-5 w-5 mr-2" />
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
                placeholder="Search..." 
                className="pl-9 w-[300px] h-9 bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-9">
              <BellRing className="h-4 w-4 mr-2" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Sarah. Here's an overview of your evangelization efforts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">124</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    12%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+15 from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Areas Visited</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">37</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    8%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+3 from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Evangelists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">19</div>
                  <div className="flex items-center text-yellow-500 text-sm font-medium">
                    <span className="h-4 mr-1">0%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Same as yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resources Shared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">85</div>
                  <div className="flex items-center text-red-500 text-sm font-medium">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    5%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">-7 from yesterday</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Evangelization Activity</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-b border-border pb-4">
                  <div className="w-full h-full flex items-end justify-between">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[40%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Mon</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[60%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Tue</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[80%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Wed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[70%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Thu</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[90%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Fri</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[50%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Sat</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-12 h-[30%] rounded-t-md"></div>
                      <span className="text-xs mt-2">Sun</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 pt-4">
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
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Recent Contacts</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarFallback>{`P${i}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Person {i}</p>
                          <p className="text-xs text-muted-foreground">Area {i}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        Follow up
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View all contacts
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Add event
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Prayer Meeting', date: 'Today, 7:00 PM', attendees: 12 },
                    { title: 'Evangelization Training', date: 'Tomorrow, 10:00 AM', attendees: 8 },
                    { title: 'Bible Study', date: 'Friday, 6:30 PM', attendees: 15 },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-muted-foreground mr-4">{event.attendees} attending</div>
                        <Button variant="outline" size="sm" className="h-8">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Top Performing Areas</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Downtown', percentage: 92 },
                    { name: 'Northside', percentage: 86 },
                    { name: 'Westfield', percentage: 79 },
                    { name: 'Riverdale', percentage: 65 },
                    { name: 'Eastwood', percentage: 58 },
                  ].map((area, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{area.name}</p>
                        <p className="text-sm font-medium">{area.percentage}%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
