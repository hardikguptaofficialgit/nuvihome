import React, { createContext, useContext, useState, ReactNode } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  uploader: string;
  downloadUrl: string;
  icon?: string;
};

type ResourceContextType = {
  resources: Resource[];
  addResource: (resource: Resource) => void;
};

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Physics Formula Sheet',
      description: 'A complete summary of important physics formulas for JEE & NEET.',
      tags: ['Physics', 'Formulas', 'JEE'],
      date: '2025-04-01',
      uploader: 'Team Nuvibrainz',
      downloadUrl: 'https://example.com/physics-formulas.pdf',
      icon: '/file-icon.svg',
    },
    {
      id: '2',
      title: 'Chemistry Formula Sheet',
      description: 'A complete summary of important chemistry formulas for JEE',
      tags: ['Chemistry', 'Formula', 'Notes'],
      date: '2025-03-28',
      uploader: 'Admin',
      downloadUrl: 'https://example.com/ncert-chemistry-notes.pdf',
    },
    {
      id: '3',
      title: 'Maths Formula Sheet',
      description: 'A complete summary of important math formulas for JEE',
      tags: ['Maths', 'Formula', 'Notes'],
      date: '2025-03-25',
      uploader: 'Nuvibrainz Team',
      downloadUrl: 'https://example.com/maths-practice.pdf',
      icon: '/file-icon.svg',
    }
  ]);

  const addResource = (resource: Resource) => {
    setResources((prev) => [resource, ...prev]);
  };

  return (
    <ResourceContext.Provider value={{ resources, addResource }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
