import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, MapPin, MessageSquare } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  meetingTime: string;
  location: string;
  focusArea: string;
}

const SmallGroupManager = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroup, setNewGroup] = useState<Omit<Group, 'id' | 'members'>>({ 
    name: '',
    description: '',
    meetingTime: '',
    location: '',
    focusArea: 'bible-study'
  });

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description) return;
    
    const group: Group = {
      ...newGroup,
      id: Date.now().toString(),
      members: []
    };
    
    setGroups([...groups, group]);
    setNewGroup({
      name: '',
      description: '',
      meetingTime: '',
      location: '',
      focusArea: 'bible-study'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Small Group Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium">Create New Group</h3>
            <Input
              placeholder="Group name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
            />
            <Textarea
              placeholder="Group description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Meeting time"
                value={newGroup.meetingTime}
                onChange={(e) => setNewGroup({...newGroup, meetingTime: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={newGroup.location}
                onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
              />
            </div>
            <Select
              value={newGroup.focusArea}
              onValueChange={(value) => setNewGroup({...newGroup, focusArea: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Focus area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bible-study">Bible Study</SelectItem>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="evangelism">Evangelism</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleCreateGroup}>
              Create Group
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Your Groups</h3>
            {groups.length === 0 ? (
              <p className="text-muted-foreground text-sm">No groups created yet</p>
            ) : (
              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {group.meetingTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {group.location}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm">
                        {group.members.length} members
                      </span>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmallGroupManager;
