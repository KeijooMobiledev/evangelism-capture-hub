
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract the route from the URL
    const url = new URL(req.url);
    const path = url.pathname.replace('/api', ''); // Remove the /api prefix
    
    // Extract the authorization token
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract query parameters
    const queryParams = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    // Extract request body for POST/PUT requests
    let body = null;
    if (req.method === 'POST' || req.method === 'PUT') {
      body = await req.json().catch(() => null);
    }
    
    // Process the API request based on the path and method
    const result = await processApiRequest(supabase, user, {
      path,
      method: req.method,
      queryParams,
      body,
    });
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Process the API request based on the path, method, and parameters
 */
async function processApiRequest(supabase, user, options) {
  const { path, method, queryParams, body } = options;
  
  // Evangelists endpoints
  if (path.match(/^\/evangelists\/?$/)) {
    // GET /evangelists - List all evangelists
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, role, created_at')
        .eq('role', 'evangelist');
      
      if (error) throw error;
      return { evangelists: data };
    }
  }
  
  // Single evangelist endpoint
  if (path.match(/^\/evangelists\/[^\/]+\/?$/)) {
    const evangelistId = path.split('/')[2];
    
    // GET /evangelists/:id - Get a specific evangelist
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, role, phone, created_at')
        .eq('id', evangelistId)
        .single();
      
      if (error) throw error;
      return { evangelist: data };
    }
  }
  
  // Events endpoints
  if (path.match(/^\/events\/?$/)) {
    // GET /events - List all events
    if (method === 'GET') {
      let query = supabase
        .from('events')
        .select(`
          id, title, description, location, date, 
          is_online, meeting_url, type, created_by, 
          max_attendees, created_at, updated_at,
          event_attendees!inner(user_id, status)
        `);
      
      // Filter by event type if provided
      if (queryParams.type) {
        query = query.eq('type', queryParams.type);
      }
      
      // Filter by upcoming events
      if (queryParams.upcoming === 'true') {
        query = query.gte('date', new Date().toISOString());
      }
      
      // Order by date
      query = query.order('date', { ascending: queryParams.order === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { events: data };
    }
    
    // POST /events - Create a new event
    if (method === 'POST' && body) {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...body,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return { event: data };
    }
  }
  
  // Single event endpoint
  if (path.match(/^\/events\/[^\/]+\/?$/)) {
    const eventId = path.split('/')[2];
    
    // GET /events/:id - Get a specific event
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, description, location, date, 
          is_online, meeting_url, type, created_by, 
          max_attendees, created_at, updated_at,
          event_attendees(user_id, status, joined_at)
        `)
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return { event: data };
    }
    
    // PUT /events/:id - Update an event
    if (method === 'PUT' && body) {
      // Check if user is the creator of the event
      const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('created_by')
        .eq('id', eventId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (event.created_by !== user.id) {
        throw new Error('Only the creator can update the event');
      }
      
      const { data, error } = await supabase
        .from('events')
        .update(body)
        .eq('id', eventId)
        .select()
        .single();
      
      if (error) throw error;
      return { event: data };
    }
    
    // DELETE /events/:id - Delete an event
    if (method === 'DELETE') {
      // Check if user is the creator of the event
      const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('created_by')
        .eq('id', eventId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (event.created_by !== user.id) {
        throw new Error('Only the creator can delete the event');
      }
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      return { success: true };
    }
  }
  
  // Event attendance endpoint
  if (path.match(/^\/events\/[^\/]+\/attend\/?$/)) {
    const eventId = path.split('/')[2];
    
    // POST /events/:id/attend - Attend an event
    if (method === 'POST' && body) {
      const { status } = body;
      
      if (!['attending', 'declined'].includes(status)) {
        throw new Error('Invalid status. Must be "attending" or "declined"');
      }
      
      // Check if already registered
      const { data: existing, error: fetchError } = await supabase
        .from('event_attendees')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', user.id);
      
      if (fetchError) throw fetchError;
      
      let result;
      
      if (existing && existing.length > 0) {
        // Update existing attendance
        const { data, error } = await supabase
          .from('event_attendees')
          .update({ status })
          .eq('id', existing[0].id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new attendance
        const { data, error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return { attendance: result };
    }
  }
  
  // Resources endpoints
  if (path.match(/^\/resources\/?$/)) {
    // GET /resources - List all resources
    if (method === 'GET') {
      let query = supabase
        .from('spiritual_resources')
        .select(`
          id, title, description, type, file_url, 
          thumbnail_url, created_by, category_id, 
          created_at, updated_at, downloads, 
          size_bytes, duration_seconds, allow_download,
          category:resource_categories(id, name)
        `);
      
      // Filter by resource type if provided
      if (queryParams.type && queryParams.type !== 'all') {
        query = query.eq('type', queryParams.type);
      }
      
      // Filter by category if provided
      if (queryParams.categoryId) {
        query = query.eq('category_id', queryParams.categoryId);
      }
      
      // Search query if provided
      if (queryParams.search) {
        query = query.or(`title.ilike.%${queryParams.search}%,description.ilike.%${queryParams.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Fetch bookmarks for the user
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('resource_bookmarks')
        .select('resource_id')
        .eq('user_id', user.id);
      
      if (bookmarksError) throw bookmarksError;
      
      const bookmarkedIds = new Set(bookmarks?.map(b => b.resource_id) || []);
      
      // Add is_bookmarked flag to resources
      const resourcesWithBookmarks = data.map(resource => ({
        ...resource,
        is_bookmarked: bookmarkedIds.has(resource.id)
      }));
      
      return { resources: resourcesWithBookmarks };
    }
  }
  
  // Statistics endpoints
  if (path === '/stats/evangelism') {
    // GET /stats/evangelism - Get evangelism statistics
    if (method === 'GET') {
      // Get events created by the user
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('created_by', user.id);
      
      if (eventsError) throw eventsError;
      
      // Get events attended by the user
      const { data: attendances, error: attendancesError } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'attending');
      
      if (attendancesError) throw attendancesError;
      
      // Get resources created by the user
      const { data: resources, error: resourcesError } = await supabase
        .from('spiritual_resources')
        .select('id, downloads')
        .eq('created_by', user.id);
      
      if (resourcesError) throw resourcesError;
      
      // Calculate total downloads
      const totalDownloads = resources.reduce((sum, resource) => sum + (resource.downloads || 0), 0);
      
      return {
        eventsCreated: events.length,
        eventsAttended: attendances.length,
        resourcesCreated: resources.length,
        totalDownloads
      };
    }
  }
  
  throw new Error(`Endpoint not found: ${method} ${path}`);
}
