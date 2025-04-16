
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AreaMatch } from '@/types/area';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface SearchHistory {
  id: string;
  timestamp: string;
  query: string;
  source: 'postcode' | 'ai-search';
  results: AreaMatch[];
}

interface CompareItem {
  areaId: string;
  area: AreaMatch;
}

interface SavedResultsContextType {
  savedAreas: AreaMatch[];
  searchHistory: SearchHistory[];
  compareItems: CompareItem[];
  saveArea: (area: AreaMatch, source: 'postcode' | 'ai-search') => void;
  removeArea: (areaId: string) => void;
  isSaved: (areaName: string) => boolean;
  saveSearchToHistory: (query: string, results: AreaMatch[], source: 'postcode' | 'ai-search') => void;
  removeSearchFromHistory: (searchId: string) => void;
  clearSearchHistory: () => void;
  addToCompare: (area: AreaMatch) => void;
  removeFromCompare: (areaId: string) => void;
  clearCompare: () => void;
  isInCompare: (areaId?: string) => boolean;
}

const SavedResultsContext = createContext<SavedResultsContextType | undefined>(undefined);

export const SavedResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedAreas, setSavedAreas] = useState<AreaMatch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const loadFromStorage = (key: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
      const dataFromStorage = localStorage.getItem(key);
      if (dataFromStorage) {
        try {
          const parsedData = JSON.parse(dataFromStorage);
          setter(parsedData);
        } catch (error) {
          console.error(`Error parsing ${key}:`, error);
          localStorage.removeItem(key);
        }
      }
    };

    loadFromStorage('savedAreas', setSavedAreas);
    loadFromStorage('searchHistory', setSearchHistory);
    loadFromStorage('compareItems', setCompareItems);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (savedAreas.length > 0) {
      localStorage.setItem('savedAreas', JSON.stringify(savedAreas));
    } else {
      localStorage.removeItem('savedAreas');
    }
  }, [savedAreas]);

  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } else {
      localStorage.removeItem('searchHistory');
    }
  }, [searchHistory]);

  useEffect(() => {
    if (compareItems.length > 0) {
      localStorage.setItem('compareItems', JSON.stringify(compareItems));
    } else {
      localStorage.removeItem('compareItems');
    }
  }, [compareItems]);

  const saveArea = (area: AreaMatch, source: 'postcode' | 'ai-search') => {
    // Make sure we're working with a copy to avoid reference issues
    const areaCopy = { ...area };
    
    // Add additional information for saved area
    areaCopy.savedAt = new Date().toISOString();
    areaCopy.savedFrom = source;
    areaCopy.id = uuidv4(); // Generate a unique ID for this saved area
    
    setSavedAreas(prev => {
      // Check if we already have this area saved
      const isDuplicate = prev.some(savedArea => savedArea.name === area.name);
      
      if (isDuplicate) {
        toast.info(`${area.name} is already in your saved areas`);
        return prev;
      }
      
      toast.success(`Added ${area.name} to your saved areas`);
      return [...prev, areaCopy];
    });
  };

  const removeArea = (areaId: string) => {
    setSavedAreas(prev => {
      const areaToRemove = prev.find(area => area.id === areaId);
      const filteredAreas = prev.filter(area => area.id !== areaId);
      
      if (areaToRemove) {
        toast.success(`Removed ${areaToRemove.name} from your saved areas`);
        
        // If we've removed all areas, clear localStorage
        if (filteredAreas.length === 0) {
          localStorage.removeItem('savedAreas');
        }
      }
      
      return filteredAreas;
    });
    
    // Also remove from comparison if it's there
    removeFromCompare(areaId);
  };

  const isSaved = (areaName: string) => {
    return savedAreas.some(area => area.name === areaName);
  };

  // Search history functions
  const saveSearchToHistory = (query: string, results: AreaMatch[], source: 'postcode' | 'ai-search') => {
    // Create a new search history entry
    const newSearch: SearchHistory = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      query,
      source,
      results
    };

    setSearchHistory(prev => {
      // Limit history to last 20 searches
      const updatedHistory = [newSearch, ...prev].slice(0, 20);
      return updatedHistory;
    });
  };

  const removeSearchFromHistory = (searchId: string) => {
    setSearchHistory(prev => {
      const filteredHistory = prev.filter(search => search.id !== searchId);
      
      if (filteredHistory.length === 0) {
        localStorage.removeItem('searchHistory');
      }
      
      return filteredHistory;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    toast.success('Search history cleared');
  };

  // Comparison functions
  const addToCompare = (area: AreaMatch) => {
    if (!area.id) {
      // Generate an ID if it doesn't have one
      area = { ...area, id: uuidv4() };
    }

    setCompareItems(prev => {
      // Check if we already have this area in comparison
      const isAlreadyInCompare = prev.some(item => item.areaId === area.id);
      
      if (isAlreadyInCompare) {
        toast.info(`${area.name} is already in your comparison`);
        return prev;
      }
      
      // Limit to 3 items for comparison
      if (prev.length >= 3) {
        toast.info('You can compare up to 3 areas. Please remove one before adding another.');
        return prev;
      }
      
      toast.success(`Added ${area.name} to comparison`);
      return [...prev, { areaId: area.id, area }];
    });
  };

  const removeFromCompare = (areaId: string) => {
    setCompareItems(prev => {
      const itemToRemove = prev.find(item => item.areaId === areaId);
      
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.area.name} from comparison`);
      }
      
      return prev.filter(item => item.areaId !== areaId);
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem('compareItems');
    toast.success('Comparison cleared');
  };

  const isInCompare = (areaId?: string) => {
    if (!areaId) return false;
    return compareItems.some(item => item.areaId === areaId);
  };

  return (
    <SavedResultsContext.Provider value={{
      savedAreas,
      searchHistory,
      compareItems,
      saveArea,
      removeArea,
      isSaved,
      saveSearchToHistory,
      removeSearchFromHistory,
      clearSearchHistory,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </SavedResultsContext.Provider>
  );
};

export const useSavedResults = () => {
  const context = useContext(SavedResultsContext);
  if (context === undefined) {
    throw new Error('useSavedResults must be used within a SavedResultsProvider');
  }
  return context;
};
