
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Map, MessageCircle, Calendar, BookOpen, 
  Bell, GraduationCap, Settings, BrainCircuit, 
  BarChart, MailPlus 
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: 'User Account Management',
    description: 'Manage community, supervisor, and evangelist accounts with custom permissions and roles.'
  },
  {
    icon: BarChart,
    title: 'Advanced Dashboards',
    description: 'Visualize real-time evangelization data with interactive charts, maps, and custom KPIs.'
  },
  {
    icon: MessageCircle,
    title: 'Instant Messaging System',
    description: 'Communicate securely in real-time with end-to-end encrypted messaging.'
  },
  {
    icon: Map,
    title: 'Real-Time Tracking',
    description: 'Track evangelists in the field and visualize impact with interactive heat maps.'
  },
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Schedule and manage prayer meetings, Bible studies, and conferences with automated reminders.'
  },
  {
    icon: BookOpen,
    title: 'Spiritual Resources Library',
    description: 'Access, share, and manage spiritual content including audio, video, and text resources.'
  },
  {
    icon: Users,
    title: 'Contact Management',
    description: 'Track evangelized individuals with detailed profiles, follow-ups, and conversion statistics.'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay informed with customizable email and SMS alerts for important events and updates.'
  },
  {
    icon: GraduationCap,
    title: 'Training Section',
    description: 'Grow through online courses, video tutorials, and practical training materials.'
  },
  {
    icon: Settings,
    title: 'Advanced Configuration',
    description: 'Customize the platform to your community\'s specific needs with flexible settings.'
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Insights',
    description: 'Leverage artificial intelligence for evangelization recommendations and scripture search.'
  },
  {
    icon: MailPlus,
    title: 'Integration Capabilities',
    description: 'Connect with other tools through our RESTful API for seamless workflows.'
  }
];

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const checkIfInView = () => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight * 0.75);
      }
    };

    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    return () => window.removeEventListener('scroll', checkIfInView);
  }, []);

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev === features.length - 1 ? 0 : prev + 1));
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section className="py-24 bg-background" ref={featuresRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to elevate your evangelization efforts</h2>
          <p className="text-lg text-muted-foreground">
            EvangelioTrack combines powerful features to help you organize, track, and optimize your community's outreach activities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`glass-card p-6 rounded-xl transition-all duration-500 transform ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  index === activeIndex ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                } transition-colors duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
