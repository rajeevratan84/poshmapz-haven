
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  suggestions?: string[];
  onWizardToggle: (show: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isSearching, 
  suggestions = [],
  onWizardToggle
}) => {
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    onSearch(searchText);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Describe your ideal area in London..."
              className="w-full bg-white text-black h-12 pl-10 pr-4 rounded-xl shadow-md focus:ring-2 focus:ring-purple-600 transition-all placeholder:text-gray-500"
              disabled={isSearching}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm border-b border-gray-100 last:border-none"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => onWizardToggle(true)}
              variant="outline"
              className="hidden md:flex items-center gap-1 text-sm text-purple-600 border-purple-300 hover:bg-purple-50 h-12"
            >
              <Wand2 className="h-4 w-4" />
              <span>Use Wizard</span>
            </Button>
            
            <Button
              type="submit"
              disabled={isSearching || !searchText.trim()}
              variant="highlight"
              className="w-full md:w-auto h-12 px-6"
            >
              {isSearching ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Find Areas</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="mt-3 flex gap-2 justify-center md:justify-start flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20"
          onClick={() => onWizardToggle(true)}
        >
          <Wand2 className="h-3 w-3 mr-1" />
          Switch to Text Mode
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
