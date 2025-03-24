
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
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
          p-2 rounded-full transition-colors
          ${isDark 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-black/5 text-black hover:bg-black/10'
          }
        `}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
