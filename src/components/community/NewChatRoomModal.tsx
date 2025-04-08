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
import { Input } from '@/components/ui/input';
import { createChatRoom } from '@/services/communityService';
import { toast } from 'sonner';

interface NewChatRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated: () => void;
}

const NewChatRoomModal: React.FC<NewChatRoomModalProps> = ({ open, onOpenChange, onRoomCreated }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a room name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createChatRoom(name);
      if (result) {
        toast.success('Chat room created successfully!');
        setName('');
        onOpenChange(false);
        onRoomCreated();
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error('Failed to create chat room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Chat Room</DialogTitle>
            <DialogDescription>
              Create a chat room for real-time discussions with other community members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Room Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your chat room"
                className="w-full"
                required
              />
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
              {isSubmitting ? 'Creating...' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatRoomModal;
