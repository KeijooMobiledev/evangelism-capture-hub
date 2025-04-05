import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video, MessageSquare, Mic, MicOff, VideoOff, VideoIcon } from 'lucide-react';
import JitsiMeet from '@/components/events/JitsiMeet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isPrayerTopic?: boolean;
  isPrayedFor?: boolean;
  suggestedVerses?: string[];
}

const VideoPrayerMeeting = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const roomName = `prayer-${Date.now()}`;

  useEffect(() => {
    if (!meetingStarted) return;

    const channel = supabase
      .channel(`prayer_requests:${roomName}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'prayer_requests',
        filter: `room_name=eq.${roomName}`
      }, (payload) => {
        console.log('Change received!', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingStarted, roomName]);

  const handleApiReady = (api: any) => {
    setJitsiApi(api);
    api.addEventListener('audioMuteStatusChanged', ({ muted }: { muted: boolean }) => {
      setIsAudioMuted(muted);
    });
    api.addEventListener('videoMuteStatusChanged', ({ muted }: { muted: boolean }) => {
      setIsVideoOff(muted);
    });
  };

  const handleSendMessage = async () => {
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

  const toggleAudio = async () => {
    try {
      if (jitsiApi) {
        await jitsiApi.executeCommand('toggleAudio');
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  const toggleVideo = async () => {
    try {
      if (jitsiApi) {
        await jitsiApi.executeCommand('toggleVideo');
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const togglePrayerTopic = async (messageId: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const updated = { 
          ...msg, 
          isPrayerTopic: !msg.isPrayerTopic,
          isPrayedFor: false
        };
        
        if (updated.isPrayerTopic && !updated.suggestedVerses) {
          updated.suggestedVerses = ['Suggested verses would appear here'];
        }
        return updated;
      }
      return msg;
    });

    setMessages(updatedMessages);
  };

  const markAsPrayed = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isPrayedFor: true } : msg
    ));
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
                  onApiReady={handleApiReady}
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
                  <div key={message.id} className={`mb-2 ${message.isPrayedFor ? 'opacity-70' : ''}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => togglePrayerTopic(message.id)}
                              >
                                {message.isPrayerTopic ? '🙏' : '✝️'}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Sujet de prière</TooltipContent>
                          </Tooltip>
                          {message.isPrayerTopic && !message.isPrayedFor && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => markAsPrayed(message.id)}
                                >
                                  ✓
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Marquer comme prié</TooltipContent>
                            </Tooltip>
                          )}
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className="text-sm">{message.text}</p>
                    {message.isPrayerTopic && message.suggestedVerses && (
                      <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
                        <h4 className="font-medium">Versets suggérés:</h4>
                        <ul className="list-disc pl-4">
                          {message.suggestedVerses.map((verse, i) => (
                            <li key={i}>{verse}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Écrivez un message..."
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
            <p>Commencez une réunion de prière vidéo</p>
            <Button onClick={() => setMeetingStarted(true)}>
              <Video className="h-4 w-4 mr-2" />
              Démarrer la réunion
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPrayerMeeting;
