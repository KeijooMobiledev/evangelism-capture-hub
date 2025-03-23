
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '@/components/auth/HeaderAdapter';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import useMobile from "@/hooks/use-mobile";

const Header = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navigationItems = [
    { name: "Home", path: "/" },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Map", path: "/map" },
          { name: "Messages", path: "/messages" },
          { name: "Events", path: "/events" },
        ]
      : []),
  ];

  const renderNavLinks = (onClick?: () => void) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-foreground hover:text-primary transition-colors"
          onClick={onClick}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  const renderAuthButtons = (onClick?: () => void) => (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.user_metadata?.full_name || ''} />
                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClick}>
              <Link to="/dashboard" className="w-full">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                logout();
                if (onClick) onClick();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" onClick={onClick}>
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register" onClick={onClick}>
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold flex items-center">
            Evangelize App
          </Link>

          {!isMobile && (
            <nav className="flex items-center space-x-6">
              {renderNavLinks()}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {!isMobile && renderAuthButtons()}

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <nav className="flex flex-col items-start gap-4 mt-8">
                  {renderNavLinks(closeMenu)}
                </nav>
                <div className="mt-auto mb-8">
                  {renderAuthButtons(closeMenu)}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
