
import React, { useState } from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  suggestions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching, suggestions }) => {
  const [userInput, setUserInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(userInput);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mb-6">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., I want to live near a tube station, park, and good pubs"
          className="flex-grow bg-white/10 text-white border-white/20 placeholder:text-white/40 h-12"
        />
        <Button 
          onClick={() => onSearch(userInput)}
          disabled={isSearching}
          variant="glow"
          size="lg"
          className="min-w-[120px] h-12"
        >
          {isSearching ? 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div> : 
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Find Areas</span>
            </div>
          }
        </Button>
      </div>
      
      <div className="text-white/70 mb-4 text-sm">
        <p className="mb-2">Try queries like:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full text-xs transition-colors"
              onClick={() => {
                setUserInput(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
