import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

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
    <div
      data-testid={testId}
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}
    >
      <DashboardSidebar role="admin" />
      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur rounded-2xl shadow-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
