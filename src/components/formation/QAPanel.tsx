import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, ThumbsUp, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  author_name: string;
  likes: number;
  is_answered: boolean;
  created_at: string;
  user_id: string;
}

const QAPanel = ({ eventId }: { eventId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('event_questions')
          .select('*')
          .eq('event_id', eventId)
          .order('likes', { ascending: false })
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setQuestions(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les questions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();

    const channel = supabase
      .channel(`event_questions:${eventId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'event_questions',
        filter: `event_id=eq.${eventId}`
      }, (payload) => {
        fetchQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, toast]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('event_questions')
        .insert({
          event_id: eventId,
          text: newQuestion,
          author_name: user.email?.split('@')[0] || 'Anonymous',
          user_id: user.id,
          likes: 0,
          is_answered: false
        });

      if (error) throw error;
      setNewQuestion('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de l'envoi de la question",
        variant: 'destructive',
      });
    }
  };

  const handleLikeQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .rpc('increment_likes', { question_id: questionId });

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec du vote",
        variant: 'destructive',
      });
    }
  };

  const toggleAnsweredStatus = async (questionId: string) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const { error } = await supabase
        .from('event_questions')
        .update({ is_answered: !question.is_answered })
        .eq('id', questionId);

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de la mise à jour",
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div className="flex justify-center py-4">Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Questions & Réponses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmitQuestion} className="flex gap-2">
          <Input
            placeholder="Poser une question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Button type="submit">
            Envoyer
          </Button>
        </form>

        <div className="space-y-3">
          {questions.map((question) => (
            <div 
              key={question.id} 
              className={`p-3 border rounded-lg ${question.is_answered ? 'bg-muted/40' : 'bg-background'}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium">{question.author_name}</span>
                <div className="flex gap-1 items-center">
                  <span className="text-sm">{new Date(question.created_at).toLocaleTimeString()}</span>
                  {user?.id === question.user_id || user?.id === '[ADMIN_ID]' ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleAnsweredStatus(question.id)}
                    >
                      <Check className={`h-4 w-4 ${question.is_answered ? 'text-green-500' : ''}`} />
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mb-2">{question.text}</p>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLikeQuestion(question.id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {question.likes} vote{question.likes !== 1 ? 's' : ''}
                </Button>
                {question.is_answered && (
                  <span className="text-xs text-green-500">
                    Répondu
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QAPanel;
