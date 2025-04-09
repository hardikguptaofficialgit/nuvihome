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

// JEE-focused tools only
const jeeTools: Tool[] = [
  {
    id: '1',
    title: 'Physics Formula Sheet',
    description: 'All important JEE Physics formulas in one place',
    link: '#',
    icon: 'book-open',
    category: 'reference'
  },
  {
    id: '2',
    title: 'Chemistry Periodic Table',
    description: 'Interactive periodic table with quick lookup for JEE Chemistry',
    link: '#',
    icon: 'layout-grid',
    category: 'reference'
  },
  {
    id: '3',
    title: 'Scientific Calculator',
    description: 'Non-programmable calculator simulator for JEE practice',
    link: '#',
    icon: 'calculator',
    category: 'calculator'
  },
  {
    id: '4',
    title: 'Mock Test Generator',
    description: 'Create custom mock tests for JEE Main & Advanced',
    link: '#',
    icon: 'file-text',
    category: 'practice'
  },
  {
    id: '5',
    title: 'Study Planner',
    description: 'Generate personalized study timetables for JEE prep',
    link: '#',
    icon: 'calendar',
    category: 'organization'
  },
  {
    id: '6',
    title: 'Flashcard Maker',
    description: 'Make revision flashcards for Physics, Chemistry & Math',
    link: '#',
    icon: 'layers',
    category: 'organization'
  },
  {
    id: '7',
    title: 'Problem Solver',
    description: 'Step-by-step problem-solving guide for JEE questions',
    link: '#',
    icon: 'lightbulb',
    category: 'practice'
  }
];

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tools] = useState<Tool[]>(jeeTools);

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
