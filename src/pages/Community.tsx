import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmallGroupManager from '@/components/community/SmallGroupManager';
import PrayerRequestSharing from '@/components/community/PrayerRequestSharing';
import DiscussionForum from '@/components/community/DiscussionForum';
import { Users, Heart, MessageSquare, Video } from 'lucide-react';
import VideoPrayerMeeting from '@/components/community/VideoPrayerMeeting';

const Community = () => {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Community Hub</h1>
          <p className="text-muted-foreground mt-1">
            Connect with others through small groups, prayer requests, discussions, and live video meetings
          </p>
        </div>

        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Small Groups
            </TabsTrigger>
            <TabsTrigger value="prayer" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Prayer Requests
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="video-prayer" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Prayer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-6">
            <SmallGroupManager />
          </TabsContent>

          <TabsContent value="prayer" className="mt-6">
            <PrayerRequestSharing />
          </TabsContent>

          <TabsContent value="discussions" className="mt-6">
            <DiscussionForum />
          </TabsContent>
          <TabsContent value="video-prayer" className="mt-6">
            <VideoPrayerMeeting />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;
