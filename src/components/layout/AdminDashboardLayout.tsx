
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { Shield } from 'lucide-react';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated or not an admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (profile?.role !== 'supervisor') {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  if (!user || profile?.role !== 'supervisor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Unauthorized Access</p>
          <p className="text-muted-foreground">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardLayout;
