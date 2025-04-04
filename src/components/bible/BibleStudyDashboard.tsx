import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

interface VerseOfTheDay {
  reference: string;
  text: string;
  translation: string;
}

export const BibleStudyDashboard = () => {
  const { data: verseOfTheDay, isLoading } = useQuery<VerseOfTheDay>({
    queryKey: ['verseOfTheDay'],
    queryFn: async () => {
      // TODO: Implement actual API call
      return {
        reference: "John 3:16",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        translation: "NIV"
      };
    }
  });

  const readingPlans = [
    { id: 1, name: "Through the Bible in a Year", progress: 45 },
    { id: 2, name: "New Testament in 90 Days", progress: 30 },
    { id: 3, name: "Psalms and Proverbs", progress: 60 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Verse of the Day */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <h3 className="text-2xl font-bold">Verse of the Day</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg italic">{verseOfTheDay?.text}</p>
              <p className="font-semibold">{verseOfTheDay?.reference} ({verseOfTheDay?.translation})</p>
              <Button variant="outline">Share</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reading Plans */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Reading Plans</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {readingPlans.map((plan) => (
              <div key={plan.id} className="space-y-2">
                <div className="flex justify-between">
                  <span>{plan.name}</span>
                  <span>{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <Button className="w-full">Start New Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
