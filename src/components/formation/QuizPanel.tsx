import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, List, BarChart, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

const QuizPanel = ({ eventId }: { eventId: string }) => {
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('event_quizzes')
          .select('*')
          .eq('event_id', eventId)
          .single();

        if (error) throw error;
        if (data) setQuiz(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le quiz',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [eventId, toast]);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // TODO: Envoyer la réponse à Supabase pour le suivi en temps réel
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const showQuizResults = () => {
    setShowResults(true);
  };

  if (isLoading) return <Loader className="animate-spin" />;
  if (!quiz) return <div>Aucun quiz disponible</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          {quiz.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showResults ? (
          <div className="space-y-4">
            <h3 className="font-medium">
              Question {currentQuestionIndex + 1}/{quiz.questions.length}
            </h3>
            <p>{quiz.questions[currentQuestionIndex].text}</p>
                        
            <div className="space-y-2">
              {quiz.questions[currentQuestionIndex].options.map((option, i) => (
                <Button
                  key={i}
                  variant={selectedOption === i ? 'default' : 'outline'}
                  onClick={() => handleAnswer(i)}
                  className="w-full justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button onClick={nextQuestion} disabled={selectedOption === null}>
                  Suivant
                </Button>
              ) : (
                <Button onClick={showQuizResults} disabled={selectedOption === null}>
                  Voir résultats
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium">
              <BarChart className="h-5 w-5" />
              Résultats du quiz
            </h3>
            {/* TODO: Afficher les résultats */}
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Revoir les questions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizPanel;
