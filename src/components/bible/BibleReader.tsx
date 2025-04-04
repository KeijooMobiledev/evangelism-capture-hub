
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Share, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BibleApi } from '@/services/bibleApi';

interface BibleBook {
  book: string;
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

const BibleReader = () => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<{id: string; name: string}[]>([]);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [version, setVersion] = useState('kjv');
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Load available translations
  useEffect(() => {
    BibleApi.getTranslations().then(data => {
      setVersions(data.map(v => ({id: v.id, name: v.name})));
    });
  }, []);

  // Load books when version changes
  useEffect(() => {
    if (version) {
      BibleApi.getBooks(version).then(data => {
        setBooks(data);
        if (data.length > 0) {
          setBook(data[0]);
          setChapter(1);
        }
      });
    }
  }, [version]);

  // Load chapter content when book/chapter changes
  useEffect(() => {
    if (book) {
      setIsLoading(true);
      BibleApi.getChapter(version, book.book, chapter)
        .then(setVerses)
        .catch(() => setVerses([]))
        .finally(() => setIsLoading(false));
    }
  }, [book, chapter, version]);

  const handlePreviousChapter = () => {
    if (!book) return;
    
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else {
      // Go to previous book, last chapter
      const currentIndex = books.findIndex(b => b.book === book.book);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setBook(prevBook);
        setChapter(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (!book) return;
    
    if (chapter < book.chapters) {
      setChapter(chapter + 1);
    } else {
      // Go to next book, first chapter
      const currentIndex = books.findIndex(b => b.book === book.book);
      if (currentIndex < books.length - 1) {
        setBook(books[currentIndex + 1]);
        setChapter(1);
      }
    }
  };

  const copyVerses = () => {
    if (!book) return;
    const text = verses.map(v => `${book.name} ${chapter}:${v.verse} - ${v.text}`).join('\n\n');
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
          <Select value={version} onValueChange={setVersion} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select Bible version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Book</label>
          <Select 
            value={book?.book || ''} 
            onValueChange={(value) => {
              const selectedBook = books.find(b => b.book === value);
              if (selectedBook) {
                setBook(selectedBook);
                setChapter(1);
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={books.length ? "Select Book" : "Loading..."} />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2">
                <div className="font-medium text-sm px-2 py-1 bg-muted">Old Testament</div>
                {books.filter(b => b.testament === 'OT').map((b) => (
                  <SelectItem key={b.book} value={b.book}>
                    {b.name}
                  </SelectItem>
                ))}
                <Separator />
                <div className="font-medium text-sm px-2 py-1 bg-muted">New Testament</div>
                {books.filter(b => b.testament === 'NT').map((b) => (
                  <SelectItem key={b.book} value={b.book}>
                    {b.name}
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
            max={book?.chapters || 1}
            value={chapter}
            onChange={(e) => setChapter(Math.min(
              Math.max(1, parseInt(e.target.value) || 1),
              book?.chapters || 1
            ))}
            disabled={isLoading || !book}
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
              {book?.name || 'Loading...'} {chapter}
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
