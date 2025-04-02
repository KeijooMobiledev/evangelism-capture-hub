
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, CalendarCheck, BookOpen, Clock, Edit, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const BibleStudyType = [
  'Book Study',
  'Topical Study',
  'Character Study',
  'Devotional',
  'Bible Reading Plan',
  'Scripture Memorization',
];

// Sample Bible studies (in a real app, this would come from a database)
const sampleStudies = [
  {
    id: '1',
    title: 'Gospel of John Study',
    description: 'Deep dive into the Gospel of John to understand the divinity of Christ',
    type: 'Book Study',
    startDate: new Date('2023-10-10'),
    endDate: new Date('2023-12-15'),
    progress: 65,
    readings: [
      { date: new Date('2023-10-15'), reference: 'John 1:1-18', completed: true },
      { date: new Date('2023-10-22'), reference: 'John 1:19-51', completed: true },
      { date: new Date('2023-10-29'), reference: 'John 2:1-25', completed: true },
      { date: new Date('2023-11-05'), reference: 'John 3:1-36', completed: true },
      { date: new Date('2023-11-12'), reference: 'John 4:1-54', completed: false },
      { date: new Date('2023-11-19'), reference: 'John 5:1-47', completed: false },
      { date: new Date('2023-11-26'), reference: 'John 6:1-71', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Fruits of the Spirit',
    description: 'Examining the nine fruits of the Spirit from Galatians 5:22-23',
    type: 'Topical Study',
    startDate: new Date('2023-09-05'),
    endDate: new Date('2023-11-25'),
    progress: 80,
    readings: [
      { date: new Date('2023-09-10'), reference: 'Galatians 5:22-23', completed: true },
      { date: new Date('2023-09-17'), reference: 'Love - 1 Corinthians 13', completed: true },
      { date: new Date('2023-09-24'), reference: 'Joy - Romans 15:13', completed: true },
      { date: new Date('2023-10-01'), reference: 'Peace - Philippians 4:6-7', completed: true },
      { date: new Date('2023-10-08'), reference: 'Patience - James 5:7-11', completed: false },
      { date: new Date('2023-10-15'), reference: 'Kindness - Ephesians 4:32', completed: false },
    ]
  },
];

interface BibleStudyReading {
  date: Date;
  reference: string;
  completed: boolean;
}

interface BibleStudy {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  readings: BibleStudyReading[];
}

const BibleStudyPlanner = () => {
  const [studies, setStudies] = useState<BibleStudy[]>(sampleStudies);
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(sampleStudies[0]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for new study
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newStudyDescription, setNewStudyDescription] = useState('');
  const [newStudyType, setNewStudyType] = useState(BibleStudyType[0]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Form state for new reading
  const [newReadingDate, setNewReadingDate] = useState<Date | undefined>(new Date());
  const [newReadingReference, setNewReadingReference] = useState('');
  const [showAddReading, setShowAddReading] = useState(false);

  const handleAddStudy = () => {
    if (!newStudyTitle || !startDate || !endDate) return;
    
    const newStudy: BibleStudy = {
      id: (studies.length + 1).toString(),
      title: newStudyTitle,
      description: newStudyDescription,
      type: newStudyType,
      startDate: startDate,
      endDate: endDate,
      progress: 0,
      readings: []
    };
    
    setStudies([...studies, newStudy]);
    setSelectedStudy(newStudy);
    setShowAddForm(false);
    
    // Reset form
    setNewStudyTitle('');
    setNewStudyDescription('');
    setNewStudyType(BibleStudyType[0]);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleAddReading = () => {
    if (!newReadingDate || !newReadingReference || !selectedStudy) return;
    
    const newReading: BibleStudyReading = {
      date: newReadingDate,
      reference: newReadingReference,
      completed: false
    };
    
    const updatedStudy = {
      ...selectedStudy,
      readings: [...selectedStudy.readings, newReading]
    };
    
    setStudies(studies.map(study => 
      study.id === selectedStudy.id ? updatedStudy : study
    ));
    
    setSelectedStudy(updatedStudy);
    setShowAddReading(false);
    
    // Reset form
    setNewReadingDate(new Date());
    setNewReadingReference('');
  };

  const toggleReadingComplete = (readingIndex: number) => {
    if (!selectedStudy) return;
    
    const updatedReadings = selectedStudy.readings.map((reading, index) => {
      if (index === readingIndex) {
        return { ...reading, completed: !reading.completed };
      }
      return reading;
    });
    
    const completedCount = updatedReadings.filter(r => r.completed).length;
    const progress = updatedReadings.length > 0 
      ? Math.round((completedCount / updatedReadings.length) * 100)
      : 0;
    
    const updatedStudy = {
      ...selectedStudy,
      readings: updatedReadings,
      progress
    };
    
    setStudies(studies.map(study => 
      study.id === selectedStudy.id ? updatedStudy : study
    ));
    
    setSelectedStudy(updatedStudy);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Your Bible Studies</h2>
          <p className="text-muted-foreground">Plan, track, and manage your Bible study journey</p>
        </div>
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Bible Study
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Bible Study</DialogTitle>
              <DialogDescription>
                Set up a new Bible study plan to organize your readings and progress.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="E.g., Gospel of John Study" 
                  value={newStudyTitle}
                  onChange={(e) => setNewStudyTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Brief description of this study" 
                  value={newStudyDescription}
                  onChange={(e) => setNewStudyDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Study Type</label>
                <Select value={newStudyType} onValueChange={setNewStudyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BibleStudyType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAddStudy}>Create Study</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-medium text-lg">Your Studies</h3>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {studies.map((study) => (
                <Card 
                  key={study.id}
                  className={`cursor-pointer hover:border-primary/50 transition-colors ${
                    selectedStudy?.id === study.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedStudy(study)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{study.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{study.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{study.type}</Badge>
                          <div className="text-xs text-muted-foreground">
                            {study.progress}% complete
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-3 relative w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-primary rounded-full"
                        style={{ width: `${study.progress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="lg:col-span-2">
          {selectedStudy ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudy.title}</h3>
                  <p className="text-muted-foreground">{selectedStudy.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{selectedStudy.type}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {format(selectedStudy.startDate, 'PP')} - {format(selectedStudy.endDate, 'PP')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Dialog open={showAddReading} onOpenChange={setShowAddReading}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Reading
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Reading</DialogTitle>
                        <DialogDescription>
                          Add a new Bible reading to your study plan.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newReadingDate ? format(newReadingDate, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newReadingDate}
                                onSelect={setNewReadingDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reading Reference</label>
                          <Input 
                            placeholder="E.g., John 3:1-21" 
                            value={newReadingReference}
                            onChange={(e) => setNewReadingReference(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddReading(false)}>Cancel</Button>
                        <Button onClick={handleAddReading}>Add Reading</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Reading Schedule</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="py-2 px-4 font-medium">
                        {format(currentDate, 'MMMM yyyy')}
                      </div>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {selectedStudy.readings.length > 0 ? (
                        selectedStudy.readings.map((reading, index) => (
                          <div 
                            key={index}
                            className="flex items-start justify-between p-3 rounded-md border"
                          >
                            <div className="flex items-start space-x-3">
                              <Button
                                variant={reading.completed ? "default" : "outline"}
                                size="icon"
                                className="rounded-full h-6 w-6"
                                onClick={() => toggleReadingComplete(index)}
                              >
                                {reading.completed && <Check className="h-3 w-3" />}
                              </Button>
                              <div>
                                <div className="font-medium">{reading.reference}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(reading.date, 'EEEE, MMMM do')}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <BookOpen className="h-4 w-4 mr-1" />
                                Read
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                          <h4 className="text-lg font-medium mb-1">No readings scheduled</h4>
                          <p className="text-muted-foreground">
                            Add some readings to get started with your study plan
                          </p>
                          <Button className="mt-4" onClick={() => setShowAddReading(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add First Reading
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <BookOpen className="h-16 w-16 text-primary/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Study Selected</h3>
              <p className="text-muted-foreground max-w-sm">
                Select a study from the list or create a new one to get started
              </p>
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Study
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleStudyPlanner;
