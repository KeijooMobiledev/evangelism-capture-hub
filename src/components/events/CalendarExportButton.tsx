import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarPlus, Download, Mail, ExternalLink } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CalendarEvent = {
  title: string;
  description?: string;
  location: string;
  start: Date;
  end: Date; 
  isOnline?: boolean;
  meetingUrl?: string;
};

const CalendarExportButton: React.FC<{event: CalendarEvent}> = ({ event }) => {
  const generateICS = () => {
    const { title, description, location, start, end, isOnline, meetingUrl } = event;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@evangelizai`,
      `DTSTAMP:${format(new Date(), 'yyyyMMddTHHmmss')}Z`,
      `DTSTART:${format(start, 'yyyyMMddTHHmmss')}`,
      `DTEND:${format(end, 'yyyyMMddTHHmmss')}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description || ''}\n\n${isOnline ? `Meeting URL: ${meetingUrl || ''}` : location}`,
      `LOCATION:${isOnline ? 'Online Event' : location}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    return new Blob([icsContent], { type: 'text/calendar' });
  };

  const handleDownload = () => {
    const blob = generateICS();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_event.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Calendar event downloaded",
    });
  };

  const handleEmail = () => {
    const blob = generateICS();
    const url = URL.createObjectURL(blob);
    window.open(`mailto:?subject=Event: ${event.title}&body=${encodeURIComponent(event.description || 'Join me at this event!')}&attachment=${url}`);
  };

  const generateGoogleCalendarUrl = () => {
    const { title, description, location, start, end } = event;
    const params = new URLSearchParams({
      text: title,
      dates: `${format(start, 'yyyyMMddTHHmmss')}/${format(end, 'yyyyMMddTHHmmss')}`,
      details: description || '',
      location: location,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sf: 'true',
      output: 'xml'
    });
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <CalendarPlus className="h-4 w-4" />
          <span>Add to Calendar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          <span>Download ICS File</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Email Invitation</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => window.open(generateGoogleCalendarUrl(), '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Google Calendar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CalendarExportButton;
