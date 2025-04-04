
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BookText, User, History, Book } from 'lucide-react';
import { BibleApi } from '@/services/bibleApi';

interface BibleBook {
  book: string;
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

type CommentarySource = {
  id: string;
  name: string;
  description?: string;
  author?: string;
};

type CommentaryType = 'verse' | 'chapter' | 'background';

const BibleCommentary = () => {
  const [commentarySources, setCommentarySources] = useState<CommentarySource[]>([]);
  const [commentaryBooks, setCommentaryBooks] = useState<BibleBook[]>([]);
  const [commentarySource, setCommentarySource] = useState('');
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState(1);
  const [commentaryContent, setCommentaryContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentaryType, setCommentaryType] = useState<CommentaryType>('verse');

  // Load available commentaries
  useEffect(() => {
    BibleApi.getCommentaries().then((data: CommentarySource[]) => {
      setCommentarySources(data);
      if (data.length > 0) {
        setCommentarySource(data[0].id);
      }
    });
  }, []);

  // Load books when commentary source changes
  useEffect(() => {
    if (commentarySource) {
      BibleApi.getCommentaryBooks(commentarySource).then(data => {
        setCommentaryBooks(data);
        if (data.length > 0) {
          setBook(data[0]);
          setChapter(1);
        }
      });
    }
  }, [commentarySource]);

  // Load commentary content when book/chapter/type changes
  useEffect(() => {
    if (book && commentarySource) {
      setIsLoading(true);
      BibleApi.getCommentary(commentarySource, book.book, chapter)
        .then(content => {
          // Structure content based on type (simplified)
          setCommentaryContent(`
            <h3>${commentarySources.find(c => c.id === commentarySource)?.name}</h3>
            <h4>${book.name} ${chapter}: ${commentaryType === 'verse' ? 'Verse-by-Verse' 
              : commentaryType === 'chapter' ? 'Chapter Summary' : 'Background'}</h4>
            <div class="prose">${content}</div>
          `);
        })
        .finally(() => setIsLoading(false));
    }
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
          <Select 
            value={book?.book || ''}
            onValueChange={(value) => {
              const selectedBook = commentaryBooks.find(b => b.book === value);
              if (selectedBook) setBook(selectedBook);
            }}
            disabled={isLoading || !commentarySource}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Book" />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2">
                <div className="font-medium text-sm px-2 py-1 bg-muted">Old Testament</div>
                {commentaryBooks.filter(b => b.testament === 'OT').map((b) => (
                  <SelectItem key={b.book} value={b.book}>
                    {b.name}
                  </SelectItem>
                ))}
                <Separator />
                <div className="font-medium text-sm px-2 py-1 bg-muted">New Testament</div>
                {commentaryBooks.filter(b => b.testament === 'NT').map((b) => (
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
      
      <Tabs 
        value={commentaryType} 
        onValueChange={(value: string) => 
          setCommentaryType(value as CommentaryType)
        }
      >
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
