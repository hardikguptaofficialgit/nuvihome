
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/services/communityService';

interface UserProfilePreviewProps {
  userId: string;
  profile?: UserProfile;
  children: React.ReactNode;
}

const UserProfilePreview: React.FC<UserProfilePreviewProps> = ({ userId, profile, children }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-secondary/70">
              {profile?.full_name?.[0] || profile?.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              {profile?.full_name || profile?.username || 'Anonymous'}
            </h4>
            <p className="text-sm text-muted-foreground">{profile?.role || 'Student'}</p>
            <div className="flex items-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => window.location.href = `/profile/${userId}`}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserProfilePreview;
