
// Fixing the issue in the component
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { joinStudyGroup, getGroupMembers, UserProfile } from '@/services/communityService';
import { toast } from 'sonner';

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  created_by: string;
  created_at: string;
  members_count?: number;
  is_joined?: boolean;
  last_active?: string;
}

interface StudyGroupCardProps {
  group: StudyGroup;
  onGroupUpdated?: () => void;
}

const StudyGroupCard = ({ group, onGroupUpdated }: StudyGroupCardProps) => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    setJoining(true);
    try {
      const result = await joinStudyGroup(group.id);
      if (result?.action === 'joined') {
        toast.success('You joined the study group!');
      } else if (result?.action === 'left') {
        toast.success('You left the study group');
      }
      if (onGroupUpdated) onGroupUpdated();
    } catch (error) {
      toast.error('Failed to update group membership');
    } finally {
      setJoining(false);
    }
  };

  const loadMembers = async () => {
    if (!showMembers) {
      setLoading(true);
      try {
        const data = await getGroupMembers(group.id);
        if (Array.isArray(data)) {
          setMembers(data);
        }
      } catch (error) {
        toast.error('Failed to load group members');
      } finally {
        setLoading(false);
      }
    }
    setShowMembers(!showMembers);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Topic: {group.topic}</p>
          <Badge variant="secondary">
            {group.members_count || 0} Members
          </Badge>
          {group.last_active && (
            <p className="text-xs text-muted-foreground">
              Last active {group.last_active}
            </p>
          )}
          {showMembers && (
            <div className="mt-4">
              <h4 className="text-sm font-medium">Members:</h4>
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : members.length > 0 ? (
                <ul className="list-disc list-inside text-xs">
                  {members.map((member) => (
                    <li key={member.id}>{member.full_name || member.username || 'Unknown'}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No members loaded.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={loadMembers} disabled={loading}>
          {showMembers ? 'Hide Members' : 'Show Members'}
        </Button>
        <Button size="sm" onClick={handleJoinGroup} disabled={joining}>
          {joining ? 'Joining...' : group.is_joined ? 'Leave Group' : 'Join Group'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;
