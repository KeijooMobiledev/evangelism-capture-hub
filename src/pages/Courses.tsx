
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Clock, Users, Star, GraduationCap } from 'lucide-react';
import { Course } from '@/types/course';
import { getAllCourses } from '@/data/coursesData';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // Get courses data from our data file
        const allCourses = getAllCourses();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
        
        // Set recommended courses (could be based on other criteria in a real app)
        // For now, let's just use the first 2 courses
        setRecommendedCourses(allCourses.slice(0, 2));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(course => course.category === categoryFilter);
    }
    
    // Apply level filter
    if (levelFilter !== 'all') {
      result = result.filter(course => course.level === levelFilter);
    }
    
    setFilteredCourses(result);
  }, [searchTerm, categoryFilter, levelFilter, courses]);

  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <Button asChild>
            <Link to="/dashboard">
              <GraduationCap className="mr-2 h-4 w-4" />
              My Learning Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Recommended Courses Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recommendedCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="grid grid-cols-[120px_1fr] h-full">
                  <div className="relative">
                    <img 
                      src={course.coverImage} 
                      alt={course.title} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-0 left-0 right-0 bg-primary/80 text-white p-1 text-xs font-medium text-center">
                      Recommended
                    </div>
                  </div>
                  <div className="p-4 flex flex-col">
                    <CardTitle className="mb-1 text-lg">
                      <Link to={`/courses/${course.slug}`} className="hover:underline">
                        {course.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center text-amber-500 mb-2">
                      <Star className="fill-amber-500 h-4 w-4" />
                      <Star className="fill-amber-500 h-4 w-4" />
                      <Star className="fill-amber-500 h-4 w-4" />
                      <Star className="fill-amber-500 h-4 w-4" />
                      <Star className="h-4 w-4" />
                      <span className="ml-2 text-sm text-muted-foreground">(4.0)</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <Badge variant="outline">{course.level}</Badge>
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.slug}`}>
                          View Course
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-[1fr_3fr] lg:gap-8">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Category</label>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => setCategoryFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Level</label>
                  <Select
                    value={levelFilter}
                    onValueChange={(value) => setLevelFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Duration</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start" 
                      onClick={() => setSearchTerm('weeks')}
                    >
                      Short (&lt; 4 weeks)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start" 
                      onClick={() => setSearchTerm('8 weeks')}
                    >
                      Long (8+ weeks)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help Choosing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Not sure which course is right for you? Our team can help guide you to the perfect learning path.
                </p>
                <Button variant="outline" className="w-full">Contact an Advisor</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Courses content */}
          <div>
            <Tabs defaultValue="grid" className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Courses</h2>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Loading courses...</p>
                  </div>
                ) : filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                        <div className="aspect-video relative">
                          <img 
                            src={course.coverImage} 
                            alt={course.title} 
                            className="object-cover w-full h-full"
                          />
                          <Badge className="absolute top-2 right-2">{course.level}</Badge>
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-2">
                            <Link to={`/courses/${course.slug}`} className="hover:underline">
                              {course.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span>{course.lessonsCount} lessons</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">
                            {course.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center mt-auto">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm text-muted-foreground">{course.enrolledCount} enrolled</span>
                          </div>
                          <Button asChild>
                            <Link to={`/courses/${course.slug}`}>
                              View Course
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p>No courses found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                        setLevelFilter('all');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Loading courses...</p>
                  </div>
                ) : filteredCourses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCourses.map(course => (
                      <Card key={course.id}>
                        <div className="flex flex-col md:flex-row p-0 overflow-hidden">
                          <div className="w-full md:w-48 h-40">
                            <img 
                              src={course.coverImage} 
                              alt={course.title} 
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between">
                              <h3 className="text-xl font-semibold">
                                <Link to={`/courses/${course.slug}`} className="hover:underline">
                                  {course.title}
                                </Link>
                              </h3>
                              <Badge>{course.level}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-2">{course.description}</p>
                            <div className="flex items-center mt-4 justify-between">
                              <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  <span>{course.lessonsCount} lessons</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{course.enrolledCount} enrolled</span>
                                </div>
                              </div>
                              <Button asChild>
                                <Link to={`/courses/${course.slug}`}>
                                  View Course
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p>No courses found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                        setLevelFilter('all');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
