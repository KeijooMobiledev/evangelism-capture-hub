
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BookText, User, History, Book } from 'lucide-react';

const commentarySources = [
  { id: 'matthew-henry', name: 'Matthew Henry Commentary' },
  { id: 'spurgeon', name: 'Spurgeon\'s Commentaries' },
  { id: 'wesley', name: 'Wesley\'s Explanatory Notes' },
  { id: 'gill', name: 'Gill\'s Exposition' },
  { id: 'jfb', name: 'Jamieson-Fausset-Brown' },
];

const booksByTestament = {
  ot: [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', 
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 
    'Haggai', 'Zechariah', 'Malachi'
  ],
  nt: [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 
    'Ephesians', 'Philippians', 'Colossians', 
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 
    'Titus', 'Philemon', 'Hebrews', 'James', 
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 
    'Jude', 'Revelation'
  ]
};

// Sample commentary content (in a real app, this would come from an API)
const sampleCommentary = `
<h3>Commentary on John 3:16</h3>

<p>This verse has been called "the Bible in miniature" because it is a comprehensive statement of the Gospel of Jesus Christ.</p>

<p>"For God so loved the world" - The word "so" in the Greek is "houtos" which means "in this manner" or "in this way." It's not just that God loved the world so much, but that God loved the world in this particular way - by giving His Son.</p>

<p>"that he gave his only begotten Son" - The word "gave" indicates the sacrificial nature of God's gift. God gave His Son to the death of the cross for our redemption. The word "only begotten" translates the Greek word "monogenes" which means "unique" or "one-of-a-kind." Jesus is the unique Son of God.</p>

<p>"that whosoever believeth in him should not perish, but have everlasting life" - The word "whosoever" indicates the universal scope of God's offer of salvation. Anyone who believes can be saved. The word "believeth" is in the present tense in Greek, suggesting a continuous action: "whoever keeps on believing." The word "perish" refers to eternal separation from God, while "everlasting life" refers to both quality and length of life - a life lived in relationship with God now and forever.</p>

<p>This verse emphasizes several important theological truths:</p>
<ul>
  <li>God's love: God's love for the world is the motivation for salvation</li>
  <li>God's gift: God gave His only Son as the means of salvation</li>
  <li>Human responsibility: People must believe in Jesus to receive salvation</li>
  <li>Eternal consequences: The outcome is either perishing or eternal life</li>
</ul>

<p>The enormity of God's love is demonstrated by the fact that He gave His most precious possession, His only Son, for a world that was in rebellion against Him (Romans 5:8).</p>
`;

const BibleCommentary = () => {
  const [commentarySource, setCommentarySource] = useState('matthew-henry');
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  const [commentaryContent, setCommentaryContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentaryType, setCommentaryType] = useState('verse');

  // Simulate fetching commentary content
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setCommentaryContent(sampleCommentary);
      setIsLoading(false);
    }, 800);
  }, [book, chapter, commentarySource, commentaryType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Commentary Source</label>
          <Select value={commentarySource} onValueChange={setCommentarySource}>
            <SelectTrigger>
              <SelectValue placeholder="Select commentary" />
            </SelectTrigger>
            <SelectContent>
              {commentarySources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Book</label>
          <Select value={book} onValueChange={setBook}>
            <SelectTrigger>
              <SelectValue placeholder="Select Book" />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2">
                <div className="font-medium text-sm px-2 py-1 bg-muted">Old Testament</div>
                {booksByTestament.ot.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
                <Separator />
                <div className="font-medium text-sm px-2 py-1 bg-muted">New Testament</div>
                {booksByTestament.nt.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-24">
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <Select value={chapter.toString()} onValueChange={(val) => setChapter(parseInt(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Ch" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={commentaryType} onValueChange={setCommentaryType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verse" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Verse-by-Verse</span>
          </TabsTrigger>
          <TabsTrigger value="chapter" className="flex items-center gap-1.5">
            <BookText className="h-4 w-4" />
            <span>Chapter Summary</span>
          </TabsTrigger>
          <TabsTrigger value="background" className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            <span>Background</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Reading <span className="font-medium">{commentarySources.find(s => s.id === commentarySource)?.name}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Book className="h-4 w-4 mr-2" />
            Open in Bible
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Author Info
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px] rounded-md border p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4 commentary-content" dangerouslySetInnerHTML={{ __html: commentaryContent }} />
        )}
      </ScrollArea>
    </div>
  );
};

export default BibleCommentary;
