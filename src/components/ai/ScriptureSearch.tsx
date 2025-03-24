
import React, { useState } from 'react';
import { useAiEvangelism } from '@/hooks/use-ai-evangelism';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Search, Copy, Check, Loader2 } from 'lucide-react';

const ScriptureSearch: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [context, setContext] = useState('');
  const [copied, setCopied] = useState(false);
  
  const {
    scriptureSearchData,
    scriptureSearchLoading,
    scriptureSearchError,
    searchScripture
  } = useAiEvangelism();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to use this feature',
        variant: 'destructive'
      });
      return;
    }
    
    if (!query.trim()) {
      toast({
        title: 'Please enter a search query',
        description: 'You need to specify what Bible topic you want to find',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await searchScripture({ query, context });
    } catch (error) {
      console.error('Scripture search error:', error);
      toast({
        title: 'Search failed',
        description: 'Unable to perform scripture search. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = () => {
    if (!scriptureSearchData) return;
    
    navigator.clipboard.writeText(scriptureSearchData.results);
    setCopied(true);
    
    toast({
      title: 'Copied to clipboard',
      description: 'Scripture results copied successfully',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          AI Scripture Search
        </CardTitle>
        <CardDescription>
          Find Bible verses related to specific topics or contexts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="query" className="text-sm font-medium">
              Search Query
            </label>
            <Input
              id="query"
              placeholder="e.g., forgiveness, love, salvation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="context" className="text-sm font-medium">
              Context (Optional)
            </label>
            <Textarea
              id="context"
              placeholder="e.g., for evangelism, for a sermon about faith..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={scriptureSearchLoading} className="w-full">
            {scriptureSearchLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Scripture
              </>
            )}
          </Button>
        </form>
        
        {scriptureSearchError && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            Error: {scriptureSearchError instanceof Error ? scriptureSearchError.message : 'Failed to search scripture'}
          </div>
        )}
        
        {scriptureSearchData && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Search Results</h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            
            <Separator />
            
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="whitespace-pre-line">
                {scriptureSearchData.results}
              </div>
            </ScrollArea>
            
            {scriptureSearchData.verses.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Referenced Verses:</h4>
                <div className="flex flex-wrap gap-2">
                  {scriptureSearchData.verses.map((verse, index) => (
                    <div key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {verse}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptureSearch;
