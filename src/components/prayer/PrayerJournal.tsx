import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface PrayerEntry {
  id: string;
  date: Date;
  content: string;
  answered: boolean;
}

export const PrayerJournal = () => {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const addEntry = () => {
    if (!newEntry.trim() || !date) return;
    
    setEntries([...entries, {
      id: Date.now().toString(),
      date,
      content: newEntry,
      answered: false
    }]);
    setNewEntry('');
  };

  const toggleAnswered = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? {...entry, answered: !entry.answered} : entry
    ));
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">Prayer Journal</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your prayer here..."
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              />
              <Button className="w-full" onClick={addEntry}>
                Add Journal Entry
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(entry.date, 'MMMM d, yyyy')}
                    </p>
                    <p className="mt-2">{entry.content}</p>
                  </div>
                  <Button
                    variant={entry.answered ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAnswered(entry.id)}
                  >
                    {entry.answered ? 'Answered' : 'Mark Answered'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
