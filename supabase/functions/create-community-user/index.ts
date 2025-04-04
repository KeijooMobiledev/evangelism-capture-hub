import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user calling the function
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify the calling user is a community admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, community_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'community') {
      return new Response(JSON.stringify({ error: 'Unauthorized - Community admin required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate role
    if (!['supervisor', 'evangelist'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Invalid role' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create new user
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role,
        community_id: profile.community_id
      }
    })

    if (createError || !newUser) {
      return new Response(JSON.stringify({ error: createError?.message || 'Failed to create user' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create profile record
    const { error: profileCreateError } = await supabaseClient
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email,
        role,
        community_id: profile.community_id,
        created_by: user.id
      })

    if (profileCreateError) {
      return new Response(JSON.stringify({ error: profileCreateError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, user: newUser }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
