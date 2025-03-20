
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    // In a real app, this would authenticate with a backend
    // For now, we'll just redirect to the dashboard
    navigate('/dashboard');
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
          
          <AuthForm mode="login" onSubmit={handleLogin} />
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
