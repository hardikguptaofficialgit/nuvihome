import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  replies_count?: number;
  tags?: string[];
  is_bookmarked?: boolean;
  is_liked?: boolean;
  profiles?: UserProfile;
}

export interface ThreadReply {
  id: string;
  content: string;
  thread_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  created_by: string;
  created_at: string;
  members_count?: number;
  is_joined?: boolean;
  last_active?: string;
  profiles?: UserProfile;
}

export interface ChatRoom {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  participants_count?: number;
  profiles?: UserProfile;
}

export interface ChatMessage {
  id: string;
  content: string;
  room_id: string;
  user_id: string;
  created_at: string;
  profiles?: UserProfile;
}

export interface GroupMessage {
  id: string;
  content: string;
  group_id: string;
  user_id: string;
  created_at: string;
  profiles?: UserProfile;
}

export interface Report {
  id: string;
  reported_by: string;
  content_id: string;
  content_type: 'thread' | 'reply';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  resolved_at?: string;
  reporter?: UserProfile;
}

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    return await getUserProfile(session.session.user.id);
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    return null;
  }
};

export const fetchThreads = async (tagFilter?: string) => {
  try {
    let query = supabase
      .from('discussion_threads')
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .order('created_at', { ascending: false });
    
    if (tagFilter) {
      query = query.contains('tags', [tagFilter]);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const withCounts = await Promise.all(data.map(async (thread) => {
      const likesCount = await getThreadLikeCount(thread.id);
      const repliesCount = await getThreadReplyCount(thread.id);
      const isBookmarked = await checkIsBookmarked(thread.id);
      const isLiked = await checkIsLiked(thread.id);
      
      return {
        ...thread,
        likes_count: likesCount,
        replies_count: repliesCount,
        is_bookmarked: isBookmarked,
        is_liked: isLiked
      };
    }));
    
    return withCounts;
  } catch (error) {
    console.error('Error fetching threads:', error);
    toast.error('Failed to load discussions');
    return [];
  }
};

export const getThreadLikeCount = async (threadId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_thread_like_count', { thread_id: threadId });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting thread like count:', error);
    return 0;
  }
};

export const getThreadReplyCount = async (threadId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_thread_reply_count', { thread_id: threadId });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting thread reply count:', error);
    return 0;
  }
};

export const checkIsBookmarked = async (threadId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return false;
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select()
      .eq('thread_id', threadId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const checkIsLiked = async (threadId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return false;
    
    const { data, error } = await supabase
      .from('thread_likes')
      .select()
      .eq('thread_id', threadId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
};

export const createThread = async (title: string, content: string, tags: string[] = []) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to create a thread');
    
    const { data, error } = await supabase
      .from('discussion_threads')
      .insert({
        title,
        content,
        user_id: session.session.user.id,
        tags
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating thread:', error);
    toast.error('Failed to create thread');
    return null;
  }
};

export const deleteThread = async (threadId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to delete a thread');
    
    const { error: repliesError } = await supabase
      .from('thread_replies')
      .delete()
      .eq('thread_id', threadId);
      
    if (repliesError) throw repliesError;
    
    const { error: likesError } = await supabase
      .from('thread_likes')
      .delete()
      .eq('thread_id', threadId);
      
    if (likesError) throw likesError;
    
    const { error: bookmarksError } = await supabase
      .from('bookmarks')
      .delete()
      .eq('thread_id', threadId);
      
    if (bookmarksError) throw bookmarksError;
    
    const { error } = await supabase
      .from('discussion_threads')
      .delete()
      .eq('id', threadId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting thread:', error);
    toast.error('Failed to delete thread');
    return false;
  }
};

export const likeThread = async (threadId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to like a thread');
    
    const { data: existingLike, error: checkError } = await supabase
      .from('thread_likes')
      .select()
      .eq('thread_id', threadId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingLike) {
      const { error } = await supabase
        .from('thread_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (error) throw error;
      return { action: 'unliked', count: await getThreadLikeCount(threadId) };
    } else {
      const { error } = await supabase
        .from('thread_likes')
        .insert({
          thread_id: threadId,
          user_id: session.session.user.id
        });
        
      if (error) throw error;
      return { action: 'liked', count: await getThreadLikeCount(threadId) };
    }
  } catch (error) {
    console.error('Error toggling thread like:', error);
    toast.error('Failed to update like status');
    return null;
  }
};

export const bookmarkThread = async (threadId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to bookmark a thread');
    
    const { data: existingBookmark, error: checkError } = await supabase
      .from('bookmarks')
      .select()
      .eq('thread_id', threadId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingBookmark) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
        
      if (error) throw error;
      return { action: 'unbookmarked' };
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          thread_id: threadId,
          user_id: session.session.user.id
        });
        
      if (error) throw error;
      return { action: 'bookmarked' };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    toast.error('Failed to update bookmark status');
    return null;
  }
};

