
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { addMinutes, addHours, addDays, format } from "date-fns";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventDate: Date;
  eventTitle: string;
}

const ReminderDialog = ({ open, onOpenChange, eventId, eventDate, eventTitle }: ReminderDialogProps) => {
  const [reminderType, setReminderType] = useState<"custom" | "before">("before");
  const [reminderTime, setReminderTime] = useState<Date | undefined>(undefined);
  const [beforeAmount, setBeforeAmount] = useState("30");
  const [beforeUnit, setBeforeUnit] = useState<"minutes" | "hours" | "days">("minutes");
  
  const calculateReminderTime = (): Date => {
    if (reminderType === "custom" && reminderTime) {
      return reminderTime;
    } else {
      const amount = parseInt(beforeAmount);
      switch (beforeUnit) {
        case "minutes":
          return addMinutes(new Date(eventDate), -amount);
        case "hours":
          return addHours(new Date(eventDate), -amount);
        case "days":
          return addDays(new Date(eventDate), -amount);
        default:
          return addMinutes(new Date(eventDate), -30); // Default: 30 minutes before
      }
    }
  };
  
  const handleSetReminder = async () => {
    try {
      const calculatedTime = calculateReminderTime();
      
      // Check if time is in the past
      if (calculatedTime < new Date()) {
        toast({
          title: "Invalid reminder time",
          description: "Reminder time cannot be in the past",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase.from('event_reminders').insert({
        event_id: eventId,
        reminder_time: calculatedTime.toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (error) throw error;
      
      toast({
        title: "Reminder set",
        description: `You'll be reminded of "${eventTitle}" on ${format(calculatedTime, 'PPp')}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set a Reminder</DialogTitle>
          <DialogDescription>
            Choose when you'd like to be reminded about "{eventTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reminder-type" className="text-right col-span-1">
              Reminder Type
            </Label>
            <Select 
              value={reminderType}
              onValueChange={(value) => setReminderType(value as "custom" | "before")}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Time before event</SelectItem>
                <SelectItem value="custom">Custom date and time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {reminderType === "before" ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">
                Remind me
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Select 
                  value={beforeAmount}
                  onValueChange={setBeforeAmount}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={beforeUnit}
                  onValueChange={(value) => setBeforeUnit(value as "minutes" | "hours" | "days")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                    <SelectItem value="days">days</SelectItem>
                  </SelectContent>
                </Select>
                
                <span>before</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">
                Custom Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={reminderTime}
                  onSelect={setReminderTime}
                  initialFocus
                  className="pointer-events-auto rounded-md border"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleSetReminder}>Set Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
