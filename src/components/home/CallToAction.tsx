
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto glass-card overflow-hidden rounded-2xl">
          <div className="relative p-8 md:p-12 bg-gradient-to-r from-primary/80 to-primary text-white">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-8 md:mb-0 md:mr-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your evangelization efforts?</h2>
                  <p className="text-white/90 text-lg">
                    Join thousands of Christian communities already using EvangelioTrack to make a greater impact.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="font-medium whitespace-nowrap">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/demo">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white font-medium whitespace-nowrap">
                      Request Demo
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">1000+</div>
                  <p className="text-white/90">Communities</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">12K+</div>
                  <p className="text-white/90">Evangelists</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500K+</div>
                  <p className="text-white/90">Connections Made</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
