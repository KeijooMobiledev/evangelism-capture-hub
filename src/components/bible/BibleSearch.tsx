
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Search, BookOpen, Book, ArrowRight, Check } from 'lucide-react';

type SearchResult = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

// Sample search results (in a real app, this would come from an API)
const sampleResults: SearchResult[] = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { book: 'Romans', chapter: 5, verse: 8, text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
  { book: '1 John', chapter: 4, verse: 8, text: 'He that loveth not knoweth not God; for God is love.' },
  { book: '1 John', chapter: 4, verse: 16, text: 'And we have known and believed the love that God hath to us. God is love; and he that dwelleth in love dwelleth in God, and God in him.' },
  { book: 'Ephesians', chapter: 2, verse: 4, text: 'But God, who is rich in mercy, for his great love wherewith he loved us,' },
  { book: 'Jeremiah', chapter: 31, verse: 3, text: 'The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee.' },
  { book: 'Galatians', chapter: 2, verse: 20, text: 'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.' },
];

const BibleSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('keyword');
  
  // Search filters
  const [oldTestament, setOldTestament] = useState(true);
  const [newTestament, setNewTestament] = useState(true);
  const [exactMatch, setExactMatch] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setResults(sampleResults);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
          <TabsTrigger value="reference">Reference Lookup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keyword" className="space-y-4 pt-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search the Bible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-opacity-50 border-r-transparent mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="ot" checked={oldTestament} onCheckedChange={(checked) => setOldTestament(!!checked)} />
              <Label htmlFor="ot">Old Testament</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="nt" checked={newTestament} onCheckedChange={(checked) => setNewTestament(!!checked)} />
              <Label htmlFor="nt">New Testament</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exact" checked={exactMatch} onCheckedChange={(checked) => setExactMatch(!!checked)} />
              <Label htmlFor="exact">Exact Match</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reference" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="book">Book</Label>
              <Input id="book" placeholder="e.g., John" />
            </div>
            <div className="w-24">
              <Label htmlFor="chapter">Chapter</Label>
              <Input id="chapter" type="number" min={1} placeholder="3" />
            </div>
            <div className="w-24">
              <Label htmlFor="verse">Verse</Label>
              <Input id="verse" type="number" min={1} placeholder="16" />
            </div>
            <Button className="self-end" onClick={handleSearch}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {results.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">
              Found {results.length} results for "{searchQuery}"
            </h3>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-primary mr-2" />
                      <span className="font-medium">
                        {result.book} {result.chapter}:{result.verse}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed pl-6">{result.text}</p>
                    <div className="flex items-center gap-2 pl-6 mt-2">
                      <Button variant="ghost" size="sm">
                        <Book className="h-4 w-4 mr-1" />
                        Read in Context
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Check className="h-4 w-4 mr-1" />
                        Add to Study
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleSearch;
