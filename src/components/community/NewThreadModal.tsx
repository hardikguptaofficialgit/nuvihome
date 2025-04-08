import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createThread, getAvailableTags } from '@/services/communityService';
import { Badge } from '@/components/ui/badge';

interface NewThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThreadCreated: () => void;
}

const NewThreadModal: React.FC<NewThreadModalProps> = ({ 
  open, 
  onOpenChange,
  onThreadCreated
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAvailableTags();
        if (tags && Array.isArray(tags)) {
          setAvailableTags(tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    if (open) {
      fetchTags();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please add content to your thread');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await createThread(title, content, selectedTags);
      
      if (result) {
        toast.success('Thread created successfully!');
        setTitle('');
        setContent('');
        setSelectedTags([]);
        onOpenChange(false);
        onThreadCreated();
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogDescription>
            Start a new discussion to share knowledge or ask questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {availableTags.length > 0 && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            disabled={isLoading || !title.trim() || !content.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? 'Creating...' : 'Create Thread'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewThreadModal;
