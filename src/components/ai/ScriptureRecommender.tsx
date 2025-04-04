import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAiEvangelism } from '@/hooks/use-ai-evangelism';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bookmark, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

const ScriptureRecommender = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { getRecommendations } = useAiEvangelism();

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await getRecommendations();
      setRecommendations(recs);
    } catch (error) {
      toast({
        title: 'Failed to load recommendations',
        description: 'Could not fetch your scripture suggestions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const { submitFeedback } = useAiEvangelism();

  const handleFeedback = async (verseId: string, positive: boolean) => {
    try {
      await submitFeedback({ verseId, positive });
      toast({
        title: 'Feedback submitted',
        description: `Marked verse as ${positive ? 'helpful' : 'not helpful'}`,
      });
    } catch (error) {
      toast({
        title: 'Feedback failed',
        description: 'Could not submit your feedback',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Scripture Recommendations
        </CardTitle>
        <CardDescription>
          Personalized Bible verses based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium">{rec.reference}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{rec.text}</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFeedback(rec.id, true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFeedback(rec.id, false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No recommendations yet. Your suggestions will appear here as you use the app.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptureRecommender;
