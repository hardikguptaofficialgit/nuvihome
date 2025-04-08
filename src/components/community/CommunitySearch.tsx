
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { getAvailableTags } from '@/services/communityService';

interface CommunitySearchProps {
  onSearchChange: (query: string) => void;
  onTagFilterChange: (tag: string | null) => void;
  onTypeFilterChange: (type: string | null) => void;
}

const CommunitySearch: React.FC<CommunitySearchProps> = ({
  onSearchChange,
  onTagFilterChange,
  onTypeFilterChange,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Fetch available tags
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
    
    fetchTags();
  }, []);
  
  const handleSearch = () => {
    onSearchChange(query);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleTagClick = (tag: string) => {
    const newTag = activeFilter === tag ? null : tag;
    setActiveFilter(newTag);
    onTagFilterChange(newTag);
  };
  
  const handleTypeClick = (type: string) => {
    const newType = activeType === type ? null : type;
    setActiveType(newType);
    onTypeFilterChange(newType);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search discussions, study groups, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          {query && (
            <button 
              className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery('');
                onSearchChange('');
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`cursor-pointer ${activeType === 'discussions' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleTypeClick('discussions')}>
          Discussions
        </Badge>
        <Badge variant="outline" className={`cursor-pointer ${activeType === 'studyGroups' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleTypeClick('studyGroups')}>
          Study Groups
        </Badge>
        <Badge variant="outline" className={`cursor-pointer ${activeType === 'chatRooms' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleTypeClick('chatRooms')}>
          Chat Rooms
        </Badge>
        
        <div className="w-full h-0 border-t my-1" />
        
        {availableTags.map(tag => (
          <Badge 
            key={tag} 
            variant="outline" 
            className={`cursor-pointer ${activeFilter === tag ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CommunitySearch;
