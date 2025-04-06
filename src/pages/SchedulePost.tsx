import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Post {
  id: string;
  theme: string;
  verse: string;
  generated_text: string;
  image_url: string;
}

const SchedulePostPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, [user]);

  const togglePlatform = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = async () => {
    if (!user || !selectedPostId || !scheduledAt || platforms.length === 0) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .insert({
          user_id: user.id,
          post_id: selectedPostId,
          scheduled_at: scheduledAt,
          platforms,
          status: 'pending'
        });
      if (error) throw error;
      alert('Publication programmée avec succès');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la programmation");
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Programmer une publication</h1>

      <div className="space-y-4">
        <div>
          <label>Choisir un post</label>
          <select
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Sélectionner --</option>
            {posts.map(post => (
              <option key={post.id} value={post.id}>
                {post.theme} - {post.verse}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date et heure</label>
          <Input 
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div>
          <label>Plateformes</label>
          <div className="flex gap-4 mt-2">
            {['facebook', 'whatsapp', 'instagram'].map(p => (
              <Button 
                key={p}
                variant={platforms.includes(p) ? 'default' : 'outline'}
                onClick={() => togglePlatform(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleSchedule} className="mt-4">
          Programmer
        </Button>
      </div>
    </div>
  );
};

export default SchedulePostPage;
