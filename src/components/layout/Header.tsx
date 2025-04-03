
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '@/components/auth/HeaderAdapter';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ChevronDown, Globe, Menu, X, ShoppingBag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const closeMenu = () => setIsMenuOpen(false);

  const navigationItems = [
    { name: t('nav.home'), path: "/" },
    ...(isAuthenticated
      ? [
          { name: t('nav.dashboard'), path: "/dashboard" },
          { name: t('nav.map'), path: "/map" },
          { name: t('nav.messages'), path: "/messages" },
          { name: t('nav.events'), path: "/events" },
          { name: "Courses", path: "/courses" },
          { name: "Store", path: "/store" },
          { name: t('nav.blog'), path: "/blog" },
        ]
      : [
          { name: t('nav.features'), path: "/features" },
          { name: t('nav.pricing'), path: "/pricing" },
          { name: t('nav.contact'), path: "/contact" },
          { name: "Courses", path: "/courses" },
          { name: "Store", path: "/store" },
          { name: t('nav.blog'), path: "/blog" },
        ]),
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

  const renderLanguageDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{t('language')}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          {t('english')}
          {language === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>
          {t('french')}
          {language === 'fr' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('es')}>
          {t('spanish')}
          {language === 'es' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
              <Link to="/dashboard" className="w-full">{t('nav.dashboard')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
            <Button variant="ghost">{t('login')}</Button>
          </Link>
          <Link to="/register" onClick={onClick}>
            <Button>{t('register')}</Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center mr-8">
          Evangelize App
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {renderNavLinks()}
          <Link to="/api-docs" className="transition-colors hover:text-primary">
            {t('nav.api-docs')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 ml-auto">
          <Link to="/store" className="flex items-center">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
          {renderLanguageDropdown()}
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
                  <Link to="/api-docs" className="text-foreground hover:text-primary transition-colors" onClick={closeMenu}>
                    {t('nav.api-docs')}
                  </Link>
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