export const fetchBookmarkedThreads = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return [];
    
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('thread_id')
      .eq('user_id', session.session.user.id);
      
    if (bookmarksError) throw bookmarksError;
    
    if (!bookmarks.length) return [];
    
    const threadIds = bookmarks.map(bookmark => bookmark.thread_id);
    
    const { data: threads, error: threadsError } = await supabase
      .from('discussion_threads')
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .in('id', threadIds)
      .order('created_at', { ascending: false });
      
    if (threadsError) throw threadsError;
    
    const withCounts = await Promise.all(threads.map(async (thread) => {
      const likesCount = await getThreadLikeCount(thread.id);
      const repliesCount = await getThreadReplyCount(thread.id);
      const isLiked = await checkIsLiked(thread.id);
      
      return {
        ...thread,
        likes_count: likesCount,
        replies_count: repliesCount,
        is_bookmarked: true,
        is_liked: isLiked
      };
    }));
    
    return withCounts;
  } catch (error) {
    console.error('Error fetching bookmarked threads:', error);
    toast.error('Failed to load bookmarked discussions');
    return [];
  }
};

export const fetchReplies = async (threadId: string) => {
  try {
    const { data, error } = await supabase
      .from('thread_replies')
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data as unknown as ThreadReply[];
  } catch (error) {
    console.error('Error fetching replies:', error);
    toast.error('Failed to load replies');
    return [];
  }
};

export const createReply = async (threadId: string, content: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to reply');
    
    const { data, error } = await supabase
      .from('thread_replies')
      .insert({
        thread_id: threadId,
        content,
        user_id: session.session.user.id
      })
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .single();
      
    if (error) throw error;
    return data as unknown as ThreadReply;
  } catch (error) {
    console.error('Error creating reply:', error);
    toast.error('Failed to post reply');
    return null;
  }
};

export const deleteReply = async (replyId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to delete a reply');
    
    const { error } = await supabase
      .from('thread_replies')
      .delete()
      .eq('id', replyId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting reply:', error);
    toast.error('Failed to delete reply');
    return false;
  }
};

export const fetchStudyGroups = async (topicFilter?: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    
    let query = supabase
      .from('study_groups')
      .select(`
        *,
        profiles:user_profiles!study_groups_created_by_fkey(id, username, full_name, avatar_url, role)
      `);
      
    if (topicFilter) {
      query = query.eq('topic', topicFilter);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const withDetails = await Promise.all(data.map(async (group) => {
      const { count, error: countError } = await supabase
        .from('study_group_members')
        .select('*', { count: 'exact' })
        .eq('group_id', group.id);
        
      if (countError) throw countError;
      
      let isJoined = false;
      if (userId) {
        const { data: membership, error: membershipError } = await supabase
          .from('study_group_members')
          .select()
          .eq('group_id', group.id)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!membershipError) {
          isJoined = !!membership;
        }
      }
      
      return {
        ...group,
        members_count: count,
        is_joined: isJoined
      };
    }));
    
    return withDetails;
  } catch (error) {
    console.error('Error fetching study groups:', error);
    toast.error('Failed to load study groups');
    return [];
  }
};

export const createStudyGroup = async (name: string, topic: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to create a study group');
    
    const { data, error } = await supabase
      .from('study_groups')
      .insert({
        name,
        topic,
        created_by: session.session.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    const { error: joinError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: data.id,
        user_id: session.session.user.id
      });
      
    if (joinError) {
      console.error('Error joining created group:', joinError);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating study group:', error);
    toast.error('Failed to create study group');
    return null;
  }
};

export const joinStudyGroup = async (groupId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to join a study group');
    
    const { data: existingMembership, error: checkError } = await supabase
      .from('study_group_members')
      .select()
      .eq('group_id', groupId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingMembership) {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('id', existingMembership.id);
        
      if (error) throw error;
      return { action: 'left' };
    } else {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: session.session.user.id
        });
        
      if (error) throw error;
      return { action: 'joined' };
    }
  } catch (error) {
    console.error('Error toggling group membership:', error);
    toast.error('Failed to update group membership');
    return null;
  }
};

export const getGroupMembers = async (groupId: string): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('study_group_members')
      .select(`
        user_profiles!study_group_members_user_id_fkey(
          id, username, full_name, avatar_url, role, created_at, updated_at
        )
      `)
      .eq('group_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    return data.map(item => {
      return item.user_profiles as UserProfile;
    });
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    return [];
  }
};

