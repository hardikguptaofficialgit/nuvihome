import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Stars } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full w-10 h-10 transition-all duration-300 relative overflow-hidden 
        ${theme === 'dark' 
          ? 'bg-secondary/70 hover:bg-secondary' 
          : 'bg-secondary/80 hover:bg-secondary/95'
        }`}
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${theme === 'dark' ? 'translate-y-0' : 'translate-y-full'}`}>
        <Sun className="h-5 w-5 text-yellow-300" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${theme === 'dark' ? 'translate-y-full' : 'translate-y-0'}`}>
        <Moon className="h-5 w-5 text-black" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;