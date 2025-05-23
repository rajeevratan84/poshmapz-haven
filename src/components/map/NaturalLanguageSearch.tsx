
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ 
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your ideal area..."
          className="pl-9 pr-24 py-6 text-sm md:text-base"
        />
        <Button 
          type="submit" 
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default NaturalLanguageSearch;
