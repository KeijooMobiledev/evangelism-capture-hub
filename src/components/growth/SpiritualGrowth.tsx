import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SpiritualGift {
  name: string;
  score: number;
  description: string;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  yearsOfExperience: number;
  availability: string;
}

export const SpiritualGrowth = () => {
  const [spiritualGifts, setSpiritualGifts] = useState<SpiritualGift[]>([
    { 
      name: "Teaching",
      score: 85,
      description: "Ability to explain and apply God's truth"
    },
    {
      name: "Leadership",
      score: 70,
      description: "Ability to cast vision and guide others"
    },
    {
      name: "Mercy",
      score: 90,
      description: "Compassion and care for those in need"
    }
  ]);

  const [availableMentors] = useState<Mentor[]>([
    {
      id: "1",
      name: "Pastor James",
      expertise: ["Bible Teaching", "Leadership", "Discipleship"],
      yearsOfExperience: 15,
      availability: "Weekly"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      expertise: ["Prayer", "Worship", "Youth Ministry"],
      yearsOfExperience: 8,
      availability: "Bi-weekly"
    }
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Spiritual Gifts Assessment */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Your Spiritual Gifts</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {spiritualGifts.map((gift) => (
              <div key={gift.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{gift.name}</span>
                  <span>{gift.score}%</span>
                </div>
                <Progress value={gift.score} />
                <p className="text-sm text-gray-600">{gift.description}</p>
              </div>
            ))}
            <Button className="w-full">Take New Assessment</Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentorship Matching */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Find a Mentor</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableMentors.map((mentor) => (
              <div key={mentor.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">
                      {mentor.yearsOfExperience} years of experience
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">Expertise:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Available: {mentor.availability}
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Mentors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
