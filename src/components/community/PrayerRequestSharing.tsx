import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, User, MessageSquare } from 'lucide-react';

interface PrayerRequest {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  privacy: 'public' | 'group' | 'private';
  responses: number;
}

const PrayerRequestSharing = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    content: '',
    privacy: 'public' as const
  });

  const handleSubmitRequest = () => {
    if (!newRequest.content.trim()) return;
    
    const request: PrayerRequest = {
      id: Date.now().toString(),
      content: newRequest.content,
      author: 'You',
      timestamp: new Date(),
      privacy: newRequest.privacy,
      responses: 0
    };
    
    setRequests([request, ...requests]);
    setNewRequest({ content: '', privacy: 'public' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Prayer Request Sharing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Share your prayer request..."
            value={newRequest.content}
            onChange={(e) => setNewRequest({...newRequest, content: e.target.value})}
            rows={4}
          />
          <div className="flex items-center gap-4">
            <Select
              value={newRequest.privacy}
              onValueChange={(value) => setNewRequest({...newRequest, privacy: value as any})}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="group">Group Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSubmitRequest}>
              Share Request
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recent Prayer Requests</h3>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">No prayer requests shared yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {request.timestamp.toLocaleDateString()}
                        </span>
                        <Badge variant="secondary">
                          {request.privacy}
                        </Badge>
                      </div>
                      <p className="mt-2">{request.content}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {request.responses}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerRequestSharing;
