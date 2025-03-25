
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Calendar, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface PrayerRequest {
  id: string;
  text: string;
  date: string;
  isAnswered: boolean;
  notes?: string;
}

const PrayerJournal: React.FC = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState("");
  const [showAnswered, setShowAnswered] = useState(false);
  
  // Load prayer requests from local storage on component mount
  useEffect(() => {
    const savedRequests = localStorage.getItem("prayerRequests");
    if (savedRequests) {
      setPrayerRequests(JSON.parse(savedRequests));
    }
  }, []);
  
  // Save prayer requests to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("prayerRequests", JSON.stringify(prayerRequests));
  }, [prayerRequests]);
  
  const addPrayerRequest = () => {
    if (!newRequest.trim()) return;
    
    const newPrayerRequest: PrayerRequest = {
      id: crypto.randomUUID(),
      text: newRequest,
      date: new Date().toISOString(),
      isAnswered: false,
    };
    
    setPrayerRequests([newPrayerRequest, ...prayerRequests]);
    setNewRequest("");
    toast({
      title: "Prayer request added",
      description: "Your prayer request has been added to your journal."
    });
  };
  
  const toggleAnswered = (id: string) => {
    setPrayerRequests(
      prayerRequests.map(request => 
        request.id === id 
          ? { ...request, isAnswered: !request.isAnswered } 
          : request
      )
    );
    
    const request = prayerRequests.find(r => r.id === id);
    if (request) {
      toast({
        title: request.isAnswered ? "Marked as unanswered" : "Marked as answered!",
        description: request.isAnswered 
          ? "Prayer request marked as unanswered." 
          : "Praise God! Prayer request marked as answered."
      });
    }
  };
  
  const deletePrayerRequest = (id: string) => {
    setPrayerRequests(prayerRequests.filter(request => request.id !== id));
    toast({
      title: "Prayer request deleted",
      description: "Your prayer request has been removed from your journal."
    });
  };
  
  const filteredRequests = showAnswered 
    ? prayerRequests 
    : prayerRequests.filter(request => !request.isAnswered);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Prayer Journal</span>
          <Badge 
            variant={showAnswered ? "outline" : "default"}
            className="cursor-pointer"
            onClick={() => setShowAnswered(!showAnswered)}
          >
            {showAnswered ? "Showing All" : "Hiding Answered"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a prayer request..."
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPrayerRequest()}
          />
          <Button onClick={addPrayerRequest}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {showAnswered 
                ? "Your prayer journal is empty. Add your first prayer request above."
                : "No active prayer requests. Toggle to show answered prayers or add a new request above."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-3 border rounded-lg ${
                    request.isAnswered ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        checked={request.isAnswered}
                        onCheckedChange={() => toggleAnswered(request.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className={request.isAnswered ? "line-through text-muted-foreground" : ""}>
                          {request.text}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(request.date), "MMM d, yyyy")}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {format(new Date(request.date), "h:mm a")}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => deletePrayerRequest(request.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {request.isAnswered && (
                    <Badge variant="success" className="mt-2">
                      <Check className="h-3 w-3 mr-1" /> Answered
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <span>Total: {prayerRequests.length} requests</span>
        <span>Answered: {prayerRequests.filter(r => r.isAnswered).length}</span>
      </CardFooter>
    </Card>
  );
};

export default PrayerJournal;
