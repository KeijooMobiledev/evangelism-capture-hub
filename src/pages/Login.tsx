
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (data: any) => {
    try {
      setError(null);
      setIsProcessing(true);
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      // Display toast notification while creating demo user
      toast({
        title: "Setting up demo account...",
        description: "Please wait while we prepare your demo experience."
      });
      
      // First check if the user already exists
      const email = `${role}@demo.com`;
      const password = 'demo123';
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If user doesn't exist, create it
      if (signInError && signInError.message === "Invalid login credentials") {
        // Create a new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
              role: role as any
            }
          }
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        // Sign in after creating the user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Demo account created",
          description: `You've been logged in as a ${role} user.`
        });
        
        navigate('/dashboard');
      } else if (signInError) {
        // If there was another error, throw it
        throw signInError;
      } else {
        // User exists and sign in was successful
        toast({
          title: "Demo login successful",
          description: `You've been logged in as a ${role} user.`
        });
        
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Demo login error:", err);
      
      setError(
        err.message || 
        "Failed to setup demo account. Please try again or contact support."
      );
      
      toast({
        title: "Error",
        description: err.message || "Failed to set up demo account",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="absolute w-4 h-4 bg-white dark:bg-slate-800 rounded-full"></div>
                <span className="relative text-white font-bold text-sm">E</span>
              </div>
              <span className="text-lg font-semibold">EvangelioTrack</span>
            </Link>
            <ThemeToggle />
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <AuthForm mode="login" onSubmit={handleLogin} isProcessing={isProcessing} />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">Quick Demo Login</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('community')}
                className="h-auto py-3"
                disabled={isProcessing}
              >
                Community User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('supervisor')}
                className="h-auto py-3"
                disabled={isProcessing}
              >
                Supervisor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('evangelist')}
                className="h-auto py-3"
                disabled={isProcessing}
              >
                Evangelist
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image and quote */}
      <div className="hidden lg:flex flex-1 relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1519677584237-752f8853252e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}></div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12">
          <blockquote className="text-2xl font-semibold text-foreground mb-6">
            "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
          </blockquote>
          <p className="text-muted-foreground font-medium">Matthew 28:19</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
