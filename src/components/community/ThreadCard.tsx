
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Heart, Bookmark, Clock, Flag, 
  MoreHorizontal, Trash2, Tag, Share 
} from 'lucide-react';
import { 
  Thread, likeThread, bookmarkThread, createReply, fetchReplies, 
  ThreadReply, formatRelativeTime, deleteThread, deleteReply,
  reportContent 
} from '@/services/communityService';
import { toast } from "sonner";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ThreadCardProps {
  thread: Thread;
  onThreadUpdated: () => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onThreadUpdated }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
  const isAdmin = user?.role === 'admin';

  const handleLike = async () => {
    const result = await likeThread(thread.id);
    if (result) {
      onThreadUpdated();
    }
  };

  const handleBookmark = async () => {
    const result = await bookmarkThread(thread.id);
    if (result) {
      toast.success(result.action === 'added' ? 'Thread bookmarked' : 'Bookmark removed');
      onThreadUpdated();
    }
  };

  const handleLoadReplies = async () => {
    if (!showReplies) {
      setIsLoadingReplies(true);
      try {
        const data = await fetchReplies(thread.id);
        setReplies(data as unknown as ThreadReply[]);
        setShowReplies(true);
      } catch (error) {
        console.error('Error loading replies:', error);
      } finally {
        setIsLoadingReplies(false);
      }
    } else {
      setShowReplies(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReply.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await createReply(thread.id, newReply);
      if (result) {
        const updatedReplies = await fetchReplies(thread.id);
        setReplies(updatedReplies as unknown as ThreadReply[]);
        setNewReply('');
        toast.success('Reply posted successfully');
        onThreadUpdated();
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteThread = async () => {
    const success = await deleteThread(thread.id);
    if (success) {
      onThreadUpdated();
    }
  };
  
  const handleDeleteReply = async (replyId: string) => {
    const success = await deleteReply(replyId);
    if (success) {
      // Refresh replies
      const updatedReplies = await fetchReplies(thread.id);
      setReplies(updatedReplies as unknown as ThreadReply[]);
      onThreadUpdated();
    }
  };
  
  const handleReportThread = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }
    
    const result = await reportContent('thread', thread.id, reportReason);
    if (result) {
      setReportReason('');
    }
  };
  
  const handleReportReply = async (replyId: string) => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }
    
    const result = await reportContent('reply', replyId, reportReason);
    if (result) {
      setReportReason('');
    }
  };
  
  const handleShareThread = () => {
    navigator.clipboard.writeText(window.location.origin + '/community?thread=' + thread.id)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <Card className="glass-card mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex gap-4 mb-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer">
                  <AvatarImage src={thread.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="bg-secondary/70">
                    {thread.profiles?.full_name?.[0] || thread.profiles?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src={thread.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary/70">
                      {thread.profiles?.full_name?.[0] || thread.profiles?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      {thread.profiles?.full_name || thread.profiles?.username || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-muted-foreground">{thread.profiles?.role || 'Student'}</p>
                    <div className="flex items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => window.location.href = `/profile/${thread.user_id}`}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{thread.profiles?.full_name || thread.profiles?.username || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">{thread.profiles?.role || 'Student'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {formatRelativeTime(thread.created_at)}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleShareThread}>
                        <Share className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Flag className="mr-2 h-4 w-4" /> Report
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Report this thread</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please provide a reason for reporting this content:
                              <Textarea 
                                className="mt-2" 
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Specify why you're reporting this content..."
                              />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setReportReason('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReportThread}>Submit</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this thread and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteThread} className="bg-destructive text-destructive-foreground">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{thread.title}</h3>
          <p className="mb-4">{thread.content}</p>
          
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-accent/10 text-accent">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" /> {thread.replies_count} Replies
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" /> {thread.likes_count} Likes
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLike}
                className={thread.is_liked ? "text-accent" : ""}
              >
                <Heart 
                  className={`h-4 w-4 mr-1 ${thread.is_liked ? "fill-accent text-accent" : ""}`} 
                /> Like
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLoadReplies}
              >
                <MessageSquare className="h-4 w-4 mr-1" /> {showReplies ? 'Hide Replies' : 'Reply'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBookmark}
                className={thread.is_bookmarked ? "text-accent" : ""}
              >
                <Bookmark 
                  className={`h-4 w-4 mr-1 ${thread.is_bookmarked ? "fill-accent text-accent" : ""}`} 
                /> {thread.is_bookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareThread}
              >
                <Share className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </div>
          
          {/* Replies section */}
          {showReplies && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-4">Replies</h4>
              
              {isLoadingReplies ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
              ) : replies.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {replies.map(reply => (
                    <div key={reply.id} className="flex gap-3">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="bg-secondary/70 text-xs">
                              {reply.profiles?.full_name?.[0] || reply.profiles?.username?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <Avatar>
                              <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                              <AvatarFallback className="bg-secondary/70">
                                {reply.profiles?.full_name?.[0] || reply.profiles?.username?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">
                                {reply.profiles?.full_name || reply.profiles?.username || 'Anonymous'}
                              </h4>
                              <p className="text-sm text-muted-foreground">{reply.profiles?.role || 'Student'}</p>
                              <div className="flex items-center pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-8"
                                  onClick={() => window.location.href = `/profile/${reply.user_id}`}
                                >
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium">
                              {reply.profiles?.full_name || reply.profiles?.username || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.created_at)}
                            </span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Flag className="mr-2 h-4 w-4" /> Report
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Report this reply</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Please provide a reason for reporting this content:
                                      <Textarea 
                                        className="mt-2" 
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder="Specify why you're reporting this content..."
                                      />
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setReportReason('')}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleReportReply(reply.id)}>Submit</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              {isAdmin && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this reply and cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteReply(reply.id)} className="bg-destructive text-destructive-foreground">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No replies yet. Be the first to reply!
                </div>
              )}
              
              {/* Reply form */}
              <form onSubmit={handleSubmitReply} className="mt-4">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button 
                    type="submit" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isSubmitting || !newReply.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadCard;
