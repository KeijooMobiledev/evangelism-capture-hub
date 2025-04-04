import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video, MessageSquare, Mic, MicOff, VideoOff, VideoIcon } from 'lucide-react';
import JitsiMeet from '@/components/events/JitsiMeet';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

const VideoPrayerMeeting = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const roomName = `prayer-${Date.now()}`;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    
    const senderName = profile?.full_name || user.email?.split('@')[0] || 'Anonymous';
    const message: Message = {
      id: Date.now().toString(),
      sender: senderName,
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    // TODO: Implement actual Jitsi audio toggle
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // TODO: Implement actual Jitsi video toggle
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Prayer Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meetingStarted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <JitsiMeet 
                  roomName={roomName}
                  displayName={profile?.full_name || user?.email?.split('@')[0] || 'Anonymous'}
                  onClose={() => setMeetingStarted(false)}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={toggleAudio}>
                  {isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isAudioMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleVideo}>
                  {isVideoOff ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  {isVideoOff ? 'Start Video' : 'Stop Video'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Live Chat</h3>
              <ScrollArea className="h-64 rounded-md border p-2">
                {messages.map((message) => (
                  <div key={message.id} className="mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <p>Start a video prayer meeting where you can pray together and chat in real-time</p>
            <Button onClick={() => setMeetingStarted(true)}>
              <Video className="h-4 w-4 mr-2" />
              Start Prayer Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPrayerMeeting;
