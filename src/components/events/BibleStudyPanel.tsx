import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BibleStudyPanelProps {
  roomName: string;
  isLeader: boolean;
}

const BibleStudyPanel = ({ roomName, isLeader }: BibleStudyPanelProps) => {
  const { toast } = useToast();
  const [currentPassage, setCurrentPassage] = useState('');
  const [passageContent, setPassageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to passage changes
  useEffect(() => {
    const channel = supabase
      .channel(`bible_study:${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bible_study_sessions',
          filter: `room_name=eq.${roomName}`
        },
        (payload) => {
          setCurrentPassage(payload.new.current_passage);
          fetchPassage(payload.new.current_passage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  const fetchPassage = async (passage: string) => {
    try {
      const { data, error } = await (supabase as any)
        .rpc('get_bible_passage', { passage_ref: passage });

      if (error) throw error;
      setPassageContent(data || 'Passage non trouvé');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le passage biblique',
        variant: 'destructive',
      });
    }
  };

  const handlePassageChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLeader || !currentPassage) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bible_study_sessions' as any)
        .upsert({
          room_name: roomName,
          current_passage: currentPassage,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le passage',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-4">Passage Biblique</h3>
      <div className="mb-4 p-3 bg-muted rounded">
        {passageContent || 'Aucun passage sélectionné'}
      </div>

      {isLeader && (
        <form onSubmit={handlePassageChange} className="space-y-3">
          <div>
            <Label htmlFor="passage">Nouveau passage</Label>
            <Input
              id="passage"
              value={currentPassage}
              onChange={(e) => setCurrentPassage(e.target.value)}
              placeholder="Jean 3:16"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Changer le passage'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BibleStudyPanel;
