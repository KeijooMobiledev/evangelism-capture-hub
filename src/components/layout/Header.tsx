import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Header = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, logout, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Evangelical.io</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/map"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/map" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Map
                </Link>
                <Link
                  to="/messages"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/messages" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Messages
                </Link>
                <Link
                  to="/events"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/events" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Events
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Home
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <nav className="flex items-center space-x-1 md:space-x-3">
            {isAuthenticated ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "Avatar"} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the application using the menu.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/map">
                      <Button variant="ghost" className="w-full justify-start">
                        Map
                      </Button>
                    </Link>
                    <Link to="/messages">
                      <Button variant="ghost" className="w-full justify-start">
                        Messages
                      </Button>
                    </Link>
                    <Link to="/events">
                      <Button variant="ghost" className="w-full justify-start">
                        Events
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      Logout
                    </Button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/">
                      <Button variant="ghost" className="w-full justify-start">
                        Home
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="secondary" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full justify-start">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
