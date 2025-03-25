
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Users, MessageCircle, ShieldCheck } from "lucide-react";

interface Tip {
  title: string;
  content: string;
  category: 'approach' | 'conversation' | 'objection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const evangelizationTips: Tip[] = [
  {
    title: "Start with friendship",
    content: "Build genuine relationships before discussing faith. People are more open to hear from those they trust.",
    category: 'approach',
    difficulty: 'beginner'
  },
  {
    title: "Listen actively",
    content: "Spend more time listening than speaking. Understanding someone's current beliefs and concerns is crucial.",
    category: 'conversation',
    difficulty: 'beginner'
  },
  {
    title: "Handle 'I'm not religious'",
    content: "When someone says they're not religious, respond with 'I'm interested in your perspective. What shaped your view on faith?'",
    category: 'objection',
    difficulty: 'beginner'
  },
  {
    title: "Share your testimony",
    content: "Your personal story of faith is powerful. Focus on how your relationship with God has transformed you.",
    category: 'approach',
    difficulty: 'intermediate'
  },
  {
    title: "Ask thoughtful questions",
    content: "Questions like 'What gives your life meaning?' can open doors to deeper conversations about faith.",
    category: 'conversation',
    difficulty: 'intermediate'
  },
  {
    title: "Address suffering objection",
    content: "When someone asks why God allows suffering, acknowledge the mystery while explaining how faith provides strength in difficult times.",
    category: 'objection',
    difficulty: 'intermediate'
  },
  {
    title: "Identify cultural bridges",
    content: "Find connections between their cultural background and Christian faith that can serve as entry points for discussion.",
    category: 'approach',
    difficulty: 'advanced'
  },
  {
    title: "Use the Socratic method",
    content: "Guide someone to discover truth through a series of questions rather than making statements.",
    category: 'conversation',
    difficulty: 'advanced'
  },
  {
    title: "Handle scientific objections",
    content: "When science is raised as an objection, explore how many scientists reconcile faith and science, and discuss the limitations of both.",
    category: 'objection',
    difficulty: 'advanced'
  },
];

const DifficultyBadge: React.FC<{ difficulty: Tip['difficulty'] }> = ({ difficulty }) => {
  const variants = {
    beginner: "success",
    intermediate: "info",
    advanced: "warning",
  } as const;
  
  return (
    <Badge variant={variants[difficulty]}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};

const EvangelizationTips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tip['category']>('approach');
  
  const filteredTips = evangelizationTips.filter(tip => tip.category === activeTab);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Lightbulb className="h-5 w-5 text-primary mr-2" />
          <CardTitle>Evangelization Tips</CardTitle>
        </div>
        <CardDescription>
          Practical advice to improve your evangelization efforts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tip['category'])}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approach" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Approach</span>
              <span className="sm:hidden">Approach</span>
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Conversation</span>
              <span className="sm:hidden">Convo</span>
            </TabsTrigger>
            <TabsTrigger value="objection" className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Objections</span>
              <span className="sm:hidden">Object</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="approach" className="mt-4 space-y-4">
            {filteredTips.map((tip, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{tip.title}</h3>
                  <DifficultyBadge difficulty={tip.difficulty} />
                </div>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="conversation" className="mt-4 space-y-4">
            {filteredTips.map((tip, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{tip.title}</h3>
                  <DifficultyBadge difficulty={tip.difficulty} />
                </div>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="objection" className="mt-4 space-y-4">
            {filteredTips.map((tip, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{tip.title}</h3>
                  <DifficultyBadge difficulty={tip.difficulty} />
                </div>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EvangelizationTips;
