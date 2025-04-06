import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SocialPostCreator = () => {
  const [theme, setTheme] = useState('');
  const [category, setCategory] = useState('encouragement');
  const [verse, setVerse] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [template, setTemplate] = useState('classic');
  const [finalImage, setFinalImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTextWithAI = async () => {
    setLoading(true);
    try {
      const prompt = `Crée un post chrétien inspirant sur le thème "${theme}" en incluant le verset "${verse}".`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content?.trim() || '';
      setGeneratedText(aiText);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du texte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Créateur de Posts Chrétiens</h1>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="share">Partage</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6 space-y-4">
          <div>
            <Label>Catégorie chrétienne</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="encouragement">Encouragement</option>
              <option value="evangelisation">Évangélisation</option>
              <option value="priere">Prière</option>
              <option value="enseignement">Enseignement</option>
            </select>
          </div>

          <div>
            <Label>Thème ou idée</Label>
            <Input 
              placeholder="Ex: Espoir, Foi, Amour"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div>
            <Label>Verset biblique</Label>
            <Input 
              placeholder="Ex: Jean 3:16"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
            />
          </div>
          <div>
            <Label>Texte généré</Label>
            <Textarea 
              placeholder="Le texte inspirant généré apparaîtra ici"
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
            />
          </div>
          <Button onClick={generateTextWithAI} disabled={loading}>
            {loading ? 'Génération...' : 'Générer avec IA'}
          </Button>
        </TabsContent>

        <TabsContent value="design" className="mt-6 space-y-4">
          <div>
            <Label>Choisir un template</Label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="classic">Classique</option>
              <option value="modern">Moderne</option>
              <option value="vibrant">Vibrant</option>
            </select>
          </div>
          <Button onClick={async () => {
            setLoading(true);
            try {
              const prompt = `Image chrétienne inspirante sur le thème "${theme}" avec le verset "${verse}"`;
              const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                  prompt,
                  n: 1,
                  size: "512x512"
                })
              });
              const data = await response.json();
              const imageUrl = data.data?.[0]?.url;
              if (imageUrl) setGeneratedImage(imageUrl);
            } catch (error) {
              console.error(error);
              alert("Erreur lors de la génération de l'image");
            } finally {
              setLoading(false);
            }
          }} disabled={loading}>
            {loading ? 'Génération...' : 'Générer image avec IA'}
          </Button>
          {generatedImage && (
            <div className="mt-4">
              <img src={generatedImage} alt="Généré" className="max-w-full rounded" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-6 space-y-4">
          <h3 className="font-semibold">Prévisualisation du post</h3>
          {finalImage ? (
            <img src={finalImage} alt="Final" className="max-w-full rounded" />
          ) : (
            <p className="text-muted-foreground">Votre visuel final apparaîtra ici</p>
          )}
          <Button>Exporter l'image</Button>
        </TabsContent>

        <TabsContent value="share" className="mt-6 space-y-4">
          <Button className="w-full">Partager sur Facebook</Button>
          <Button className="w-full">Partager sur Instagram</Button>
          <Button className="w-full">Envoyer aux contacts</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialPostCreator;
