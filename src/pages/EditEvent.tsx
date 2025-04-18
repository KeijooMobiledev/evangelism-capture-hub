
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

// Define the event type literals
type EventType = "evangelism" | "prayer" | "training" | "outreach" | "bible_study" | "other";

interface EventData {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  is_online: boolean;
  location: string;
  max_attendees?: number;
  [key: string]: any;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(["evangelism", "prayer", "training", "outreach", "bible_study", "other"]),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time'),
  is_online: z.boolean().default(false),
  location: z.string().optional(),
  max_attendees: z.coerce.number().int().positive().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { api, isLoading } = useApi();
  const [isOnline, setIsOnline] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'evangelism',
      is_online: false,
      max_attendees: 20,
    },
  });

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) return;
    
    setIsLoadingEvent(true);
    
    try {
      const eventData = await api.events.getById(id) as EventData;
      
      if (eventData) {
        const eventDate = new Date(eventData.date);
        const hours = eventDate.getHours().toString().padStart(2, '0');
        const minutes = eventDate.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        setIsOnline(eventData.is_online);
        
        form.reset({
          title: eventData.title,
          description: eventData.description,
          // Ensure the type is cast to the correct type
          type: eventData.type as EventType,
          date: eventDate,
          time: timeString,
          is_online: eventData.is_online,
          location: eventData.location,
          max_attendees: eventData.max_attendees || 20,
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEvent(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      const dateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      dateTime.setHours(hours, minutes);

      const eventData = {
        ...data,
        date: dateTime.toISOString(),
      };
      
      delete eventData.time;
      
      const result = await api.events.update(id, eventData);
      
      if (result) {
        toast({
          title: 'Event Updated',
          description: 'Your event has been successfully updated.',
        });
        
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingEvent) {
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

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => navigate(`/events/${id}`)}
          >
            Back to Event
          </Button>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground mt-1">Update your evangelism event details</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>
              Update the details of your evangelism event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your event a clear, descriptive name
                      </FormDescription>
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
                          placeholder="Describe your event" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Explain the purpose and activities of your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="evangelism">Evangelism</SelectItem>
                            <SelectItem value="prayer">Prayer Meeting</SelectItem>
                            <SelectItem value="training">Training Session</SelectItem>
                            <SelectItem value="outreach">Community Outreach</SelectItem>
                            <SelectItem value="bible_study">Bible Study</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="max_attendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter max number of attendees" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty for unlimited attendance
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                variant={"outline"}
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
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="time"
                              placeholder="Select time"
                              {...field}
                            />
                          </FormControl>
                          <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <FormField
                  control={form.control}
                  name="is_online"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Online Event</FormLabel>
                        <FormDescription>
                          Is this an online virtual event?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsOnline(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {!isOnline && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter physical location" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where will this event take place?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <CardFooter className="px-0 pt-6">
                  <Button type="submit" disabled={isLoading} className="mr-2">
                    {isLoading ? 'Updating...' : 'Update Event'}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => navigate(`/events/${id}`)}>
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditEvent;