export const fetchGroupMessages = async (groupId: string) => {
  try {
    const { data, error } = await supabase.rpc('fetch_group_messages', {
      group_id_param: groupId
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching group messages:', error);
    toast.error('Failed to load group messages');
    return [];
  }
};

export const sendGroupMessage = async (groupId: string, content: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to send a message');

    const { data, error } = await supabase.rpc('insert_group_message', {
      group_id_param: groupId,
      content_param: content,
      user_id_param: session.session.user.id
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending group message:', error);
    toast.error('Failed to send message');
    return null;
  }
};

export const subscribeToGroupMessages = (groupId: string, callback: (message: GroupMessage) => void) => {
  const subscription = supabase
    .channel('public:group_messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        const { data } = await supabase.rpc('get_message_with_profile', {
          message_id_param: payload.new.id
        });
          
        if (data) {
          callback(data as unknown as GroupMessage);
        }
      }
    )
    .subscribe();

  return subscription;
};

export const fetchChatRooms = async () => {
  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        profiles:user_profiles!chat_rooms_created_by_fkey(id, username, full_name, avatar_url, role)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const withCounts = data.map(room => ({
      ...room,
      participants_count: Math.floor(Math.random() * 10) + 1
    }));
    
    return withCounts;
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    toast.error('Failed to load chat rooms');
    return [];
  }
};

export const createChatRoom = async (name: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to create a chat room');
    
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({
        name,
        created_by: session.session.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating chat room:', error);
    toast.error('Failed to create chat room');
    return null;
  }
};

export const fetchMessages = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:user_id(id, username, full_name, avatar_url, role)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to load messages');
    return [];
  }
};

export const sendMessage = async (roomId: string, content: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to send a message');
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        content,
        user_id: session.session.user.id
      })
      .select(`
        *,
        profiles:user_id(id, username, full_name, avatar_url, role)
      `)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    return null;
  }
};

export const subscribeToMessages = (roomId: string, callback: (message: ChatMessage) => void) => {
  const subscription = supabase
    .channel('public:chat_messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        const { data } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles:user_id(id, username, full_name, avatar_url, role)
          `)
          .eq('id', payload.new.id)
          .single();
          
        if (data) {
          callback(data as ChatMessage);
        }
      }
    )
    .subscribe();

  return subscription;
};

export const fetchTrendingThreads = async () => {
  try {
    const { data, error } = await supabase
      .from('discussion_threads')
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trending threads:', error);
    toast.error('Failed to load trending discussions');
    return [];
  }
};

export const reportContent = async (type: 'thread' | 'reply', contentId: string, reason: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('You must be logged in to report content');

    const { data, error } = await supabase.rpc('submit_report', {
      reporter_id: session.session.user.id,
      content_id_param: contentId,
      content_type_param: type,
      reason_param: reason
    });

    if (error) throw error;
    toast.success('Report submitted successfully');
    return data;
  } catch (error) {
    console.error('Error reporting content:', error);
    toast.error('Failed to submit report');
    return null;
  }
};

export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

export const searchThreads = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('discussion_threads')
      .select(`
        *,
        profiles:user_profiles(id, username, full_name, avatar_url, role)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`);
      
    if (error) throw error;
    
    const withCounts = await Promise.all(data.map(async (thread) => {
      const likesCount = await getThreadLikeCount(thread.id);
      const repliesCount = await getThreadReplyCount(thread.id);
      const isBookmarked = await checkIsBookmarked(thread.id);
      const isLiked = await checkIsLiked(thread.id);
      
      return {
        ...thread,
        likes_count: likesCount,
        replies_count: repliesCount,
        is_bookmarked: isBookmarked,
        is_liked: isLiked
      };
    }));
    
    return withCounts;
  } catch (error) {
    console.error('Error searching threads:', error);
    return [];
  }
};

export const searchStudyGroups = async (query: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        profiles:user_profiles!study_groups_created_by_fkey(id, username, full_name, avatar_url, role)
      `)
      .or(`name.ilike.%${query}%,topic.ilike.%${query}%`);
      
    if (error) throw error;
    
    const withDetails = await Promise.all(data.map(async (group) => {
      const { count, error: countError } = await supabase
        .from('study_group_members')
        .select('*', { count: 'exact' })
        .eq('group_id', group.id);
        
      if (countError) throw countError;
      
      let isJoined = false;
      if (userId) {
        const { data: membership, error: membershipError } = await supabase
          .from('study_group_members')
          .select()
          .eq('group_id', group.id)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!membershipError) {
          isJoined = !!membership;
        }
      }
      
      return {
        ...group,
        members_count: count,
        is_joined: isJoined
      };
    }));
    
    return withDetails;
  } catch (error) {
    console.error('Error searching study groups:', error);
    return [];
  }
};

export const getAvailableTags = async () => {
  try {
    return ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};
