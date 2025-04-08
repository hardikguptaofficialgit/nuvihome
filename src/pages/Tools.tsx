
import React, { useState } from 'react';
import { useTools } from '@/contexts/ToolsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, Layers, FileText, LayoutGrid, Activity, Lightbulb, Calendar } from 'lucide-react';

type ToolCategory = 'all' | 'calculator' | 'reference' | 'practice' | 'organization';

const iconMap = {
  'book-open': <BookOpen className="h-6 w-6" />,
  'layout-grid': <LayoutGrid className="h-6 w-6" />,
  'activity': <Activity className="h-6 w-6" />,
  'calculator': <Calculator className="h-6 w-6" />,
  'file-text': <FileText className="h-6 w-6" />,
  'layers': <Layers className="h-6 w-6" />,
  'lightbulb': <Lightbulb className="h-6 w-6" />,
  'calendar': <Calendar className="h-6 w-6" />,
};

const Tools = () => {
  const { tools } = useTools();
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  
  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">
            Study <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Tools</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our collection of educational tools and resources to enhance your learning experience.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8 animate-fade-in">
          <div className="flex justify-center">
            <TabsList className="bg-secondary/50">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveCategory('all')}
                className={activeCategory === 'all' ? 'bg-accent text-accent-foreground' : ''}
              >
                All Tools
              </TabsTrigger>
              <TabsTrigger 
                value="reference" 
                onClick={() => setActiveCategory('reference')}
                className={activeCategory === 'reference' ? 'bg-accent text-accent-foreground' : ''}
              >
                Reference
              </TabsTrigger>
              <TabsTrigger 
                value="calculator" 
                onClick={() => setActiveCategory('calculator')}
                className={activeCategory === 'calculator' ? 'bg-accent text-accent-foreground' : ''}
              >
                Calculators
              </TabsTrigger>
              <TabsTrigger 
                value="practice" 
                onClick={() => setActiveCategory('practice')}
                className={activeCategory === 'practice' ? 'bg-accent text-accent-foreground' : ''}
              >
                Practice
              </TabsTrigger>
              <TabsTrigger 
                value="organization" 
                onClick={() => setActiveCategory('organization')}
                className={activeCategory === 'organization' ? 'bg-accent text-accent-foreground' : ''}
              >
                Organization
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => (
                <Card 
                  key={tool.id} 
                  className="glass-card hover-scale animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col h-full">
                      <div className="bg-secondary/30 p-6 flex justify-between items-start">
                        <div className="bg-accent/20 p-3 rounded-lg">
                          {iconMap[tool.icon as keyof typeof iconMap] || <BookOpen className="h-6 w-6" />}
                        </div>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          {tool.category}
                        </Badge>
                      </div>
                      
                      <div className="p-6 flex-1">
                        <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                        <p className="text-muted-foreground mb-4">{tool.description}</p>
                        
                        <a href={tool.link} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            Access Tool
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
