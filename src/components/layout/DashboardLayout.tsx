
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        {profile?.role === 'supervisor' && (
          <div className="w-full bg-amber-50 dark:bg-amber-950 py-2">
            <div className="container">
              <p className="text-amber-800 dark:text-amber-300 text-sm flex justify-between items-center">
                <span>You have administrator privileges.</span>
                <button 
                  onClick={() => navigate('/admin')}
                  className="text-primary hover:underline font-medium text-sm"
                >
                  Go to Admin Dashboard
                </button>
              </p>
            </div>
          </div>
        )}
        <div className="w-full bg-blue-50 dark:bg-blue-950 py-2">
          <div className="container">
            <p className="text-blue-800 dark:text-blue-300 text-sm flex justify-center md:justify-between items-center">
              <span className="hidden md:inline">Track your prayer life with our new Prayer Journal feature!</span>
              <button 
                onClick={() => navigate('/prayer-journal')}
                className="text-primary hover:underline font-medium text-sm"
              >
                Open Prayer Journal
              </button>
            </p>
          </div>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
