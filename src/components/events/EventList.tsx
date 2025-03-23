
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  Video, 
  RefreshCw, 
  Bell, 
  Copy,
  Check,
  BellRing,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { toast } from '@/hooks/use-toast';
import JitsiMeet from './JitsiMeet';
import ReminderDialog from './ReminderDialog';

// Define proper types for events
export type EventType = "prayer" | "bible_study" | "conference" | "other";
export type AttendanceStatus = "attending" | "declined";

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: string;
  is_online: boolean | null;
  meeting_url: string | null;
  type: string;
  created_by: string;
  max_attendees: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type EventAttendee = {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  joined_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type EventWithAttendance = Event & {
  attendees: number;
  userStatus?: AttendanceStatus | null;
};

const eventTypeColors = {
  prayer: "bg-blue-100 text-blue-800",
  bible_study: "bg-green-100 text-green-800",
  conference: "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800"
};

const EventList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeJitsiEvent, setActiveJitsiEvent] = useState<EventWithAttendance | null>(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<EventWithAttendance | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date(),
    is_online: false,
    meeting_url: '',
    type: 'prayer' as EventType,
    max_attendees: 0
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) {
        throw eventsError;
      }

      if (eventsData) {
        // Get user attendance status for these events
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('event_attendees')
          .select('*')
          .eq('user_id', user.id);

        if (attendanceError) {
          console.error("Error fetching attendance:", attendanceError);
        }

        // Count total attendees for each event
        const attendeeCounts: Record<string, number> = {};
        const userStatus: Record<string, AttendanceStatus | null> = {};

        // Get attendee counts for each event
        for (const event of eventsData) {
          const { data: attendees, error: countError } = await supabase
            .from('event_attendees')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id)
            .eq('status', 'attending');

          if (!countError && attendees) {
            attendeeCounts[event.id] = attendees.length;
          }

          // Find user's status for this event
          if (attendanceData) {
            const userAttendance = attendanceData.find(a => a.event_id === event.id);
            // Cast the status to our AttendanceStatus type
            const status = userAttendance?.status as AttendanceStatus | undefined;
            userStatus[event.id] = status || null;
          }
        }

        // Combine event data with attendance info
        const eventsWithAttendance = eventsData.map(event => ({
          ...event,
          // Cast to our EventType
          type: event.type as EventType,
          attendees: attendeeCounts[event.id] || 0,
          userStatus: userStatus[event.id] || null
        }));

        setEvents(eventsWithAttendance);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance RSVP
  const handleAttendance = async (eventId: string, status: AttendanceStatus) => {
    if (!user) return;

    try {
      const { data: existingAttendance } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingAttendance) {
        // Update existing record
        const { error } = await supabase
          .from('event_attendees')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existingAttendance.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          });

        if (error) throw error;
      }

      // Update local state
      setEvents(events.map(event => {
        if (event.id === eventId) {
          const attendeeDelta = status === 'attending' 
            ? (event.userStatus === 'attending' ? 0 : 1)
            : (event.userStatus === 'attending' ? -1 : 0);
            
          return {
            ...event,
            attendees: event.attendees + attendeeDelta,
            userStatus: status
          };
        }
        return event;
      }));

      toast({
        title: "Success",
        description: status === "attending" ? "You're attending this event!" : "You've declined this event.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive"
      });
    }
  };

  // Create new event
  const handleCreateEvent = async () => {
    if (!user) return;

    try {
      // For Jitsi events, generate a room name if not provided
      let meetingUrl = newEvent.meeting_url;
      if (newEvent.is_online && !meetingUrl) {
        // Generate a random room name if not provided
        const roomName = `prayer-${Math.random().toString(36).substring(2, 9)}`;
        meetingUrl = `https://meet.jit.si/${roomName}`;
      }

      const { error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          date: newEvent.date.toISOString(),
          is_online: newEvent.is_online,
          meeting_url: newEvent.is_online ? meetingUrl : null,
          type: newEvent.type,
          created_by: user.id,
          max_attendees: newEvent.max_attendees > 0 ? newEvent.max_attendees : null
        });

      if (error) throw error;

      setCreateDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        location: '',
        date: new Date(),
        is_online: false,
        meeting_url: '',
        type: 'prayer' as EventType,
        max_attendees: 0
      });

      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      // Refresh events list
      fetchEvents();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    }
  };

  // Join online meeting
  const joinMeeting = (event: EventWithAttendance) => {
    if (!event.is_online || !event.meeting_url) {
      toast({
        title: "Error",
        description: "This is not an online event or no meeting URL is available",
        variant: "destructive"
      });
      return;
    }
    
    // If it's a Jitsi URL, open in our custom component
    if (event.meeting_url.includes('meet.jit.si')) {
      setActiveJitsiEvent(event);
    } else {
      // For other meeting URLs, open in a new tab
      window.open(event.meeting_url, '_blank');
    }
  };

  // Copy meeting link
  const copyMeetingLink = (meetingUrl: string) => {
    navigator.clipboard.writeText(meetingUrl);
    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard!",
    });
  };

  // Open reminder dialog
  const openReminderDialog = (event: EventWithAttendance) => {
    setSelectedEventForReminder(event);
    setReminderDialogOpen(true);
  };

  // Load events on component mount
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-4">Loading events...</div>;
  }

  // If we're in a Jitsi meeting, show only that
  if (activeJitsiEvent) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-muted p-2 flex justify-between items-center">
          <h3 className="font-medium">{activeJitsiEvent.title}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveJitsiEvent(null)}
          >
            Leave Meeting
          </Button>
        </div>
        <JitsiMeet 
          roomName={activeJitsiEvent.meeting_url?.split('/').pop() || 'meeting'} 
          displayName={user?.email || 'Participant'} 
          onClose={() => setActiveJitsiEvent(null)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill out the details below to create a new event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  onValueChange={(value) => setNewEvent({ 
                    ...newEvent, 
                    type: value as EventType
                  })}
                  value={newEvent.type}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prayer">Prayer Meeting</SelectItem>
                    <SelectItem value="bible_study">Bible Study</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
                    className="rounded-md border pointer-events-auto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_online" className="text-right">
                  Online Event
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="is_online"
                    checked={newEvent.is_online}
                    onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_online: checked })}
                  />
                  <span>This is an online event</span>
                </div>
              </div>
              {newEvent.is_online && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meeting_url" className="text-right">
                    Meeting URL
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="meeting_url"
                      value={newEvent.meeting_url}
                      onChange={(e) => setNewEvent({ ...newEvent, meeting_url: e.target.value })}
                      className="mb-1"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to automatically create a Jitsi Meet room.
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  {newEvent.is_online ? "Host" : "Location"}
                </Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="col-span-3"
                  placeholder={newEvent.is_online ? "Host name" : "Physical location"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max_attendees" className="text-right">
                  Max Attendees
                </Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={newEvent.max_attendees === 0 ? "" : newEvent.max_attendees}
                  onChange={(e) => setNewEvent({ ...newEvent, max_attendees: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <h3 className="font-medium">No events scheduled</h3>
            <p className="text-muted-foreground mt-1">Create an event to get started.</p>
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <Badge variant="outline" className={eventTypeColors[event.type as EventType]}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(new Date(event.date), 'PPP p')}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center gap-1">
                      {event.is_online ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span>{event.location}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}
                        {event.max_attendees && ` (max: ${event.max_attendees})`}
                      </span>
                    </div>
                  </div>
                  {event.description && (
                    <p className="mt-2 text-sm">{event.description}</p>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 self-end">
                  {event.is_online && event.meeting_url && (
                    <div className="w-full flex justify-end gap-2 mb-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyMeetingLink(event.meeting_url as string)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => joinMeeting(event)}
                        className="flex items-center gap-1"
                      >
                        <Video className="h-3 w-3" />
                        Join Meeting
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReminderDialog(event)}
                    className="flex items-center gap-1"
                  >
                    <Bell className="h-3 w-3" />
                    Set Reminder
                  </Button>
                  
                  {event.userStatus === 'attending' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAttendance(event.id, 'declined')}
                    >
                      Cancel Attendance
                    </Button>
                  ) : event.userStatus === 'declined' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAttendance(event.id, 'attending')}
                    >
                      Attend Instead
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleAttendance(event.id, 'attending')}
                    >
                      Attend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={fetchEvents} 
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Events
        </Button>
      </div>

      {selectedEventForReminder && (
        <ReminderDialog
          open={reminderDialogOpen}
          onOpenChange={setReminderDialogOpen}
          eventId={selectedEventForReminder.id}
          eventDate={new Date(selectedEventForReminder.date)}
          eventTitle={selectedEventForReminder.title}
        />
      )}
    </div>
  );
};

export default EventList;
