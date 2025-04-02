
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Share, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bibleVersions = [
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'niv', name: 'New International Version (NIV)' },
  { id: 'esv', name: 'English Standard Version (ESV)' },
  { id: 'nlt', name: 'New Living Translation (NLT)' },
  { id: 'msg', name: 'The Message (MSG)' },
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

// Sample verse content (in a real app, this would come from an API)
const sampleVerses = {
  'Genesis-1': [
    { verse: 1, text: 'In the beginning God created the heaven and the earth.' },
    { verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
    { verse: 3, text: 'And God said, Let there be light: and there was light.' },
    { verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
    { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
    // More verses would be here
  ],
  'John-3': [
    { verse: 1, text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
    { verse: 2, text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
    { verse: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.' },
    { verse: 4, text: 'Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother\'s womb, and be born?' },
    { verse: 5, text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.' },
    { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    // More verses would be here
  ],
};

const BibleReader = () => {
  const { toast } = useToast();
  const [version, setVersion] = useState('kjv');
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Simulate fetching Bible text
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      const key = `${book}-${chapter}`;
      setVerses(sampleVerses[key as keyof typeof sampleVerses] || []);
      setIsLoading(false);
    }, 500);
  }, [book, chapter, version]);

  const maxChapters = 50; // This would be dynamic based on the book in a real app

  const handlePreviousChapter = () => {
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else {
      // Go to previous book, last chapter
      const allBooks = [...booksByTestament.ot, ...booksByTestament.nt];
      const currentIndex = allBooks.indexOf(book);
      
      if (currentIndex > 0) {
        setBook(allBooks[currentIndex - 1]);
        setChapter(maxChapters); // Set to last chapter (simplified)
      }
    }
  };

  const handleNextChapter = () => {
    if (chapter < maxChapters) {
      setChapter(chapter + 1);
    } else {
      // Go to next book, first chapter
      const allBooks = [...booksByTestament.ot, ...booksByTestament.nt];
      const currentIndex = allBooks.indexOf(book);
      
      if (currentIndex < allBooks.length - 1) {
        setBook(allBooks[currentIndex + 1]);
        setChapter(1);
      }
    }
  };

  const copyVerses = () => {
    const text = verses.map(v => `${book} ${chapter}:${v.verse} - ${v.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    toast({
      title: "Text copied",
      description: `${book} ${chapter} has been copied to clipboard`,
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Version</label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger>
              <SelectValue placeholder="Select Bible version" />
            </SelectTrigger>
            <SelectContent>
              {bibleVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
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
          <Input
            type="number"
            min={1}
            max={maxChapters}
            value={chapter}
            onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between py-2">
        <Button variant="outline" size="sm" onClick={handlePreviousChapter}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={copyVerses}>
            {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            Copy
          </Button>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleNextChapter}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <ScrollArea className="h-[500px] rounded-md border p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {book} {chapter}
            </h2>
            {verses.length > 0 ? (
              verses.map((v) => (
                <div key={v.verse} className="space-y-1">
                  <div className="flex items-start">
                    <span className="text-sm font-bold text-primary mr-2">{v.verse}</span>
                    <p className="text-base leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No verses found for this selection.</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BibleReader;
