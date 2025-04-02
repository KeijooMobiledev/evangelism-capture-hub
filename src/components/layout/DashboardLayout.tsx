
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Settings,
  BarChart3, 
  LifeBuoy,
  LogOut,
  ChevronDown,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { isMobile } = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Bible Studies', href: '/bible-studies', icon: BookMarked },
    { name: 'AI Evangelism', href: '/ai-evangelism', icon: Sparkles },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed z-50 bottom-4 right-4 lg:hidden">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center border-b px-4">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebarIfMobile}>
              <span className="font-bold text-xl">Evangelio</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebarIfMobile}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-10 px-3">
              <div className="rounded-lg bg-primary/5 p-3">
                <div className="flex items-center">
                  <LifeBuoy className="h-5 w-5 text-primary mr-2" />
                  <h5 className="font-medium">Need Help?</h5>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Have questions or need assistance with the platform?
                </p>
                <Button size="sm" className="mt-3 w-full" variant="outline">
                  Contact Support
                </Button>
              </div>
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/40">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
