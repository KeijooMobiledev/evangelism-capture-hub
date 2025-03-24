
import { BrainCircuit, Search, Map, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const AIFeatureCard = ({ icon, title, description, delay }: AIFeatureCardProps) => (
  <div 
    className="bg-background/70 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] cursor-pointer"
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const AIFeaturesSection = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Scripture Search",
      description: "Find the perfect Bible verses for any evangelism scenario with our AI-powered search that understands context and intent."
    },
    {
      icon: <Map className="h-6 w-6 text-primary" />,
      title: "Zone Analysis",
      description: "Optimize your evangelism strategy by analyzing regional receptivity patterns, demographic insights, and historical effectiveness."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Predictive Analytics",
      description: "Forecast evangelism outcomes and identify high-potential areas with machine learning models trained on global evangelization data."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Personalized Recommendations",
      description: "Receive tailored evangelism approaches for specific individuals or groups based on cultural context and previous interactions."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI-Powered Ministry
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent tools for smarter evangelism</h2>
          <p className="text-lg text-muted-foreground">
            EvangelioTrack leverages cutting-edge artificial intelligence to help you connect with more people more effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <AIFeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-8 md:mb-0 md:mr-12 md:w-1/2">
              <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80" 
                  alt="AI Dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">How our AI works for you</h3>
              <p className="text-muted-foreground mb-6">
                Our advanced algorithms analyze evangelization patterns, Scripture relevance, and community receptivity to provide actionable insights that make your ministry more effective.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Learns from your community's unique evangelism patterns</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Provides personalized recommendations in real-time</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Protects privacy while delivering powerful insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesSection;
