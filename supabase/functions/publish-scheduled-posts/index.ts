import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Pusher from 'https://esm.sh/pusher@5.0.2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const pusher = new Pusher({
    appId: Deno.env.get('PUSHER_APP_ID')!,
    key: Deno.env.get('PUSHER_KEY')!,
    secret: Deno.env.get('PUSHER_SECRET')!,
    cluster: Deno.env.get('PUSHER_CLUSTER')!,
    useTLS: true
  });

  const { data: scheduledPosts, error } = await supabase
    .from('scheduled_posts')
    .select('*, social_posts(*)')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString());

  if (error) {
    console.error('Error fetching scheduled posts:', error);
    return new Response('Error', { status: 500 });
  }

  for (const post of scheduledPosts || []) {
    try {
      let success = true;

      for (const platform of post.platforms) {
        if (platform === 'facebook') {
          try {
            const fbResponse = await fetch(`https://graph.facebook.com/v18.0/me/photos`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN')}`
              },
              body: new URLSearchParams({
                url: post.social_posts.image_url,
                caption: post.social_posts.generated_text
              })
            });
            const fbData = await fbResponse.json();
            console.log('Facebook response:', fbData);
            if (!fbData.id) success = false;
          } catch (error) {
            console.error('Facebook error:', error);
            success = false;
          }
        }

        if (platform === 'whatsapp') {
          try {
            const waResponse = await fetch(`https://graph.facebook.com/v18.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: Deno.env.get('WHATSAPP_TEST_NUMBER'),
                type: 'text',
                text: { body: post.social_posts.generated_text }
              })
            });
            const waData = await waResponse.json();
            console.log('WhatsApp response:', waData);
            if (!waData.messages) success = false;
          } catch (error) {
            console.error('WhatsApp error:', error);
            success = false;
          }
        }
      }

      await supabase
        .from('scheduled_posts')
        .update({ status: success ? 'sent' : 'failed' })
        .eq('id', post.id);

      // Envoyer notification push via Pusher
      try {
        await pusher.trigger(`user-${post.user_id}`, 'post-status', {
          postId: post.id,
          status: success ? 'sent' : 'failed',
          message: success 
            ? `Votre post a bien été publié sur ${post.platforms.join(', ')}.`
            : `La publication de votre post a échoué.`
        });
      } catch (error) {
        console.error('Erreur envoi notification Pusher:', error);
      }
    } catch (err) {
      console.error('Error publishing post:', err);
      await supabase
        .from('scheduled_posts')
        .update({ status: 'failed' })
        .eq('id', post.id);
    }
  }

  return new Response('Done', { status: 200 });
});
