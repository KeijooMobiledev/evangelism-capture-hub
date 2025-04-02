
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                    <AvatarFallback className="text-4xl">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{profile?.full_name || 'Anonymous User'}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {profile?.role || 'Member'}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Email</dt>
                    <dd className="text-sm sm:w-2/3">{user?.email}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Phone</dt>
                    <dd className="text-sm sm:w-2/3">{profile?.phone || 'Not specified'}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Role</dt>
                    <dd className="text-sm sm:w-2/3">{profile?.role || 'Member'}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Joined</dt>
                    <dd className="text-sm sm:w-2/3">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ministry Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground">Evangelism Events</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-muted-foreground">Contacts Made</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-muted-foreground">Resources Shared</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground">Areas Covered</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
