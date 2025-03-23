
import React, { useState } from 'react';
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
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventList from '@/components/events/EventList';
import { toast } from '@/hooks/use-toast';

// Define event type
type EventType = "prayer" | "bible_study" | "conference" | "other";

const Events = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
        toast({
          title: "Error",
          description: "Please enter a meeting URL for online events",
          variant: "destructive"
        });
        return;
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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">
            Manage prayer meetings, Bible studies, and other events for your community.
          </p>
        </div>

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
                        type: value as "prayer" | "bible_study" | "conference" | "other"
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
                        className="rounded-md border"
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
                      <Input
                        id="meeting_url"
                        value={newEvent.meeting_url}
                        onChange={(e) => setNewEvent({ ...newEvent, meeting_url: e.target.value })}
                        className="col-span-3"
                        placeholder="https://..."
                      />
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
            <div className="text-center p-10">
              <h3 className="font-medium">My Created Events Coming Soon</h3>
              <p className="text-muted-foreground mt-1">This tab will show events you've created.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="text-center p-10">
              <h3 className="font-medium">Past Events Coming Soon</h3>
              <p className="text-muted-foreground mt-1">This tab will show past events.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Events;
