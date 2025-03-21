
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (data: any) => {
    try {
      setError(null);
      setDebugInfo(null);
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
      
      // Add more debug information
      if (err?.code) {
        setDebugInfo(`Error code: ${err.code}`);
      }
    }
  };

  const handleDemoLogin = async (role: string) => {
    try {
      setError(null);
      setDebugInfo(null);
      const email = `${role}@demo.com`;
      const password = 'demo123';
      
      // Try to sign in directly with Supabase client for debugging
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Demo login successful:", data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError(err.message || "Failed to login with demo account");
      
      if (err?.code) {
        setDebugInfo(`Error code: ${err.code} - This suggests there might be an issue with Supabase authentication configuration.`);
      }
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
          
          {debugInfo && (
            <Alert className="mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200">
              <AlertDescription className="text-amber-800 dark:text-amber-300">{debugInfo}</AlertDescription>
            </Alert>
          )}
          
          <AuthForm mode="login" onSubmit={handleLogin} />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">Quick Demo Login</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('community')}
                className="h-auto py-3"
              >
                Community User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('supervisor')}
                className="h-auto py-3"
              >
                Supervisor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('evangelist')}
                className="h-auto py-3"
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
