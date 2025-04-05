import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EvangelismDesignTool = () => {
  const { toast } = useToast();
  const [verse, setVerse] = useState('Jean 3:16');
  const [design, setDesign] = useState('classic');
  const [generatedImage, setGeneratedImage] = useState('');
  const canvasRef = useRef(null);

  const designs = {
    classic: {
      background: '#1E3A8A',
      textColor: '#FFFFFF',
      font: 'Arial'
    },
    modern: {
      background: '#4C1D95',
      textColor: '#F3E8FF',
      font: 'Helvetica'
    },
    vibrant: {
      background: '#065F46',
      textColor: '#D1FAE5',
      font: 'Verdana'
    }
  };

  const generateDesign = async () => {
    try {
      // Simulation de génération d'image avec IA
      const { data } = await supabase
        .from('bible_verses')
        .select('text')
        .eq('reference', verse)
        .single();

      const verseText = data?.text || 'Car Dieu a tant aimé le monde...';
      
      // En production, on utiliserait un vrai service d'IA
      const mockImage = `https://placehold.co/800x400/${designs[design].background.substring(1)}/${designs[design].textColor.substring(1)}?text=${encodeURIComponent(verseText)}&font=${designs[design].font}`;
      
      setGeneratedImage(mockImage);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de la génération du design",
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-4">
      
      <Tabs defaultValue="design" className="w-full">
        <TabsList>
          <TabsTrigger value="design">Création</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="share">Partage</TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Verset biblique</Label>
                <Input 
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="Entrez une référence biblique"
                />
              </div>

              <div>
                <Label>Style de design</Label>
                <select
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="classic">Classique</option>
                  <option value="modern">Moderne</option>
                  <option value="vibrant">Vibrant</option>
                </select>
              </div>

              <Button onClick={generateDesign} className="mt-4">
                Générer le design
              </Button>
            </div>

            <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow min-h-[400px] flex items-center justify-center">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Design généré" 
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <p className="text-muted-foreground">
                  Votre design apparaîtra ici
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Object.entries(designs).map(([key, style]) => (
              <div 
                key={key}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setDesign(key)}
              >
                <div 
                  className="h-40 rounded-md flex items-center justify-center mb-2"
                  style={{ 
                    backgroundColor: style.background,
                    color: style.textColor,
                    fontFamily: style.font
                  }}
                >
                  {verse}
                </div>
                <p className="capitalize text-center">{key}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="share">
          <div className="mt-6 space-y-4">
            <Button variant="outline" className="w-full">
              Télécharger l'image
            </Button>
            <Button variant="outline" className="w-full">
              Partager sur Facebook
            </Button>
            <Button variant="outline" className="w-full">
              Envoyer aux contacts
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvangelismDesignTool;
