
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 rounded-full"></div>
                <span className="relative text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">EvangelioTrack</span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Empowering Christian communities with real-time evangelization tracking, communication, and resource management.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Github">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/changelog" className="text-muted-foreground hover:text-primary transition-colors">Changelog</Link></li>
              <li><Link to="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
              <li><Link to="/documentation" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/partners" className="text-muted-foreground hover:text-primary transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {year} EvangelioTrack. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" fill="currentColor" /> for Christian communities worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
