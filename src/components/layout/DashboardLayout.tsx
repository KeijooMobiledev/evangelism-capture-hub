
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
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
