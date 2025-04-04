import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  testId?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, testId }) => {
  const { user } = useAuth();
  console.log('DashboardLayout - User auth status:', !!user);
  
  if (!user) {
    console.log('Redirecting to login - no user');
    return <Navigate to="/login" replace />;
  }

  return (
    <div data-testid={testId} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
