import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AiEvangelism from './pages/AiEvangelism';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from '@/pages/EditEvent';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import BibleStudies from './pages/BibleStudies';
import DesignToolPage from './pages/DesignTool';
import ApiDocs from './pages/ApiDocs';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CourseLesson from './pages/CourseLesson';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Community from './pages/Community';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import ScriptureRecommender from './components/ai/ScriptureRecommender';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="evangelio-theme">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/courses" element={<Courses />} />
                <Route 
                  path="/courses/:slug" 
                  element={
                    <div style={{border: '5px solid red', padding: '20px'}}>
                      <CourseDetail />
                    </div>
                  } 
                />
                <Route path="/courses/:slug/lessons/:lessonId" element={<CourseLesson />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store/:slug" element={<ProductDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/edit/:id" element={<EditEvent />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/ai-evangelism" element={<AiEvangelism />} />
                <Route path="/ai/recommendations" element={<ScriptureRecommender />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/bible-studies" element={<BibleStudies />} />
                <Route path="/community" element={<Community />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/:contactId" element={<Contacts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/design" element={<DesignToolPage />} />
              </Routes>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
