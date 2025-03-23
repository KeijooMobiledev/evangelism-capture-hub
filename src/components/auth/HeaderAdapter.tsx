
import { useAuth as useOriginalAuth } from '@/contexts/AuthContext';

// This adapter provides the expected properties that the Header component needs
export const useAuth = () => {
  const authContext = useOriginalAuth();
  
  return {
    ...authContext,
    isAuthenticated: !!authContext.user,
    loading: false,
    logout: authContext.signOut
  };
};
