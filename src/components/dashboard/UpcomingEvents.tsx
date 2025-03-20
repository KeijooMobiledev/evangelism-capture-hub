
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string | number;
  title: string;
  date: string;
  attendees: number;
}

interface UpcomingEventsProps {
  events: Event[];
  className?: string;
}

const UpcomingEvents = ({ events, className }: UpcomingEventsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Add event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-muted-foreground mr-4">
                  {event.attendees} attending
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
