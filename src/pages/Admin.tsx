import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Shield, 
  Users, 
  Settings, 
  UserCheck, 
  UserX,
  FileText, 
  BarChart3, 
  Download,
  Lock,
  Eye,
  Search,
  UserCog,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BlogPostManager from '@/components/admin/BlogPostManager';

const Admin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for users - would normally fetch from Supabase
  const users = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'community', status: 'Active', lastActive: '2 hours ago' },
    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', role: 'evangelist', status: 'Active', lastActive: '1 day ago' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'community', status: 'Inactive', lastActive: '1 week ago' },
    { id: 4, name: 'Emily Chen', email: 'emily@example.com', role: 'supervisor', status: 'Active', lastActive: '3 minutes ago' },
    { id: 5, name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'evangelist', status: 'Pending', lastActive: 'Never' }
  ];
  
  // Mock data for audit logs
  const auditLogs = [
    { id: 1, action: 'User Login', user: 'john@example.com', timestamp: '2023-07-01 14:23:15', ip: '192.168.1.1' },
    { id: 2, action: 'Role Changed', user: 'admin@example.com', target: 'maria@example.com', details: 'Role changed from community to evangelist', timestamp: '2023-07-01 12:10:45', ip: '192.168.1.5' },
    { id: 3, action: 'Resource Added', user: 'emily@example.com', details: 'Added Bible Study Material', timestamp: '2023-06-30 09:45:22', ip: '192.168.1.10' },
    { id: 4, action: 'User Suspension', user: 'admin@example.com', target: 'robert@example.com', details: 'Account temporarily suspended', timestamp: '2023-06-29 16:37:51', ip: '192.168.1.5' },
    { id: 5, action: 'Settings Updated', user: 'admin@example.com', details: 'Changed notification settings', timestamp: '2023-06-29 11:21:33', ip: '192.168.1.5' }
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeUserRole = async (userId: number, newRole: string) => {
    // In a real implementation, this would update the database
    toast({
      title: "Role updated",
      description: `User ${userId} role changed to ${newRole}`,
    });
  };

  const exportData = (dataType: string) => {
    toast({
      title: "Export initiated",
      description: `${dataType} data is being prepared for download`,
    });
    // In a real implementation, this would generate and download a file
  };

  return (
    <AdminDashboardLayout>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="users" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex gap-2 items-center">
            <UserCog className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Global Settings
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex gap-2 items-center">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>
                    Manage all registered users across the platform
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={() => exportData('users')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'supervisor' ? 'default' : user.role === 'evangelist' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'destructive' : 'warning'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Lock className="h-4 w-4" />
                          </Button>
                          {user.status === 'Active' ? (
                            <Button variant="ghost" size="icon">
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Roles & Permissions Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Configure access levels and customize roles across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Community Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Access to basic platform features</li>
                      <li>View and download resources</li>
                      <li>Participate in events</li>
                      <li>Message other community members</li>
                    </ul>
                    <Button className="w-full mt-4">Edit Permissions</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Evangelists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>All Community Member permissions</li>
                      <li>Upload resources for approval</li>
                      <li>Create and manage events</li>
                      <li>Access to advanced analytics</li>
                    </ul>
                    <Button className="w-full mt-4">Edit Permissions</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Supervisors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>All Evangelist permissions</li>
                      <li>Access to admin dashboard</li>
                      <li>Approve resources and events</li>
                      <li>Manage user accounts</li>
                      <li>Access to all platform data</li>
                    </ul>
                    <Button className="w-full mt-4">Edit Permissions</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Blog Posts Tab */}
        <TabsContent value="blog">
          <BlogPostManager />
        </TabsContent>
        
        {/* Global Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Global Application Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Event Reminders</p>
                        <p className="text-sm text-muted-foreground">Send reminders for upcoming events</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" className="w-16" defaultValue={24} />
                        <span>hours before</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Welcome Emails</p>
                        <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                      </div>
                      <Button variant="outline">Edit Template</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Notifications</p>
                        <p className="text-sm text-muted-foreground">Important system-wide alerts</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" className="w-16" defaultValue={30} />
                        <span>minutes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Restrictions</p>
                        <p className="text-sm text-muted-foreground">Limit admin access by IP address</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Appearance & Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium mb-2">Primary Color</p>
                      <div className="flex gap-2">
                        <div className="h-10 w-10 rounded-md bg-primary border"></div>
                        <Input defaultValue="#0091FF" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Logo</p>
                      <Button variant="outline" className="w-full">Upload Logo</Button>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Default Language</p>
                      <select className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Logs Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Activity & Audit Logs</CardTitle>
                  <CardDescription>
                    Complete record of all system activities and user actions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-9 w-[250px]" />
                  </div>
                  <Button variant="outline" onClick={() => exportData('logs')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.details || `Target: ${log.target || 'N/A'}`}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Advanced Reports</CardTitle>
                  <CardDescription>
                    Generate and download detailed platform analytics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Growth Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Detailed statistics on user registration and retention over time</p>
                    <Button onClick={() => exportData('user_growth')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Activity Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Analysis of user engagement and platform activity patterns</p>
                    <Button onClick={() => exportData('activity_metrics')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Statistics on resource uploads, downloads, and most popular materials</p>
                    <Button onClick={() => exportData('resource_utilization')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Geographic Reach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Map-based analysis of evangelism activities by location</p>
                    <Button onClick={() => exportData('geographic_reach')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Event Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Comprehensive data on event attendance and engagement</p>
                    <Button onClick={() => exportData('event_analytics')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Custom Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Create a custom report with selected metrics and dimensions</p>
                    <Button variant="outline" className="w-full">
                      Configure Custom Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default Admin;
