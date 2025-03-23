
import React from 'react';
import { 
  FileAudio, 
  FileVideo, 
  FileText, 
  Library, 
  Search, 
  BookmarkCheck 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ResourceCategory, ResourceFilter } from '@/hooks/use-resources';

interface ResourceFiltersProps {
  categories: ResourceCategory[];
  filters: ResourceFilter;
  onChange: (filters: ResourceFilter) => void;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({ 
  categories, 
  filters, 
  onChange 
}) => {
  const handleFilterChange = (partialFilter: Partial<ResourceFilter>) => {
    onChange({ ...filters, ...partialFilter });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ searchQuery: e.target.value });
  };
  
  const handleTypeChange = (value: string) => {
    handleFilterChange({ 
      type: value === 'all' ? 'all' : value as 'audio' | 'video' | 'text' 
    });
  };
  
  const handleCategoryChange = (value: string | undefined) => {
    handleFilterChange({ categoryId: value === 'all' ? null : value });
  };
  
  const toggleBookmarked = () => {
    handleFilterChange({ bookmarked: !filters.bookmarked });
  };
  
  const resetFilters = () => {
    onChange({
      type: 'all',
      categoryId: null,
      searchQuery: '',
      bookmarked: false
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-9"
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Tabs 
          value={filters.type || 'all'} 
          onValueChange={handleTypeChange}
          className="w-full sm:max-w-md"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="flex items-center justify-center gap-1">
              <Library className="h-4 w-4" />
              <span className="hidden md:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center justify-center gap-1">
              <FileAudio className="h-4 w-4" />
              <span className="hidden md:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center justify-center gap-1">
              <FileVideo className="h-4 w-4" />
              <span className="hidden md:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center justify-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Text</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 sm:ml-auto">
          <Select 
            value={filters.categoryId || 'all'} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant={filters.bookmarked ? "default" : "outline"} 
            size="icon"
            onClick={toggleBookmarked}
            title="Show bookmarked resources"
          >
            <BookmarkCheck className="h-4 w-4" />
          </Button>
          
          {(filters.type !== 'all' || filters.categoryId || filters.searchQuery || filters.bookmarked) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="whitespace-nowrap"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;
