
import { useState, useEffect, useRef } from 'react';
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
  PlusCircle,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  online: boolean;
}

const MessagesPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  // Fetch conversations when component mounts
  useEffect(() => {
    if (!user) return;
    
    fetchConversations();
    const channel = subscribeToPresence();
    
    return () => {
      // Clean up subscription
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);
  
  // Subscribe to realtime updates for messages
  useEffect(() => {
    if (!user || !selectedConversation) return;
    
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as Message;
          
          // Only add the message if it's from the currently selected conversation
          if (newMessage.sender_id === selectedConversation.user_id) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            markMessageAsRead(newMessage.id);
          } else {
            // Update unread count for other conversations
            fetchConversations();
            toast({
              title: "New message",
              description: `You have a new message from ${conversations.find(c => c.user_id === newMessage.sender_id)?.full_name || 'Someone'}`,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Subscribe to user presence
  const subscribeToPresence = (): RealtimeChannel => {
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user?.id,
        },
      },
    });
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newOnlineUsers: Record<string, boolean> = {};
        
        Object.keys(state).forEach(userId => {
          newOnlineUsers[userId] = true;
        });
        
        setOnlineUsers(newOnlineUsers);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => ({ ...prev, [key]: true }));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => ({ ...prev, [key]: false }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
      
    return channel;
  };
  
  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
        
      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessageAsRead:', error);
    }
  };
  
  // Mark all messages as read for a conversation
  const markAllMessagesAsRead = async (senderId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', senderId)
        .eq('recipient_id', user?.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error in markAllMessagesAsRead:', error);
    }
  };
  
  // Fetch user conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get all messages to/from the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }
      
      // Get unique user IDs the current user has chatted with
      const uniqueUserIds = new Set<string>();
      (messagesData as Message[]).forEach(message => {
        const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        uniqueUserIds.add(otherUserId);
      });
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(uniqueUserIds));
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }
      
      // Create conversations from the profiles and messages
      const conversationsMap = new Map<string, Conversation>();
      
      profilesData?.forEach(profile => {
        // Get the latest message for this user
        const userMessages = (messagesData as Message[]).filter(message => 
          message.sender_id === profile.id || message.recipient_id === profile.id
        );
        
        if (userMessages.length > 0) {
          const latestMessage = userMessages.reduce((latest, current) => 
            new Date(current.created_at) > new Date(latest.created_at) ? current : latest
          );
          
          const unreadCount = (messagesData as Message[]).filter(message => 
            message.sender_id === profile.id && 
            message.recipient_id === user.id && 
            !message.is_read
          ).length;
          
          conversationsMap.set(profile.id, {
            id: profile.id,
            user_id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
            last_message: latestMessage.content,
            last_message_time: latestMessage.created_at,
            unread_count: unreadCount,
            online: false // Will be updated by presence
          });
        }
      });
      
      // If there are no conversations yet and this is the first load,
      // create fake conversations for all available users as placeholder
      if (conversationsMap.size === 0) {
        const { data: allProfiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
          
        if (!error && allProfiles) {
          allProfiles.forEach(profile => {
            conversationsMap.set(profile.id, {
              id: profile.id,
              user_id: profile.id,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              role: profile.role,
              last_message: "Start a conversation",
              last_message_time: new Date().toISOString(),
              unread_count: 0,
              online: false
            });
          });
        }
      }
      
      const conversationsList = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
      
      setConversations(conversationsList);
      
      // Select first conversation if none is selected
      if (!selectedConversation && conversationsList.length > 0) {
        setSelectedConversation(conversationsList[0]);
        fetchMessages(conversationsList[0].user_id);
      }
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error loading conversations",
        description: "Could not load your conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch messages for a conversation
  const fetchMessages = async (recipientId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      setMessages(data as Message[]);
      
      // Mark messages as read
      await markAllMessagesAsRead(recipientId);
      
      // Update conversations to reflect read messages
      fetchConversations();
      
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };
  
  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user_id);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!user || !selectedConversation || messageText.trim() === '') return;
    
    try {
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedConversation.user_id,
        content: messageText,
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select();
        
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error sending message",
          description: "Your message could not be sent. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Add the sent message to the messages list
      setMessages(prevMessages => [...prevMessages, data[0] as Message]);
      
      // Clear the input field
      setMessageText('');
      
      // Update conversations list
      fetchConversations();
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
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
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                  <AvatarFallback>{profile?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                
                {isSidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile?.role || "User"}</p>
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
        
        <ScrollArea className="h-[calc(100vh-8.5rem)]">
          <div className="py-2">
            {isLoading ? (
              // Loading state
              <div className="flex justify-center py-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              // Empty state
              <div className="text-center py-8 px-4">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start a conversation with a team member
                </p>
              </div>
            ) : (
              // List of conversations
              conversations.map((conversation) => (
                <button 
                  key={conversation.id} 
                  className={`w-full p-3 flex items-center space-x-3 hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      {conversation.avatar_url ? (
                        <AvatarImage src={conversation.avatar_url} alt={conversation.full_name || ''} />
                      ) : (
                        <AvatarFallback>{conversation.full_name?.[0] || '?'}</AvatarFallback>
                      )}
                    </Avatar>
                    {onlineUsers[conversation.user_id] && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden text-left">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{conversation.full_name || 'Unknown'}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageDate(conversation.last_message_time)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {conversation.last_message}
                    </p>
                  </div>
                  
                  {conversation.unread_count > 0 && (
                    <div className="flex items-center justify-center min-w-5 h-5 bg-primary rounded-full text-xs text-white font-medium px-1.5">
                      {conversation.unread_count}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  {selectedConversation.avatar_url ? (
                    <AvatarImage src={selectedConversation.avatar_url} alt={selectedConversation.full_name || ''} />
                  ) : (
                    <AvatarFallback>{selectedConversation.full_name?.[0] || '?'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">{selectedConversation.full_name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {onlineUsers[selectedConversation.user_id] ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Online
                      </>
                    ) : (
                      'Offline'
                    )}
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
            <ScrollArea className="flex-1 p-4 space-y-4 h-[calc(100vh-8rem)]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2 max-w-md">
                    Send a message to {selectedConversation.full_name} to start a conversation.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isSender = message.sender_id === user?.id;
                  const showAvatar = !isSender && (index === 0 || messages[index - 1].sender_id !== message.sender_id);
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isSender && showAvatar && (
                        <Avatar className="h-8 w-8 mr-3 mt-1">
                          {selectedConversation.avatar_url ? (
                            <AvatarImage 
                              src={selectedConversation.avatar_url} 
                              alt={selectedConversation.full_name || ''} 
                            />
                          ) : (
                            <AvatarFallback>
                              {selectedConversation.full_name?.[0] || '?'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                      
                      <div 
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          isSender 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className={`flex items-center text-xs mt-1 ${
                          isSender 
                            ? 'text-primary-foreground/70 justify-end' 
                            : 'text-muted-foreground'
                        }`}>
                          <span>{formatMessageDate(message.created_at)}</span>
                          {isSender && (
                            <span className="ml-1">
                              {message.is_read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            
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
                  disabled={!selectedConversation || messageText.trim() === ''}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Your Messages</h3>
            <p className="text-center text-muted-foreground mt-2 max-w-md">
              Select a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
