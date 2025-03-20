
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanFeature {
  title: string;
  free: boolean;
  pro: boolean;
  business: boolean;
}

const features: PlanFeature[] = [
  { title: 'Basic user management', free: true, pro: true, business: true },
  { title: 'Simple dashboard', free: true, pro: true, business: true },
  { title: 'Text-based messaging', free: true, pro: true, business: true },
  { title: 'Basic location tracking', free: true, pro: true, business: true },
  { title: 'Advanced dashboard & analytics', free: false, pro: true, business: true },
  { title: 'Advanced user roles & permissions', free: false, pro: true, business: true },
  { title: 'Real-time maps with heat visualization', free: false, pro: true, business: true },
  { title: 'Contact database & follow-up system', free: false, pro: true, business: true },
  { title: 'Resource library management', free: false, pro: true, business: true },
  { title: 'Event management with RSVP', free: false, pro: true, business: true },
  { title: 'Email & SMS notifications', free: false, pro: true, business: true },
  { title: 'Advanced reporting & exports', free: false, pro: false, business: true },
  { title: 'AI-powered recommendations', free: false, pro: false, business: true },
  { title: 'API access for integrations', free: false, pro: false, business: true },
  { title: 'Custom branding options', free: false, pro: false, business: true },
  { title: 'Priority support', free: false, pro: false, business: true },
];

const Pricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const pricingRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const checkIfInView = () => {
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight * 0.75);
      }
    };

    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    return () => window.removeEventListener('scroll', checkIfInView);
  }, []);
  
  return (
    <section className="py-24 bg-background" ref={pricingRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose the right plan for your ministry</h2>
          <p className="text-lg text-muted-foreground">
            Start with our free plan and upgrade as your evangelization efforts grow. No hidden fees, cancel anytime.
          </p>
          
          <div className="flex justify-center mt-8">
            <div className="glass p-1 rounded-full inline-flex">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === 'monthly' ? 'bg-primary text-white' : 'hover:bg-primary/10'
                }`}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === 'yearly' ? 'bg-primary text-white' : 'hover:bg-primary/10'
                }`}
                onClick={() => setBilling('yearly')}
              >
                Yearly
                <span className="ml-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div 
            className={`glass-card rounded-2xl overflow-hidden transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Free</h3>
              <p className="text-muted-foreground mt-2">Perfect for small groups just getting started</p>
              
              <div className="mt-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.free ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.free ? '' : 'text-muted-foreground'}>
                      {feature.title}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register">
                <Button variant="outline" className="w-full mt-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div 
            className={`glass-card rounded-2xl overflow-hidden border-primary relative transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 px-4 py-1 bg-primary text-white text-xs font-medium text-center">
              MOST POPULAR
            </div>
            <div className="p-6 border-b border-border pt-8">
              <h3 className="text-xl font-bold">Pro</h3>
              <p className="text-muted-foreground mt-2">For growing ministries with active outreach</p>
              
              <div className="mt-6">
                <span className="text-4xl font-bold">${billing === 'monthly' ? '39' : '29'}</span>
                <span className="text-muted-foreground">/{billing === 'yearly' ? 'month, billed yearly' : 'month'}</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.pro ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.pro ? '' : 'text-muted-foreground'}>
                      {feature.title}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register">
                <Button className="w-full mt-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Business Plan */}
          <div 
            className={`glass-card rounded-2xl overflow-hidden transition-all duration-700 delay-400 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Business</h3>
              <p className="text-muted-foreground mt-2">For larger organizations with advanced needs</p>
              
              <div className="mt-6">
                <span className="text-4xl font-bold">${billing === 'monthly' ? '99' : '79'}</span>
                <span className="text-muted-foreground">/{billing === 'yearly' ? 'month, billed yearly' : 'month'}</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.business ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.business ? '' : 'text-muted-foreground'}>
                      {feature.title}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register">
                <Button variant="outline" className="w-full mt-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-muted-foreground">
            Need a custom plan for your large organization? <a href="/contact" className="text-primary hover:underline">Contact our sales team</a> for tailored solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
