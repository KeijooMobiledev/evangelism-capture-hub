
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, User, Video, BookOpen, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface EventProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: 'prayer' | 'bible_study' | 'conference' | 'other';
  is_online: boolean;
  meeting_url?: string;
  created_by: string;
  attendees_count?: number;
  max_attendees?: number | null;
  rsvp_status?: 'attending' | 'declined' | null;
}

interface EventListProps {
  events: EventProps[];
  onEventUpdated: () => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventUpdated }) => {
  const { user } = useAuth();
  const [loadingRsvp, setLoadingRsvp] = useState<string | null>(null);
  const [joiningMeeting, setJoiningMeeting] = useState<string | null>(null);

  if (!events.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">No events found</p>
          <p className="text-muted-foreground text-center mt-1">
            Create your first event using the button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer':
        return <Users className="h-4 w-4" />;
      case 'bible_study':
        return <BookOpen className="h-4 w-4" />;
      case 'conference':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Format event type for display
  const formatEventType = (type: string) => {
    switch (type) {
      case 'prayer':
        return 'Prayer Meeting';
      case 'bible_study':
        return 'Bible Study';
      case 'conference':
        return 'Conference';
      default:
        return 'Event';
    }
  };

  // Handle RSVP
  const handleRsvp = async (eventId: string, status: 'attending' | 'declined') => {
    if (!user) return;
    
    setLoadingRsvp(eventId);
    
    try {
      // Check if the user has already RSVP'd
      const { data: existingRsvp } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_attendees')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          });
          
        if (error) throw error;
      }
      
      toast({
        title: status === 'attending' ? 'You are attending!' : 'RSVP updated',
        description: status === 'attending' 
          ? 'You have been added to the attendee list' 
          : 'Your response has been recorded',
      });
      
      onEventUpdated();
    } catch (error: any) {
      console.error('Error updating RSVP:', error.message);
      toast({
        title: 'Error updating RSVP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingRsvp(null);
    }
  };

  // Handle joining online meeting
  const joinMeeting = (event: EventProps) => {
    setJoiningMeeting(event.id);
    
    // If a custom meeting URL was provided, use that
    const meetingUrl = event.meeting_url || `https://meet.jit.si/${event.id}`;
    
    // Open Jitsi Meet in a new tab
    window.open(meetingUrl, '_blank');
    
    // Record that the user joined the meeting
    if (user) {
      supabase
        .from('event_attendees')
        .upsert({
          event_id: event.id,
          user_id: user.id,
          status: 'attending',
          joined_at: new Date().toISOString()
        })
        .then(() => {
          onEventUpdated();
        })
        .catch(error => {
          console.error('Error recording meeting join:', error);
        })
        .finally(() => {
          setJoiningMeeting(null);
        });
    } else {
      setJoiningMeeting(null);
    }
  };

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, EventProps[]>);

  return (
    <div className="space-y-8">
      {Object.entries(eventsByDate).map(([date, dateEvents]) => (
        <div key={date}>
          <h2 className="text-xl font-semibold mb-4">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</h2>
          <div className="space-y-4">
            {dateEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {getEventTypeIcon(event.type)}
                        <span className="ml-1">{formatEventType(event.type)}</span>
                      </Badge>
                      <CardTitle>{event.title}</CardTitle>
                      {event.description && (
                        <CardDescription className="mt-2">{event.description}</CardDescription>
                      )}
                    </div>
                    {event.is_online && (
                      <Badge variant="secondary" className="ml-2">
                        <Video className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(new Date(event.date), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    {(event.attendees_count !== undefined || event.max_attendees) && (
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {event.attendees_count || 0} attending
                          {event.max_attendees ? ` (max ${event.max_attendees})` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-2">
                      <Button
                        variant={event.rsvp_status === 'attending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRsvp(event.id, 'attending')}
                        disabled={loadingRsvp === event.id}
                      >
                        {event.rsvp_status === 'attending' ? 'Attending' : 'Attend'}
                      </Button>
                      
                      <Button
                        variant={event.rsvp_status === 'declined' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleRsvp(event.id, 'declined')}
                        disabled={loadingRsvp === event.id}
                      >
                        {event.rsvp_status === 'declined' ? 'Declined' : 'Decline'}
                      </Button>
                    </div>
                    
                    {event.is_online && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => joinMeeting(event)}
                        disabled={joiningMeeting === event.id}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                    
                    {user?.id === event.created_by && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Cancel Event</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this event? This action cannot be undone
                              and will notify all attendees.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Event</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('events')
                                    .delete()
                                    .eq('id', event.id);
                                    
                                  if (error) throw error;
                                  
                                  toast({
                                    title: 'Event cancelled',
                                    description: 'The event has been cancelled successfully',
                                  });
                                  
                                  onEventUpdated();
                                } catch (error: any) {
                                  console.error('Error cancelling event:', error.message);
                                  toast({
                                    title: 'Error cancelling event',
                                    description: error.message,
                                    variant: 'destructive',
                                  });
                                }
                              }}
                            >
                              Cancel Event
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
