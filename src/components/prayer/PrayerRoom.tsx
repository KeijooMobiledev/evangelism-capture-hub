import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bell, Link2, Clock, Book } from 'lucide-react';
import { PrayerJournal } from './PrayerJournal';

interface PrayerRequest {
  id: string;
  author: string;
  request: string;
  prayerCount: number;
  timestamp: Date;
  chainId?: string;
}

export const PrayerRoom = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState('');
  const [activeChains, setActiveChains] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showJournal, setShowJournal] = useState(false);

  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [prayerFocus, setPrayerFocus] = useState('Personal Reflection');

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://example.com/prayer-updates');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_request') {
        setRequests(prev => [data.request, ...prev]);
        setNotifications(prev => [
          `New prayer request from ${data.request.author}`,
          ...prev
        ]);
      }
      if (data.type === 'prayer_chain') {
        setActiveChains(prev => [...new Set([...prev, data.chainId])]);
      }
    };

    return () => ws.close();
  }, []);

  const startPrayerTimer = (focus: string) => {
    setPrayerFocus(focus);
    setTimerActive(true);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitRequest = () => {
    if (!newRequest.trim()) return;
    
    const newPrayerRequest = {
      id: Date.now().toString(),
      author: 'You',
      request: newRequest,
      prayerCount: 0,
      timestamp: new Date()
    };
    
    setRequests([newPrayerRequest, ...requests]);
    setNewRequest('');
  };

  const startPrayerChain = (requestId: string) => {
    const chainId = `chain-${Date.now()}`;
    setRequests(requests.map(req => 
      req.id === requestId ? {...req, chainId} : req
    ));
    setActiveChains([...activeChains, chainId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Prayer Notifications</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setNotifications([])}
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((note, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                {note}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Prayer Requests */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Prayer Requests</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowJournal(!showJournal)}
              >
                <Book className="h-4 w-4 mr-2" />
                {showJournal ? 'Hide Journal' : 'Show Journal'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Share your prayer request..." 
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                />
                <Button className="w-full" onClick={submitRequest}>
                  Submit Request
                </Button>
              </div>
              
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">{request.author}</p>
                      {request.chainId && (
                        <Badge variant="secondary">
                          <Link2 className="h-3 w-3 mr-1" />
                          Prayer Chain
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2">{request.request}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {request.prayerCount} people praying
                      </span>
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm">
                          I Prayed For This
                        </Button>
                        {!request.chainId && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startPrayerChain(request.id)}
                          >
                            Start Prayer Chain
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guided Prayer */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Guided Prayer Time</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => startPrayerTimer('Personal Reflection')}
                      disabled={timerActive}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Personal Prayer
                    </Button>
                    <Button
                      onClick={() => startPrayerTimer('Intercession')}
                      disabled={timerActive}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Intercession
                    </Button>
                  </div>
                </div>

                {timerActive && (
                  <div className="space-y-4 mt-4">
                    <p className="text-center font-medium">
                      Current Focus: {prayerFocus}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>Suggested Prayer Points:</p>
                      <ul className="list-disc list-inside mt-2">
                        {prayerFocus === 'Personal Reflection' ? (
                          <>
                            <li>Thank God for His blessings</li>
                            <li>Confess any sins or struggles</li>
                            <li>Ask for guidance and wisdom</li>
                          </>
                        ) : (
                          <>
                            <li>Pray for church leaders</li>
                            <li>Pray for those in need</li>
                            <li>Pray for global missions</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {showJournal && <PrayerJournal />}
        </div>
      </div>
    </div>
  );
};
