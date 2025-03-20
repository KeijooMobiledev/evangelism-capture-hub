
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Map, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  BellRing, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown, 
  Search,
  Phone,
  Video,
  Plus,
  Paperclip,
  Send,
  Smile,
  MoreVertical,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface Conversation {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

interface Message {
  id: number;
  sender: 'me' | 'them';
  content: string;
  time: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    lastMessage: 'Did you visit the Davis family yet?',
    time: '10:42 AM',
    unread: true,
    online: true,
  },
  {
    id: 2,
    name: 'Maria Garcia',
    lastMessage: 'I left some Bibles at the community center',
    time: 'Yesterday',
    unread: false,
    online: true,
  },
  {
    id: 3,
    name: 'David Lee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    lastMessage: 'The prayer meeting was amazing!',
    time: 'Yesterday',
    unread: false,
    online: false,
  },
  {
    id: 4,
    name: 'Riverdale Group',
    lastMessage: 'Pastor Michael: Let\'s meet tomorrow at 6pm',
    time: 'Monday',
    unread: false,
    online: false,
  },
  {
    id: 5,
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    lastMessage: 'I need more pamphlets for tomorrow',
    time: 'Monday',
    unread: false,
    online: true,
  },
];

const messages: Message[] = [
  {
    id: 1,
    sender: 'them',
    content: 'Hey Sarah, how\'s the evangelization going in the Riverdale district?',
    time: '10:30 AM'
  },
  {
    id: 2,
    sender: 'me',
    content: 'It\'s going well! We\'ve covered about 60% of the houses so far.',
    time: '10:32 AM'
  },
  {
    id: 3,
    sender: 'them',
    content: 'That\'s great progress! Any notable encounters?',
    time: '10:35 AM'
  },
  {
    id: 4,
    sender: 'me',
    content: 'Yes, the Davis family showed a lot of interest. They asked about Bible study groups.',
    time: '10:38 AM'
  },
  {
    id: 5,
    sender: 'me',
    content: 'I added them to our follow-up list and shared some resources with them.',
    time: '10:38 AM'
  },
  {
    id: 6,
    sender: 'them',
    content: 'Perfect! I\'ll make sure they get an invite to our Sunday meeting.',
    time: '10:40 AM'
  },
  {
    id: 7,
    sender: 'them',
    content: 'Did you visit the Davis family yet?',
    time: '10:42 AM'
  },
];

const MessagesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messageText, setMessageText] = useState('');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // In a real app, this would send the message to a backend
    console.log('Sending message:', messageText);
    
    // Clear the input field
    setMessageText('');
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside 
        className={`bg-sidebar border-r border-border transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } relative z-20`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 rounded-full"></div>
                <span className="relative text-white font-bold text-lg">E</span>
              </div>
              <span className={`text-lg font-semibold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                EvangelioTrack
              </span>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleSidebar}
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
          </div>
          
          <div className="p-3">
            <Button 
              variant="outline" 
              className={`w-full justify-start border-dashed transition-all ${isSidebarOpen ? '' : 'p-2 justify-center'}`}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              {isSidebarOpen && <span>New Activity</span>}
            </Button>
          </div>
          
          <nav className="flex-1 py-3">
            <div className="px-3 pb-2">
              {isSidebarOpen && <p className="text-xs text-muted-foreground px-3 pb-1">Main</p>}
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Dashboard</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/people" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Users className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>People</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Map className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Map</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="flex items-center text-sm px-3 py-2 bg-primary/10 text-primary rounded-md">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Messages</span>}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="px-3 py-2">
              {isSidebarOpen && <p className="text-xs text-muted-foreground px-3 pb-1">Features</p>}
              <ul className="space-y-1">
                <li>
                  <Link to="/calendar" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Calendar className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Calendar</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Resources</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/notifications" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <BellRing className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Notifications</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center text-sm px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    <Settings className="h-5 w-5 mr-2" />
                    {isSidebarOpen && <span>Settings</span>}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="p-3 mt-auto border-t border-border">
            <div className={`flex items-center justify-between ${isSidebarOpen ? '' : 'flex-col'}`}>
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                
                {isSidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">Sarah Connor</p>
                    <p className="text-xs text-muted-foreground">Community Admin</p>
                  </div>
                )}
              </div>
              
              {isSidebarOpen && (
                <Button variant="ghost" size="icon" className="rounded-full">
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Conversations list */}
      <div className="w-80 border-r border-border bg-background/50 overflow-y-auto relative z-10">
        <div className="p-4 border-b border-border sticky top-0 bg-background/90 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Messages</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages..." 
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
        </div>
        
        <div className="py-2">
          {conversations.map((conversation) => (
            <button 
              key={conversation.id} 
              className={`w-full p-3 flex items-center space-x-3 hover:bg-muted/50 transition-colors ${
                selectedConversation.id === conversation.id ? 'bg-primary/5' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  {conversation.avatar ? (
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  ) : (
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                {conversation.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden text-left">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{conversation.name}</p>
                  <span className="text-xs text-muted-foreground">{conversation.time}</span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              
              {conversation.unread && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              {selectedConversation.avatar ? (
                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
              ) : (
                <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{selectedConversation.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Video className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'them' && (
                <Avatar className="h-8 w-8 mr-3 mt-1">
                  {selectedConversation.avatar ? (
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  ) : (
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.sender === 'me' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex-1 relative">
              <Input 
                placeholder="Type a message..." 
                className="pr-10 h-10 bg-muted/50"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-1 top-1 rounded-full">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full"
              onClick={handleSendMessage}
              disabled={messageText.trim() === ''}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
