
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ENDPOINTS } from '@/utils/api';

const ApiDocs = () => {
  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Integration guide for mobile and third-party applications
      </p>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>EvangelioTrack API</CardTitle>
              <CardDescription>
                RESTful API for mobile applications and third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The EvangelioTrack API provides a comprehensive set of endpoints for integrating 
                with mobile applications and third-party services. The API follows REST principles 
                and uses JSON for request and response payloads.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Base URL</h3>
              <code className="block bg-muted p-2 rounded">
                https://rqswoltcvzccnaafnzvq.supabase.co/functions/v1/api
              </code>
              
              <h3 className="text-lg font-medium mt-4">Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication using JWT tokens</li>
                <li>Access to evangelism events and resources</li>
                <li>Community member information</li>
                <li>Analytics and statistics</li>
                <li>Comprehensive error handling</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="authentication" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                How to authenticate with the API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All API requests must include an authorization token in the request headers. 
                This token is obtained through the Supabase authentication process.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Authentication Header</h3>
              <code className="block bg-muted p-2 rounded">
                Authorization: Bearer {'{your-jwt-token}'}
              </code>
              
              <h3 className="text-lg font-medium mt-4">Obtaining a Token</h3>
              <p>
                To obtain a JWT token, you need to authenticate using the Supabase authentication service:
              </p>
              
              <div className="bg-muted p-4 rounded overflow-x-auto">
                <pre>{`
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Use the access token in API requests
const token = data.session.access_token
                `}</pre>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Token Expiration</h3>
              <p>
                JWT tokens have an expiration time. Make sure to refresh the token when needed using the refresh token.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="endpoints" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Available API endpoints and their descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">Evangelists</h3>
              <ul className="list-none space-y-4 mt-2">
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_EVANGELISTS}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get a list of all evangelists</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_EVANGELIST}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get details of a specific evangelist</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6">Events</h3>
              <ul className="list-none space-y-4 mt-2">
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_EVENTS}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get a list of all events</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_EVENT}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get details of a specific event</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">POST</span>
                    <code>{API_ENDPOINTS.GET_EVENTS}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Create a new event</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">PUT</span>
                    <code>{API_ENDPOINTS.GET_EVENT}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Update an existing event</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">DELETE</span>
                    <code>{API_ENDPOINTS.GET_EVENT}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Delete an event</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">POST</span>
                    <code>{API_ENDPOINTS.ATTEND_EVENT}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Register attendance for an event</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6">Resources</h3>
              <ul className="list-none space-y-4 mt-2">
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_RESOURCES}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get a list of all resources</p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_RESOURCE}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get details of a specific resource</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6">Statistics</h3>
              <ul className="list-none space-y-4 mt-2">
                <li className="border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                    <code>{API_ENDPOINTS.GET_EVANGELISM_STATS}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get evangelism statistics</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Usage</CardTitle>
              <CardDescription>
                Code examples for using the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">Fetch Events</h3>
              <div className="bg-muted p-4 rounded overflow-x-auto mt-2">
                <pre>{`
// JavaScript Example
const fetchEvents = async () => {
  const token = "your-auth-token";
  
  const response = await fetch(
    "https://rqswoltcvzccnaafnzvq.supabase.co/functions/v1/api/events?upcoming=true", 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${token}\`
      }
    }
  );
  
  const data = await response.json();
  console.log(data.events);
};
                `}</pre>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Create an Event</h3>
              <div className="bg-muted p-4 rounded overflow-x-auto mt-2">
                <pre>{`
// JavaScript Example
const createEvent = async () => {
  const token = "your-auth-token";
  
  const eventData = {
    title: "Bible Study",
    description: "Weekly Bible study session",
    location: "Community Center",
    date: "2023-08-15T18:00:00Z",
    is_online: false,
    type: "bible_study"
  };
  
  const response = await fetch(
    "https://rqswoltcvzccnaafnzvq.supabase.co/functions/v1/api/events", 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${token}\`
      },
      body: JSON.stringify(eventData)
    }
  );
  
  const data = await response.json();
  console.log(data.event);
};
                `}</pre>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Attend an Event</h3>
              <div className="bg-muted p-4 rounded overflow-x-auto mt-2">
                <pre>{`
// JavaScript Example
const attendEvent = async (eventId) => {
  const token = "your-auth-token";
  
  const response = await fetch(
    \`https://rqswoltcvzccnaafnzvq.supabase.co/functions/v1/api/events/\${eventId}/attend\`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${token}\`
      },
      body: JSON.stringify({ status: "attending" })
    }
  );
  
  const data = await response.json();
  console.log(data.attendance);
};
                `}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocs;
