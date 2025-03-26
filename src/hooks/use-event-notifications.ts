
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showEventNotification } from '@/components/notifications/EventNotification';
import { useAuth } from '@/contexts/AuthContext';

export interface Event {
  id: number;
  title: string;
  date: Date;
  description?: string;
}

export const useEventNotifications = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Format relative time until event (e.g., "Commence dans 2 heures")
  const formatTimeRemaining = (eventDate: Date): string => {
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 0) return "En cours";
    if (diffMinutes < 60) return `Commence dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Commence dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Commence dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  // Fetch upcoming events and show notifications for those coming soon
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // This is just a demo implementation - in the actual app, you would fetch from Supabase
        // For now, we'll use sample data
        const sampleEvents = [
          { 
            id: 1, 
            title: "Réunion de prière", 
            date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            description: "Session de prière hebdomadaire"
          },
          { 
            id: 2, 
            title: "Action communautaire", 
            date: new Date(Date.now() + 26 * 60 * 60 * 1000), // 26 hours from now
            description: "Distribution alimentaire dans le quartier sud"
          },
          { 
            id: 3, 
            title: "Étude biblique", 
            date: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
            description: "Étude du livre des Actes"
          }
        ];
        
        setUpcomingEvents(sampleEvents);
        
        // Show notifications for events happening soon (within 3 hours)
        const soonEvents = sampleEvents.filter(
          event => (event.date.getTime() - Date.now()) < 3 * 60 * 60 * 1000
        );
        
        if (soonEvents.length > 0) {
          soonEvents.forEach(event => {
            showEventNotification({
              id: event.id,
              title: event.title,
              date: event.date.toLocaleString(),
              timeRemaining: formatTimeRemaining(event.date)
            });
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };
    
    fetchEvents();
    
    // Set up a timer to check for imminent events every 15 minutes
    const timer = setInterval(fetchEvents, 15 * 60 * 1000);
    
    return () => clearInterval(timer);
  }, [user]);

  return {
    upcomingEvents,
    isLoading,
    error,
    formatTimeRemaining
  };
};

export default useEventNotifications;
