
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
      <Toggle 
        variant="outline"
        size="sm"
        pressed={isDark}
        onPressedChange={toggleTheme}
        aria-label="Toggle theme"
        className={`
          p-2 rounded-full 
          ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}
          transition-colors
        `}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
