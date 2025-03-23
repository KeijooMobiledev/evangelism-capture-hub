
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import EventList from '@/components/events/EventList';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Form schema for event creation
const eventFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  location: z.string().min(3, { message: 'Location is required' }),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time' }),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().optional(),
  type: z.enum(['prayer', 'bible_study', 'conference', 'other']),
  maxAttendees: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      time: '18:00',
      isOnline: false,
      type: 'prayer',
    },
  });

  // Fetch events on component mount
  useEffect(() => {
    if (!user) return;
    
    fetchEvents();
  }, [user]);

  // Function to fetch events from Supabase
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error.message);
      toast({
        title: 'Error fetching events',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for creating a new event
  const onSubmit = async (values: EventFormValues) => {
    if (!user) return;

    try {
      // Format date and time for storage
      const eventDate = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      eventDate.setHours(hours, minutes);

      // Prepare event data
      const eventData = {
        title: values.title,
        description: values.description || '',
        location: values.location,
        date: eventDate.toISOString(),
        is_online: values.isOnline,
        meeting_url: values.meetingUrl || '',
        type: values.type,
        created_by: user.id,
        max_attendees: values.maxAttendees ? parseInt(values.maxAttendees) : null,
      };

      // Insert event into Supabase
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select();

      if (error) throw error;

      // Close dialog and reset form
      setOpen(false);
      form.reset();
      
      // Refresh events list
      fetchEvents();
      
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully',
      });
    } catch (error: any) {
      console.error('Error creating event:', error.message);
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Watch the isOnline field to conditionally show meetingUrl
  const isOnline = form.watch('isOnline');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for prayer meetings, Bible studies, or conferences.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="prayer">Prayer Meeting</option>
                            <option value="bible_study">Bible Study</option>
                            <option value="conference">Conference</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isOnline"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Online Meeting</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This event will be held online with Jitsi Meet
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {isOnline && (
                    <FormField
                      control={form.control}
                      name="meetingUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting URL (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Custom Jitsi Meet URL (leave empty for auto-generated)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isOnline ? 'Virtual Location Name' : 'Location'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={isOnline ? "e.g., Main Prayer Room" : "Physical address"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Leave empty for unlimited" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <p>Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <EventList events={events} onEventUpdated={fetchEvents} />
            </div>
            <div>
              <UpcomingEvents 
                events={events.slice(0, 5).map(event => ({
                  id: event.id,
                  title: event.title,
                  date: format(new Date(event.date), 'MMM d, yyyy • h:mm a'),
                  attendees: event.attendees_count || 0
                }))} 
                className="mb-6" 
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
