import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createStudyGroup } from '@/services/communityService';
import { toast } from 'sonner';

interface NewStudyGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

const TOPICS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Other'
];

const NewStudyGroupModal: React.FC<NewStudyGroupModalProps> = ({ 
  open, 
  onOpenChange, 
  onGroupCreated 
}) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !topic) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createStudyGroup(name, topic);
      if (result) {
        toast.success('Study group created successfully!');
        setName('');
        setTopic('');
        onOpenChange(false);
        onGroupCreated();
      }
    } catch (error) {
      console.error('Error creating study group:', error);
      toast.error('Failed to create study group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Study Group</DialogTitle>
            <DialogDescription>
              Create a group to study and collaborate with others who share your interests.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your study group"
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                Subject/Topic
              </label>
              <Select
                value={topic}
                onValueChange={setTopic}
                required
              >
                <SelectTrigger id="topic" className="w-full">
                  <SelectValue placeholder="Select a subject or topic" />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStudyGroupModal;
