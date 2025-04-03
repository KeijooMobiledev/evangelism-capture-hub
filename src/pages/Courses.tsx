
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApi } from '@/hooks/use-api';
import { Course } from '@/types/course';
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
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Users } from 'lucide-react';

const Courses: React.FC = () => {
  const { api, isLoading } = useApi();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await api.courses.getAll();
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [api]);

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
        <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>
        
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
              </div>
            </div>
          </div>
          
          {/* Courses content */}
          <div>
            <Tabs defaultValue="grid" className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Available Courses</h2>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-6">
                {isLoading ? (
                  <p className="text-center py-12">Loading courses...</p>
                ) : filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <Card key={course.id} className="overflow-hidden flex flex-col">
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
                  <p className="text-center py-12">Loading courses...</p>
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
