
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPinIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LocationTrackerProps {
  onLocationShared?: (location: { lng: number; lat: number; userId: string }) => void;
}

const LocationTracker = ({ onLocationShared }: LocationTrackerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState('');

  const shareLocation = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to share your location',
        variant: 'destructive'
      });
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support location sharing',
        variant: 'destructive'
      });
      return;
    }

    setIsTracking(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        
        // Simulate sending to a backend
        const locationData = {
          lng: longitude,
          lat: latitude,
          userId: user.id,
          timestamp: new Date().toISOString()
        };
        
        // Call the callback if provided
        if (onLocationShared) {
          onLocationShared({
            lng: longitude,
            lat: latitude,
            userId: user.id
          });
        }
        
        // Track user presence with location
        const channel = supabase.channel('evangelists-map');
        channel
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.track({
                user_id: user.id,
                location: { lng: longitude, lat: latitude },
                online_at: new Date().toISOString()
              });
            }
          });
        
        toast({
          title: 'Location shared',
          description: 'Your current location has been updated on the map',
        });
        
        setIsTracking(false);
        setLocationError('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError(
          error.code === 1
            ? 'You denied permission to access your location'
            : 'Could not get your location'
        );
        toast({
          title: 'Location error',
          description: error.message,
          variant: 'destructive'
        });
        setIsTracking(false);
      }
    );
  };

  // Set up continuous tracking if needed
  useEffect(() => {
    let watchId: number | null = null;
    
    if (isTracking && user) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          if (onLocationShared) {
            onLocationShared({
              lng: longitude,
              lat: latitude,
              userId: user.id
            });
          }
        },
        (error) => {
          console.error('Error tracking location:', error);
          setLocationError(error.message);
        }
      );
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, user, onLocationShared]);

  return (
    <div>
      <Button 
        onClick={shareLocation} 
        disabled={isTracking}
        className="w-full"
      >
        <MapPinIcon className="h-4 w-4 mr-2" />
        {isTracking ? 'Sharing...' : 'Share My Location'}
      </Button>
      
      {locationError && (
        <p className="text-sm text-destructive mt-2">{locationError}</p>
      )}
    </div>
  );
};

export default LocationTracker;
