
import React, { createContext, useContext, useState } from 'react';

interface Tool {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: string;
  category: 'calculator' | 'reference' | 'practice' | 'organization';
}

interface ToolsContextType {
  tools: Tool[];
  getToolsByCategory: (category: Tool['category']) => Tool[];
}

// Mock data
const mockTools: Tool[] = [
  {
    id: '1',
    title: 'Physics Formula Sheet',
    description: 'Comprehensive list of all formulas needed for JEE Physics',
    link: '#',
    icon: 'book-open',
    category: 'reference'
  },
  {
    id: '2',
    title: 'Chemistry Periodic Table',
    description: 'Interactive periodic table with element properties',
    link: '#',
    icon: 'layout-grid',
    category: 'reference'
  },
  {
    id: '3',
    title: 'Biology Diagram Bank',
    description: 'Collection of important diagrams for NEET Biology',
    link: '#',
    icon: 'activity',
    category: 'reference'
  },
  {
    id: '4',
    title: 'Scientific Calculator',
    description: 'Advanced calculator for complex mathematical operations',
    link: '#',
    icon: 'calculator',
    category: 'calculator'
  },
  {
    id: '5',
    title: 'Mock Test Generator',
    description: 'Create custom mock tests based on your preferences',
    link: '#',
    icon: 'file-text',
    category: 'practice'
  },
  {
    id: '6',
    title: 'Study Planner',
    description: 'Plan your study schedule efficiently',
    link: '#',
    icon: 'calendar',
    category: 'organization'
  },
  {
    id: '7',
    title: 'Flashcard Maker',
    description: 'Create and study with digital flashcards',
    link: '#',
    icon: 'layers',
    category: 'organization'
  },
  {
    id: '8',
    title: 'Problem Solver',
    description: 'Step-by-step solutions for complex problems',
    link: '#',
    icon: 'lightbulb',
    category: 'practice'
  }
];

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tools] = useState<Tool[]>(mockTools);

  const getToolsByCategory = (category: Tool['category']) => {
    return tools.filter(tool => tool.category === category);
  };

  return (
    <ToolsContext.Provider value={{ tools, getToolsByCategory }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};
