import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Menu,
  Plus,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Users,
  ChevronLeft,
} from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  last_seen?: string;
  online?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  online: boolean;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState("");

  const fetchProfiles = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", user.id);
    
    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }
    
    setProfiles(data as ProfileData[]);
  };

  const subscribeToPresence = () => {
    if (!user) return;
    
    const channel = supabase.channel('online-users');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        
        setProfiles(prevProfiles => 
          prevProfiles.map(profile => {
            const isOnline = Object.keys(presenceState).some(key => 
              presenceState[key].some((p: any) => p.user_id === profile.id)
            );
            return { ...profile, online: isOnline };
          })
        );
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString()
          });
        }
      });
    
    return channel;
  };

  const fetchConversations = async () => {
    if (!user) return;
    
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    
    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return;
    }
    
    const userIds = new Set<string>();
    (messagesData as Message[]).forEach(message => {
      if (message.sender_id !== user.id) userIds.add(message.sender_id);
      if (message.recipient_id !== user.id) userIds.add(message.recipient_id);
    });
    
    const { data: profilesData, error: profilesError } = await supabase
      .from("users")
      .select("*")
      .in("id", Array.from(userIds));
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return;
    }
    
    const conversationsMap = new Map<string, Conversation>();
    
    (messagesData as Message[]).forEach(message => {
      const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      
      if (!conversationsMap.has(otherUserId)) {
        const profile = (profilesData as ProfileData[]).find(p => p.id === otherUserId);
        if (profile) {
          conversationsMap.set(otherUserId, {
            id: otherUserId,
            user_id: otherUserId,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
            online: false,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.sender_id !== user.id && !message.is_read ? 1 : 0
          });
        }
      } else {
        const conv = conversationsMap.get(otherUserId)!;
        const messageTime = new Date(message.created_at).getTime();
        const lastMessageTime = new Date(conv.last_message_time).getTime();
        
        if (messageTime > lastMessageTime) {
          conv.last_message = message.content;
          conv.last_message_time = message.created_at;
        }
        
        if (message.sender_id !== user.id && !message.is_read) {
          conv.unread_count += 1;
        }
      }
    });
    
    const sortedConversations = Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
    );
    
    setConversations(sortedConversations);
  };

  const fetchMessages = async (conversationUserId: string) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${conversationUserId}),and(sender_id.eq.${conversationUserId},recipient_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    
    setMessages(data as Message[]);
    
    const unreadMessages = (data as Message[]).filter(
      msg => msg.recipient_id === user.id && !msg.is_read
    );
    
    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(msg =>
          supabase
            .from("messages")
            .update({ is_read: true })
            .eq("id", msg.id)
        )
      );
      
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.user_id === conversationUserId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    }
  };

  const sendMessage = async () => {
    if (!user || !activeConversation || !newMessage.trim()) return;
    
    const message = {
      content: newMessage,
      sender_id: user.id,
      recipient_id: activeConversation.user_id,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from("messages")
      .insert([message])
      .select();
    
    if (error) {
      console.error("Error sending message:", error);
      return;
    }
    
    setMessages([...messages, data[0] as Message]);
    
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.user_id === activeConversation.user_id
          ? {
              ...conv,
              last_message: newMessage,
              last_message_time: new Date().toISOString()
            }
          : conv
      )
    );
    
    setNewMessage("");
  };

  const startNewConversation = async () => {
    if (!user || !newRecipientId) return;
    
    const existingConversation = conversations.find(
      conv => conv.user_id === newRecipientId
    );
    
    if (existingConversation) {
      setActiveConversation(existingConversation);
      await fetchMessages(existingConversation.user_id);
      setShowNewMessageForm(false);
      return;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", newRecipientId)
      .single();
    
    if (profileError) {
      console.error("Error fetching recipient profile:", profileError);
      return;
    }
    
    const profile = profileData as ProfileData;
    
    const newConversation: Conversation = {
      id: newRecipientId,
      user_id: newRecipientId,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      online: false,
      last_message: "",
      last_message_time: new Date().toISOString(),
      unread_count: 0
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation);
    setMessages([]);
    setShowNewMessageForm(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles();
      await fetchConversations();
    };
    
    fetchData();
    
    const presenceChannel = subscribeToPresence();
    
    const messageSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          if (newMessage.sender_id === user?.id || newMessage.recipient_id === user?.id) {
            if (
              activeConversation &&
              (newMessage.sender_id === activeConversation.user_id ||
                newMessage.recipient_id === activeConversation.user_id)
            ) {
              setMessages(prevMessages => [...prevMessages, newMessage]);
              
              if (newMessage.sender_id === activeConversation.user_id) {
                await supabase
                  .from("messages")
                  .update({ is_read: true })
                  .eq("id", newMessage.id);
              }
            }
            
            await fetchConversations();
          }
        }
      )
      .subscribe();
    
    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
      supabase.removeChannel(messageSubscription);
    };
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.user_id);
    }
  }, [activeConversation]);

  const filteredConversations = conversations.filter(
    conv =>
      conv.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      <aside
        className={`border-r border-border bg-background transition-all duration-300 ${
          isSidebarOpen ? "w-80" : "w-0"
        } md:block overflow-hidden flex flex-col h-full`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowNewMessageForm(true)}
            >
              <Plus size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
              <Settings size={18} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showNewMessageForm ? (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium mb-3">New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">To:</label>
                <select
                  className="w-full mt-1 p-2 bg-background border border-input rounded-md"
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                >
                  <option value="">Select a contact</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.full_name || "Unnamed User"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  disabled={!newRecipientId}
                  onClick={startNewConversation}
                >
                  Start Chat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewMessageForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 flex items-center space-x-3 hover:bg-muted cursor-pointer ${
                    activeConversation?.id === conversation.id
                      ? "bg-muted"
                      : ""
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={conversation.avatar_url || ""}
                        alt={conversation.full_name || ""}
                      />
                      <AvatarFallback>
                        {(conversation.full_name || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {conversation.full_name || "Unnamed User"}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          conversation.last_message_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message}
                      </p>
                      {conversation.unread_count > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-sm font-medium">No conversations</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchTerm
                    ? "No results found. Try a different search."
                    : "Start a new conversation by clicking the plus icon."}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 mr-3">
              <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
              <AvatarFallback>
                {(user?.user_metadata?.full_name || "U")[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.user_metadata?.role || "Evangelist"}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-background flex items-center px-4">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full mr-2 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
          )}

          {activeConversation ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full mr-2 md:hidden"
                  onClick={() => setActiveConversation(null)}
                >
                  <ChevronLeft size={18} />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={activeConversation.avatar_url || ""}
                    alt={activeConversation.full_name || ""}
                  />
                  <AvatarFallback>
                    {(activeConversation.full_name || "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {activeConversation.full_name || "Unnamed User"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.online
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full"
                >
                  <Phone size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full"
                >
                  <Video size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Menu size={18} />
              </Button>
            </div>
          )}
        </header>

        {activeConversation ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender_id !== user?.id && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage
                            src={activeConversation.avatar_url || ""}
                            alt={activeConversation.full_name || ""}
                          />
                          <AvatarFallback>
                            {(activeConversation.full_name || "U")[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          message.sender_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_id === user?.id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-muted/50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Send a message to start the conversation
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/10">
            <div className="bg-muted/50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p className="text-muted-foreground mt-1 text-center max-w-sm">
              Choose a conversation from the sidebar or start a new one to begin
              messaging
            </p>
            <Button
              variant="default"
              className="mt-4"
              onClick={() => setShowNewMessageForm(true)}
            >
              <Plus size={18} className="mr-2" />
              New Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
