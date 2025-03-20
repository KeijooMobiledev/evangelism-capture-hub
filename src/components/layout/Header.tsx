
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 rounded-full animate-pulse-slow"></div>
            <span className="relative text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">EvangelioTrack</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground/80'}`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/features') ? 'text-primary' : 'text-foreground/80'}`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/pricing') ? 'text-primary' : 'text-foreground/80'}`}
          >
            Pricing
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium transition-colors group-hover:text-primary text-foreground/80">
              <span>Resources</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-48">
              <div className="glass-card rounded-lg p-3 space-y-1">
                <Link to="/blog" className="block px-3 py-2 rounded-md hover:bg-primary/10 text-sm">
                  Blog
                </Link>
                <Link to="/documentation" className="block px-3 py-2 rounded-md hover:bg-primary/10 text-sm">
                  Documentation
                </Link>
                <Link to="/support" className="block px-3 py-2 rounded-md hover:bg-primary/10 text-sm">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="font-medium">Sign up</Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-1">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="container h-full px-4 mx-auto pt-20 pb-16 flex flex-col justify-between">
          <nav className="flex flex-col space-y-6 py-10">
            <Link to="/" className="text-xl font-medium" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/features" className="text-xl font-medium" onClick={toggleMobileMenu}>Features</Link>
            <Link to="/pricing" className="text-xl font-medium" onClick={toggleMobileMenu}>Pricing</Link>
            <Link to="/blog" className="text-xl font-medium" onClick={toggleMobileMenu}>Blog</Link>
            <Link to="/documentation" className="text-xl font-medium" onClick={toggleMobileMenu}>Documentation</Link>
            <Link to="/support" className="text-xl font-medium" onClick={toggleMobileMenu}>Support</Link>
          </nav>
          
          <div className="flex flex-col space-y-4">
            <Link to="/login" onClick={toggleMobileMenu}>
              <Button variant="outline" size="lg" className="w-full">Log in</Button>
            </Link>
            <Link to="/register" onClick={toggleMobileMenu}>
              <Button size="lg" className="w-full">Sign up free</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
