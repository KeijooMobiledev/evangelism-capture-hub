import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NotebookPen, CalendarCheck, Users } from 'lucide-react';

type SpiritualStage = 'contact' | 'interested' | 'converted' | 'disciple';

interface SpiritualJourneyProps {
  currentStage: SpiritualStage;
  notes: Array<{ date: string; content: string }>;
  lastContactDate: string;
}

const stageProgress = {
  contact: 25,
  interested: 50,
  converted: 75,
  disciple: 100
};

const stageLabels = {
  contact: 'Premier contact',
  interested: 'Intéressé',
  converted: 'Converti',
  disciple: 'Disciple'
};

export default function SpiritualJourney({ 
  currentStage,
  notes,
  lastContactDate
}: SpiritualJourneyProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NotebookPen className="w-5 h-5" />
          Parcours spirituel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Étape actuelle</span>
            <span className="text-sm text-muted-foreground">
              {stageLabels[currentStage]}
            </span>
          </div>
          <Progress value={stageProgress[currentStage]} />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CalendarCheck className="w-4 h-4" />
          Dernier contact: {new Date(lastContactDate).toLocaleDateString()}
        </div>

        <div className="pt-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Notes de suivi
          </h3>
          {notes.map((note, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">
                {new Date(note.date).toLocaleDateString()}
              </div>
              <p>{note.content}</p>
            </div>
          ))}
          <Button variant="outline" className="mt-2">
            Ajouter une note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
