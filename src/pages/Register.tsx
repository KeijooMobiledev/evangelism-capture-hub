
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (data: any) => {
    console.log('Register data:', data);
    // In a real app, this would register with a backend
    // For now, we'll just redirect to the login page
    navigate('/login');
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
          
          <AuthForm mode="register" onSubmit={handleRegister} />
        </div>
      </div>
      
      {/* Right side - Image and benefits */}
      <div className="hidden lg:flex flex-1 relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}></div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12">
          <h2 className="text-2xl font-bold mb-8">Join thousands of ministry leaders</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1">
                <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time tracking</h3>
                <p className="text-muted-foreground">Monitor evangelization activities as they happen with interactive maps and dashboards.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1">
                <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seamless communication</h3>
                <p className="text-muted-foreground">Keep your team connected with instant messaging and notifications.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1">
                <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Contact management</h3>
                <p className="text-muted-foreground">Organize and track evangelized individuals with detailed profiles and follow-up tools.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1">
                <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-powered insights</h3>
                <p className="text-muted-foreground">Make data-driven decisions with intelligent recommendations and analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
