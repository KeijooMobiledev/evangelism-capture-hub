
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Map, MessageCircle, Calendar, BookOpen } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute top-60 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl"></div>
      </div>
      
      <div className="container relative px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium bg-muted rounded-full text-foreground/80">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Launching soon - Join the waitlist
            </div>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Empower Your <span className="text-primary">Evangelization</span> Journey
          </h1>
          
          <p className={`text-xl text-muted-foreground mb-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            A powerful platform that helps Christian communities track, manage, and optimize their evangelization efforts with real-time insights and seamless communication.
          </p>
          
          <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-16 transition-all duration-1000 delay-400 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base font-medium py-6 px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-medium py-6 px-8">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
        
        <div className={`mt-16 relative transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
            
            {/* Dashboard preview */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 h-[600px] rounded-2xl overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <h2 className="text-white text-xl font-semibold">EvangelioTrack Dashboard</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white/70" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white/70" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white/70" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 bg-white/10 rounded-xl h-64 p-4 flex flex-col">
                    <h3 className="text-white text-sm font-medium mb-3">Evangelization Map</h3>
                    <div className="flex-grow bg-slate-700/50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                      <Map className="absolute inset-0 m-auto text-white/30 h-20 w-20" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 h-[120px]">
                      <h3 className="text-white text-sm font-medium mb-3">Activity Overview</h3>
                      <div className="flex items-end justify-between h-12">
                        <div className="w-[10%] bg-primary/60 rounded-t"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[70%]"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[40%]"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[90%]"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[60%]"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[80%]"></div>
                        <div className="w-[10%] bg-primary/60 rounded-t h-[50%]"></div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 flex-grow">
                      <h3 className="text-white text-sm font-medium mb-3">Recent Contacts</h3>
                      <div className="space-y-2">
                        <div className="bg-slate-700/50 h-6 rounded"></div>
                        <div className="bg-slate-700/50 h-6 rounded"></div>
                        <div className="bg-slate-700/50 h-6 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 h-32">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">New Contacts</h3>
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-white text-3xl font-semibold">124</p>
                    <p className="text-green-400 text-xs">+12% from last week</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 h-32">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">Areas Visited</h3>
                      <Map className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-white text-3xl font-semibold">37</p>
                    <p className="text-green-400 text-xs">+8% from last week</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 h-32">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">Active Evangelists</h3>
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-white text-3xl font-semibold">19</p>
                    <p className="text-yellow-400 text-xs">Same as last week</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 h-32">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">Resources Shared</h3>
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-white text-3xl font-semibold">85</p>
                    <p className="text-green-400 text-xs">+15% from last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reflection effect */}
          <div className="absolute -bottom-12 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/30 to-transparent blur-xl mx-auto max-w-5xl rounded-full"></div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="currentColor" 
            fillOpacity="1" 
            className="text-background"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,160C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
