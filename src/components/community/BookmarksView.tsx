
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { fetchBookmarkedThreads } from '@/services/communityService';
import ThreadCard from './ThreadCard';
import { toast } from "sonner";

interface BookmarksViewProps {
  onThreadUpdated: () => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ onThreadUpdated }) => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadBookmarks();
  }, []);
  
  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await fetchBookmarkedThreads();
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="bg-accent/20 p-2 rounded-full">
            <Bookmark className="h-5 w-5 text-accent" />
          </span>
          Your Bookmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((thread: any) => (
              <ThreadCard 
                key={thread.id} 
                thread={thread} 
                onThreadUpdated={() => {
                  onThreadUpdated();
                  loadBookmarks();
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">You haven't bookmarked any threads yet.</p>
            <Button 
              variant="outline" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Browse Discussions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookmarksView;
