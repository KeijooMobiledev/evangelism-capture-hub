import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Post {
  id: string;
  theme: string;
  verse: string;
  generated_text: string;
  image_url: string;
  created_at: string;
}

const SavedPostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchPosts = async () => {
    if (!user) return;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', user.id)
      .ilike('theme', `%${search}%`)
      .order('created_at', { ascending: false })
      .range(from, to);
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Pensez à partager un post inspirant aujourd\'hui !');
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [user, page, search]);

  const handleDelete = async (id: string) => {
    await supabase.from('social_posts').delete().eq('id', id);
    fetchPosts();
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    await supabase.from('social_posts').update({
      theme: editingPost.theme,
      verse: editingPost.verse,
      generated_text: editingPost.generated_text
    }).eq('id', editingPost.id);
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Mes Posts Sauvegardés</h1>

      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Rechercher par thème..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.theme}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{post.verse}</p>
              <p>{post.generated_text}</p>
              {post.image_url && (
                <img src={post.image_url} alt="Post" className="rounded mt-2" />
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" onClick={() => setEditingPost(post)}>Modifier</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>Supprimer</Button>
                <Button size="sm" variant="outline" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.image_url)}`)}>Partager Facebook</Button>
                <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.generated_text + ' ' + post.image_url)}`)}>Partager WhatsApp</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">Modifier le post</h2>
            <Input 
              value={editingPost.theme}
              onChange={(e) => setEditingPost({...editingPost, theme: e.target.value})}
            />
            <Input 
              value={editingPost.verse}
              onChange={(e) => setEditingPost({...editingPost, verse: e.target.value})}
            />
            <Textarea 
              value={editingPost.generated_text}
              onChange={(e) => setEditingPost({...editingPost, generated_text: e.target.value})}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingPost(null)} variant="outline">Annuler</Button>
              <Button onClick={handleUpdate}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(page + 1)}>Suivant</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Statistiques</h2>
        <p>Total de posts : {posts.length}</p>
        {/* Ajoutez ici d'autres stats (par thème, par date, etc.) */}
      </div>
    </div>
  );
};

export default SavedPostsPage;
