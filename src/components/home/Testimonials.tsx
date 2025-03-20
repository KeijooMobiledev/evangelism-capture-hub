
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  community: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    content: "EvangelioTrack has transformed how our church manages outreach. The real-time tracking and communication tools have made our evangelization efforts twice as effective with half the administrative work.",
    author: "Pastor Michael Johnson",
    role: "Lead Pastor",
    community: "Grace Community Church",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    content: "The mapping feature alone is worth every penny. Being able to visualize our impact and identify underserved areas has completely changed our strategy for the better.",
    author: "Sarah Rodriguez",
    role: "Outreach Coordinator",
    community: "Calvary Chapel",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    content: "As a supervisor managing a team of 12 evangelists, the detailed analytics and reporting have been invaluable. We've seen a 40% increase in meaningful follow-up conversations since using EvangelioTrack.",
    author: "James Wilson",
    role: "Mission Team Lead",
    community: "Hope Fellowship",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const checkIfInView = () => {
      if (testimonialsRef.current) {
        const rect = testimonialsRef.current.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight * 0.75);
      }
    };

    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    return () => window.removeEventListener('scroll', checkIfInView);
  }, []);

  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('right');
    
    setTimeout(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 500);
    }, 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('left');
    
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 500);
    }, 500);
  };

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(nextTestimonial, 7000);
      return () => clearInterval(interval);
    }
  }, [isInView, isAnimating]);

  return (
    <section 
      className="py-24 bg-muted/50"
      ref={testimonialsRef}
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-8 md:space-y-0">
            <div className={`max-w-2xl transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Christian communities worldwide</h2>
              <p className="text-lg text-muted-foreground">
                Hear from ministry leaders who have transformed their evangelization efforts with our platform.
              </p>
            </div>
            
            <div className={`flex space-x-3 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={prevTestimonial}
                disabled={isAnimating}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={nextTestimonial}
                disabled={isAnimating}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className={`relative transition-all duration-500 ${
              direction === 'left' 
                ? '-translate-x-10 opacity-0' 
                : direction === 'right' 
                  ? 'translate-x-10 opacity-0' 
                  : 'translate-x-0 opacity-100'
            }`}>
              <div className="glass-card p-8 md:p-10 rounded-2xl">
                <div className="relative mb-8">
                  <Quote className="h-12 w-12 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-xl md:text-2xl relative z-10 pl-6">{testimonials[current].content}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary">
                    <img 
                      src={testimonials[current].image} 
                      alt={testimonials[current].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonials[current].author}</h4>
                    <p className="text-muted-foreground">{testimonials[current].role}, {testimonials[current].community}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === current ? 'bg-primary scale-125' : 'bg-primary/30'
                }`}
                onClick={() => {
                  if (isAnimating) return;
                  
                  setIsAnimating(true);
                  setDirection(index > current ? 'right' : 'left');
                  
                  setTimeout(() => {
                    setCurrent(index);
                    
                    setTimeout(() => {
                      setIsAnimating(false);
                      setDirection(null);
                    }, 500);
                  }, 500);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
