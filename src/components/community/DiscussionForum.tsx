import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock, Hash } from 'lucide-react';

interface DiscussionThread {
  id: string;
  title: string;
  author: string;
  timestamp: Date;
  tags: string[];
  replies: number;
  content: string;
}

const DiscussionForum = () => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    currentTag: ''
  });

  const handleCreateThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return;
    
    const thread: DiscussionThread = {
      id: Date.now().toString(),
      title: newThread.title,
      author: 'You',
      timestamp: new Date(),
      tags: newThread.tags,
      replies: 0,
      content: newThread.content
    };
    
    setThreads([thread, ...threads]);
    setNewThread({
      title: '',
      content: '',
      tags: [],
      currentTag: ''
    });
  };

  const handleAddTag = () => {
    if (newThread.currentTag.trim() && !newThread.tags.includes(newThread.currentTag)) {
      setNewThread({
        ...newThread,
        tags: [...newThread.tags, newThread.currentTag],
        currentTag: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion Forum
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Start a New Discussion</h3>
          <Input
            placeholder="Discussion title"
            value={newThread.title}
            onChange={(e) => setNewThread({...newThread, title: e.target.value})}
          />
          <Textarea
            placeholder="Your discussion content..."
            value={newThread.content}
            onChange={(e) => setNewThread({...newThread, content: e.target.value})}
            rows={4}
          />
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add tags (press enter)"
              value={newThread.currentTag}
              onChange={(e) => setNewThread({...newThread, currentTag: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newThread.tags.map(tag => (
              <Badge key={tag} variant="outline">
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <Button className="w-full" onClick={handleCreateThread}>
            Post Discussion
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recent Discussions</h3>
          {threads.length === 0 ? (
            <p className="text-muted-foreground text-sm">No discussions yet</p>
          ) : (
            <div className="space-y-4">
              {threads.map(thread => (
                <div key={thread.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{thread.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{thread.author}</span>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {thread.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{thread.content}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {thread.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {thread.replies}
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

export default DiscussionForum;
