
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Share2, Bell } from 'lucide-react';
import ReminderDialog from '@/components/events/ReminderDialog';
import JitsiMeet from '@/components/events/JitsiMeet';
import { useApi } from '@/hooks/use-api';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { api, isLoading } = useApi();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isAttending, setIsAttending] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) return;
    
    const eventData = await api.events.getById(id);
    if (eventData) {
      setEvent(eventData);
      setAttendees(eventData.attendees || []);
      setIsAttending(eventData.is_attending || false);
    }
  };

  const handleAttend = async () => {
    if (!id) return;
    
    const status = isAttending ? 'declined' : 'attending';
    const result = await api.events.attend(id, status);
    
    if (result) {
      setIsAttending(!isAttending);
      toast({
        title: isAttending ? 'RSVP Canceled' : 'RSVP Confirmed',
        description: isAttending 
          ? 'You have canceled your attendance to this event.' 
          : 'You are now registered to attend this event.',
      });
    }
  };

  const handleEdit = () => {
    navigate(`/events/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    
    if (confirmed) {
      const result = await api.events.delete(id);
      
      if (result) {
        toast({
          title: 'Event Deleted',
          description: 'The event has been successfully deleted.',
        });
        navigate('/events');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Event link copied to clipboard!',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl font-semibold mb-2">Event Not Found</p>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isOnlineEvent = event.is_online;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => navigate('/events')}
          >
            Back to Events
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <div className="flex items-center mt-2">
                <Badge className="mr-2">{event.type}</Badge>
                {isOnlineEvent && <Badge variant="outline">Online</Badge>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={isAttending ? "outline" : "default"}
                onClick={handleAttend}
              >
                {isAttending ? 'Cancel RSVP' : 'Attend Event'}
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => setIsReminderOpen(true)}>
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{formattedTime}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{isOnlineEvent ? 'Online Event' : event.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{attendees.length} attendees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {isOnlineEvent && isAttending && (
              <Card>
                <CardHeader>
                  <CardTitle>Join Online Meeting</CardTitle>
                  <CardDescription>
                    Connect with other attendees through video conference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JitsiMeet roomName={`evangelio-event-${id}`} displayName="You" />
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Event Resources</CardTitle>
                <CardDescription>
                  Materials for this evangelism event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {event.resources && event.resources.length > 0 ? (
                  <ul className="space-y-2">
                    {event.resources.map((resource: any) => (
                      <li key={resource.id} className="flex items-center p-2 border rounded">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary text-xs font-medium">
                            {resource.type?.charAt(0).toUpperCase() || 'R'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No resources have been added to this event yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={event.organizer?.avatar_url} />
                    <AvatarFallback>{event.organizer?.full_name?.charAt(0) || 'O'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer?.full_name || 'Unknown Organizer'}</p>
                    <p className="text-sm text-muted-foreground">{event.organizer?.role || 'Evangelist'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                {attendees.length > 0 ? (
                  <div className="space-y-3">
                    {attendees.slice(0, 5).map((attendee: any) => (
                      <div key={attendee.id} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={attendee.avatar_url} />
                          <AvatarFallback>{attendee.full_name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{attendee.full_name}</p>
                      </div>
                    ))}
                    
                    {attendees.length > 5 && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          + {attendees.length - 5} more attendees
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No one has RSVP'd to this event yet.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleAttend}>
                  {isAttending ? 'Cancel RSVP' : 'Attend Event'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <ReminderDialog 
        open={isReminderOpen} 
        onOpenChange={setIsReminderOpen} 
        eventId={id || ''} 
        eventTitle={event.title} 
        eventDate={event.date}
      />
    </DashboardLayout>
  );
};

export default EventDetails;
