
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BellRing } from "lucide-react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventList from '@/components/events/EventList';
import { toast } from '@/hooks/use-toast';
import { format } from "date-fns";

// Define event type
export type EventType = "prayer" | "bible_study" | "conference" | "other";

const Events = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
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

  // Fetch user's reminders
  const fetchReminders = async () => {
    if (!user) return;
    
    setLoadingReminders(true);
    try {
      const { data, error } = await supabase
        .from('event_reminders')
        .select(`
          id, reminder_time,
          events:event_id (id, title, date)
        `)
        .eq('user_id', user.id)
        .eq('sent', false)
        .order('reminder_time', { ascending: true });
        
      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoadingReminders(false);
    }
  };

  // Fetch user's created events
  const fetchMyEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)
        .order('date', { ascending: true });
        
      if (error) throw error;
      setMyEvents(data || []);
    } catch (error) {
      console.error("Error fetching my events:", error);
    }
  };

  // Fetch past events
  const fetchPastEvents = async () => {
    if (!user) return;
    
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .lt('date', now)
        .order('date', { ascending: false });
        
      if (error) throw error;
      setPastEvents(data || []);
    } catch (error) {
      console.error("Error fetching past events:", error);
    }
  };

  // Delete a reminder
  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .delete()
        .eq('id', reminderId);
        
      if (error) throw error;
      
      // Update local state
      setReminders(reminders.filter((reminder: any) => reminder.id !== reminderId));
      
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive"
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!user) return;

    try {
      // Validate inputs
      if (!newEvent.title.trim()) {
        toast({
          title: "Error",
          description: "Please enter a title for the event",
          variant: "destructive"
        });
        return;
      }

      if (!newEvent.location.trim()) {
        toast({
          title: "Error",
          description: "Please enter a location for the event",
          variant: "destructive"
        });
        return;
      }

      if (newEvent.is_online && !newEvent.meeting_url.trim()) {
        // Generate a Jitsi meeting URL if not provided
        const roomName = `prayer-${Math.random().toString(36).substring(2, 9)}`;
        newEvent.meeting_url = `https://meet.jit.si/${roomName}`;
      }

      // Create the event
      const { error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          date: newEvent.date.toISOString(),
          is_online: newEvent.is_online,
          meeting_url: newEvent.is_online ? newEvent.meeting_url : null,
          type: newEvent.type,
          created_by: user.id,
          max_attendees: newEvent.max_attendees > 0 ? newEvent.max_attendees : null
        });

      if (error) throw error;

      // Reset form and close dialog
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

      // If we're on the "my events" tab, refresh the data
      if (activeTab === "my-events") {
        fetchMyEvents();
      }

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (user) {
      if (activeTab === "upcoming") {
        fetchReminders();
      } else if (activeTab === "my-events") {
        fetchMyEvents();
      } else if (activeTab === "past") {
        fetchPastEvents();
      }
    }
  }, [user, activeTab]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">
            Manage prayer meetings, Bible studies, and other events for your community.
          </p>
        </div>

        {reminders.length > 0 && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <BellRing className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Upcoming Reminders</h3>
            </div>
            <div className="grid gap-2">
              {reminders.map((reminder: any) => (
                <div key={reminder.id} className="flex justify-between items-center p-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{reminder.events.title}</p>
                    <p className="text-sm text-muted-foreground">
                      You'll be reminded on {format(new Date(reminder.reminder_time), 'PPp')}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

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

          <TabsContent value="upcoming">
            <EventList />
          </TabsContent>
          
          <TabsContent value="my-events">
            {myEvents.length === 0 ? (
              <div className="text-center p-10 border rounded-lg">
                <h3 className="font-medium">You haven't created any events yet</h3>
                <p className="text-muted-foreground mt-1">
                  Click the "Create Event" button to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myEvents.map((event: any) => (
                  <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP p')} • {event.is_online ? 'Online' : event.location}
                        </p>
                        {event.description && <p className="mt-2 text-sm">{event.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastEvents.length === 0 ? (
              <div className="text-center p-10 border rounded-lg">
                <h3 className="font-medium">No past events found</h3>
              </div>
            ) : (
              <div className="grid gap-4 opacity-80">
                {pastEvents.map((event: any) => (
                  <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'PPP p')} • {event.is_online ? 'Online' : event.location}
                    </p>
                    {event.description && <p className="mt-2 text-sm">{event.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Events;
