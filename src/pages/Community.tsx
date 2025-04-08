import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, MessageSquare, Clock, Calendar, Bell, Hash, Send, 
  BookOpen, Heart, Bookmark, Flag, Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  fetchThreads, fetchStudyGroups, fetchChatRooms, fetchMessages, 
  sendMessage, ChatMessage, Thread, StudyGroup, ChatRoom, subscribeToMessages, 
  formatRelativeTime, searchThreads, searchStudyGroups 
} from '@/services/communityService';
import NewThreadModal from '@/components/community/NewThreadModal';
import ThreadCard from '@/components/community/ThreadCard';
import NewStudyGroupModal from '@/components/community/NewStudyGroupModal';
import StudyGroupCard from '@/components/community/StudyGroupCard';
import NewChatRoomModal from '@/components/community/NewChatRoomModal';
import CommunitySearch from '@/components/community/CommunitySearch';
import BookmarksView from '@/components/community/BookmarksView';
import AdminModTools from '@/components/community/AdminModTools';
import UserProfilePreview from '@/components/community/UserProfilePreview';
import { Toaster } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Community = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("discussions");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  // Data state
  const [threads, setThreads] = useState<Thread[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Loading states
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Modal states
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSubscriptionRef = useRef<any>(null);
  
  // Get admin status from user
  const isAdmin = user?.role === 'admin';

  // Define the loadThreads function BEFORE using it in useEffect
  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const data = await fetchThreads(tagFilter || undefined);
      setThreads(data as unknown as Thread[]);
    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoadingThreads(false);
    }
  };

  // Load study groups
  const loadStudyGroups = async () => {
    setLoadingGroups(true);
    try {
      const data = await fetchStudyGroups(tagFilter || undefined);
      setStudyGroups(data);
    } catch (error) {
      console.error('Error loading study groups:', error);
      toast.error('Failed to load study groups');
    } finally {
      setLoadingGroups(false);
    }
  };

  // Load chat rooms
  const loadChatRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await fetchChatRooms();
      setChatRooms(data);
      
      // Set first chat room as active if none is selected
      if (data.length > 0 && !activeChatRoom) {
        setActiveChatRoom(data[0]);
        await loadChatMessages(data[0].id);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  // Load chat messages
  const loadChatMessages = async (roomId: string) => {
    setLoadingMessages(true);
    try {
      const data = await fetchMessages(roomId);
      setChatMessages(data as unknown as ChatMessage[]);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Now the useEffect can safely reference the functions
  useEffect(() => {
    if (activeTab === "discussions") {
      loadThreads();
    } else if (activeTab === "studyGroups") {
      loadStudyGroups();
    } else if (activeTab === "chatRooms") {
      loadChatRooms();
    }
  }, [activeTab, tagFilter]);

  // Auth protection
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  // Handle changing the active chat room
  const handleRoomChange = async (room: ChatRoom) => {
    // Unsubscribe from current room if any
    if (chatSubscriptionRef.current) {
      chatSubscriptionRef.current.unsubscribe();
    }
    
    setActiveChatRoom(room);
    await loadChatMessages(room.id);
    
    // Subscribe to new room messages
    chatSubscriptionRef.current = subscribeToMessages(room.id, (message) => {
      setChatMessages(prev => [...prev, message]);
      scrollToBottom();
    });
  };

  // Subscribe to messages for the active chat room
  useEffect(() => {
    if (activeChatRoom && activeTab === "chatRooms") {
      chatSubscriptionRef.current = subscribeToMessages(activeChatRoom.id, (message) => {
        setChatMessages(prev => [...prev, message]);
        scrollToBottom();
      });
    }
    
    return () => {
      if (chatSubscriptionRef.current) {
        chatSubscriptionRef.current.unsubscribe();
      }
    };
  }, [activeChatRoom?.id, activeTab]);

  // Auto-scroll chat to bottom on new messages
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Send a chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatRoom) return;
    
    setSendingMessage(true);
    try {
      await sendMessage(activeChatRoom.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is cleared, load regular data
      if (activeTab === "discussions") {
        loadThreads();
      } else if (activeTab === "studyGroups") {
        loadStudyGroups();
      }
      return;
    }
    
    if (activeTab === "discussions") {
      setLoadingThreads(true);
      try {
        const results = await searchThreads(query);
        setThreads(results as unknown as Thread[]);
      } catch (error) {
        console.error('Error searching threads:', error);
      } finally {
        setLoadingThreads(false);
      }
    } else if (activeTab === "studyGroups") {
      setLoadingGroups(true);
      try {
        const results = await searchStudyGroups(query);
        setStudyGroups(results);
      } catch (error) {
        console.error('Error searching study groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    }
  };
  
  const handleTagFilterChange = (tag: string | null) => {
    setTagFilter(tag);
  };
  
  const handleTypeFilterChange = (type: string | null) => {
    if (type) {
      setActiveTab(type);
    }
    setTypeFilter(type);
  };

  return (
    <div className="pt-20 pb-16 px-4">
      <Toaster richColors position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nuvibrainz <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow students, join study groups, and collaborate on your educational journey.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 min-w-[300px]">
            <CommunitySearch 
              onSearchChange={handleSearch} 
              onTagFilterChange={handleTagFilterChange}
              onTypeFilterChange={handleTypeFilterChange}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowBookmarks(!showBookmarks)}
            >
              <Bookmark className="h-4 w-4" />
              {showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <div className="p-4">
                  <h3 className="font-medium mb-2">Recent Notifications</h3>
                  <div className="space-y-3">
                    <div className="p-2 rounded-md bg-accent/10 text-sm">
                      <p className="font-medium">New thread reply</p>
                      <p className="text-muted-foreground">Someone replied to your thread "Physics Doubt"</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <div className="p-2 rounded-md bg-accent/10 text-sm">
                      <p className="font-medium">Study group invitation</p>
                      <p className="text-muted-foreground">You've been invited to join "JEE Masters"</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">View All</Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {showBookmarks && (
          <BookmarksView onThreadUpdated={loadThreads} />
        )}

        <Tabs 
          defaultValue="discussions" 
          className="w-full animate-fade-in"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="discussions" className="text-sm md:text-base">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="studyGroups" className="text-sm md:text-base">
              <Users className="mr-2 h-4 w-4" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger value="chatRooms" className="text-sm md:text-base">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat Rooms
            </TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setNewThreadModalOpen(true)}
              >
                New Thread
              </Button>
            </div>
            
            {loadingThreads ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              </div>
            ) : threads.length > 0 ? (
              <>
                {threads.map(thread => (
                  <ThreadCard 
                    key={thread.id} 
                    thread={thread} 
                    onThreadUpdated={loadThreads}
                  />
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    View More Discussions
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {searchQuery || tagFilter
                    ? 'No discussions found matching your search or filters.' 
                    : 'No discussions yet. Be the first to start a thread!'}
                </p>
              </div>
            )}
            
            {/* New Thread Modal */}
            <NewThreadModal 
              open={newThreadModalOpen} 
              onOpenChange={setNewThreadModalOpen} 
              onThreadCreated={loadThreads} 
            />
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="studyGroups" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Study Groups</h2>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setNewGroupModalOpen(true)}
              >
                Create Group
              </Button>
            </div>
            
            {loadingGroups ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              </div>
            ) : studyGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyGroups.map(group => (
                  <StudyGroupCard 
                    key={group.id} 
                    group={group}
                    onGroupUpdated={loadStudyGroups}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {searchQuery || tagFilter 
                    ? 'No study groups found matching your search or filters.' 
                    : 'No study groups available. Create one to get started!'}
                </p>
              </div>
            )}
            
            {/* New Study Group Modal */}
            <NewStudyGroupModal 
              open={newGroupModalOpen} 
              onOpenChange={setNewGroupModalOpen} 
              onGroupCreated={loadStudyGroups} 
            />
          </TabsContent>

          {/* Chat Rooms Tab */}
          <TabsContent value="chatRooms" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="col-span-1 lg:col-span-1">
                <Card className="glass-card h-[600px] flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Chat Rooms</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    {loadingRooms ? (
                      <div className="flex justify-center py-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      </div>
                    ) : chatRooms.length > 0 ? (
                      chatRooms.map(room => (
                        <div 
                          key={room.id}
                          className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors
                            ${activeChatRoom?.id === room.id ? 'bg-accent/20' : 'hover:bg-secondary/50'}`}
                          onClick={() => handleRoomChange(room)}
                        >
                          <div className="bg-secondary/60 p-2 rounded-full">
                            <MessageSquare className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{room.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{room.participants_count || 0} online</span>
                            </div>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        {searchQuery 
                          ? 'No chat rooms found matching your search.' 
                          : 'No chat rooms available.'}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setNewRoomModalOpen(true)}
                    >
                      Create Chat Room
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="col-span-1 lg:col-span-3">
                <Card className="glass-card h-[600px] flex flex-col">
                  {activeChatRoom ? (
                    <>
                      <CardHeader className="pb-4 border-b">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-accent/20 p-2 rounded-full">
                              <MessageSquare className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{activeChatRoom.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {activeChatRoom.participants_count || 0} participants • Live
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Open menu</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5C0 6.67157 0.671573 6 1.5 6C2.32843 6 3 6.67157 3 7.5ZM9 7.5C9 8.32843 8.32843 9 7.5 9C6.67157 9 6 8.32843 6 7.5C6 6.67157 6.67157 6 7.5 6C8.32843 6 9 6.67157 9 7.5ZM15 7.5C15 8.32843 14.3284 9 13.5 9C12.6716 9 12 8.32843 12 7.5C12 6.67157 12.6716 6 13.5 6C14.3284 6 15 6.67157 15 7.5Z" fill="currentColor" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Participants</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Mute Notifications</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="mr-2 h-4 w-4" />
                                <span>Report Room</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto py-4 px-6">
                        {loadingMessages ? (
                          <div className="flex justify-center py-12">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                          </div>
                        ) : chatMessages.length > 0 ? (
                          chatMessages.map(message => (
                            <div key={message.id} className="mb-4">
                              <div className="flex items-start gap-3">
                                <UserProfilePreview userId={message.user_id} profile={message.profiles}>
                                  <Avatar className="w-8 h-8 cursor-pointer">
                                    <AvatarImage src={message.profiles?.avatar_url || undefined} />
                                    <AvatarFallback className="text-xs bg-secondary/70">
                                      {message.profiles?.full_name?.[0] || message.profiles?.username?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                </UserProfilePreview>
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-medium">
                                      {message.profiles?.full_name || message.profiles?.username || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(message.created_at)}
                                    </span>
                                  </div>
                                  <p className="mt-1">{message.content}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </CardContent>
                      <CardFooter className="pt-4 border-t">
                        <div className="flex w-full gap-2">
                          <Textarea 
                            placeholder="Type your message..." 
                            className="flex-1 min-h-10 max-h-32"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={sendingMessage}
                          />
                          <Button 
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={handleSendMessage}
                            disabled={sendingMessage || !newMessage.trim()}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Chat Room Selected</h3>
                        <p className="text-muted-foreground mb-4">
                          Select a chat room from the sidebar or create a new one to start chatting.
                        </p>
                        <Button 
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => setNewRoomModalOpen(true)}
                        >
                          Create Chat Room
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
            
            {/* New Chat Room Modal */}
            <NewChatRoomModal 
              open={newRoomModalOpen} 
              onOpenChange={setNewRoomModalOpen} 
              onRoomCreated={loadChatRooms} 
            />
          </TabsContent>
        </Tabs>
        
        {/* Moderation Tools for Admin */}
        {isAdmin && <AdminModTools isAdmin={isAdmin} />}

        <div className="mt-12 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Upcoming Community Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="bg-accent/20 p-3 rounded-full w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Physics Masterclass</h3>
                <p className="text-muted-foreground mb-4">
                  Join Prof. Sharma for an in-depth session on Advanced Mechanics.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> Tomorrow, 6:00 PM
                  </span>
                  <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                    Remind Me
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="bg-accent/20 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Group Study Session</h3>
                <p className="text-muted-foreground mb-4">
                  Collaborative problem-solving for JEE Mathematics.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> Saturday, 11:00 AM
                  </span>
                  <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                    Join Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="bg-accent/20 p-3 rounded-full w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Q&A with Experts</h3>
                <p className="text-muted-foreground mb-4">
                  Live session with top NEET qualifiers from last year.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> Sunday, 4:00 PM
                  </span>
                  <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
