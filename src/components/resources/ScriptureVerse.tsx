
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { RefreshCw, Book } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Verse {
  text: string;
  reference: string;
}

// Sample verses related to evangelism
const evangelismVerses: Verse[] = [
  { text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", reference: "Matthew 28:19" },
  { text: "And he said to them, 'Go into all the world and proclaim the gospel to the whole creation.'", reference: "Mark 16:15" },
  { text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.", reference: "Acts 1:8" },
  { text: "How beautiful are the feet of those who preach the good news!", reference: "Romans 10:15" },
  { text: "For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes.", reference: "Romans 1:16" },
  { text: "And this gospel of the kingdom will be proclaimed throughout the whole world as a testimony to all nations, and then the end will come.", reference: "Matthew 24:14" },
  { text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.", reference: "John 3:16" },
  { text: "The harvest is plentiful, but the laborers are few. Therefore pray earnestly to the Lord of the harvest to send out laborers into his harvest.", reference: "Luke 10:2" },
  { text: "How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard? And how are they to hear without someone preaching?", reference: "Romans 10:14" },
  { text: "For everyone who calls on the name of the Lord will be saved.", reference: "Romans 10:13" },
];

const ScriptureVerse: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);

  const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * evangelismVerses.length);
    setCurrentVerse(evangelismVerses[randomIndex]);
  };

  useEffect(() => {
    getRandomVerse();
  }, []);

  const handleRefresh = () => {
    getRandomVerse();
    toast({
      title: "New verse loaded",
      description: "Daily inspiration refreshed.",
    });
  };

  if (!currentVerse) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Book className="h-5 w-5 mr-2 text-primary" />
          Daily Scripture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="italic text-muted-foreground">"{currentVerse.text}"</p>
        <p className="text-sm font-medium mt-2 text-right">— {currentVerse.reference}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          New Verse
        </Button>
        <CopyButton 
          text={`"${currentVerse.text}" — ${currentVerse.reference}`} 
          label="Share"
        />
      </CardFooter>
    </Card>
  );
};

export default ScriptureVerse;
