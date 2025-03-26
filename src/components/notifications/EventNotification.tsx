
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Calendar, Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EventNotificationProps {
  id: number;
  title: string;
  date: string;
  timeRemaining: string;
}

const EventNotification: React.FC<EventNotificationProps> = ({
  id,
  title,
  date,
  timeRemaining
}) => {
  const navigate = useNavigate();
  
  const handleViewEvent = () => {
    navigate('/events');
    toast({
      title: 'Événement ouvert',
      description: `Vous consultez maintenant l'événement: ${title}`,
    });
  };
  
  const handleDismiss = () => {
    toast({
      title: 'Notification ignorée',
      description: 'Vous pouvez retrouver tous vos événements dans la page Événements.',
    });
  };
  
  return (
    <div className="flex items-start space-x-4 max-w-md">
      <div className="bg-primary/10 p-2 rounded-full">
        <Calendar className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{date}</p>
        {timeRemaining && (
          <p className="text-xs mt-1 font-medium text-amber-600 dark:text-amber-400">
            <Bell className="inline-block h-3 w-3 mr-1" />
            {timeRemaining}
          </p>
        )}
        <div className="flex space-x-2 mt-2">
          <Button size="sm" variant="default" onClick={handleViewEvent}>
            <Calendar className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button size="sm" variant="outline" onClick={handleDismiss}>
            <X className="h-4 w-4 mr-1" />
            Ignorer
          </Button>
        </div>
      </div>
    </div>
  );
};

export const showEventNotification = (event: {
  id: number;
  title: string;
  date: string;
  timeRemaining: string;
}) => {
  toast({
    title: 'Événement à venir',
    description: (
      <EventNotification
        id={event.id}
        title={event.title}
        date={event.date}
        timeRemaining={event.timeRemaining}
      />
    ),
    duration: 10000, // 10 seconds
  });
};

export default EventNotification;
