
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AreaMatch } from '@/types/area';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface SavedResultsContextType {
  savedAreas: AreaMatch[];
  saveArea: (area: AreaMatch, source: 'postcode' | 'ai-search') => void;
  removeArea: (areaId: string) => void;
  isSaved: (areaName: string) => boolean;
}

const SavedResultsContext = createContext<SavedResultsContextType | undefined>(undefined);

export const SavedResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedAreas, setSavedAreas] = useState<AreaMatch[]>([]);

  // Load saved areas from localStorage on mount
  useEffect(() => {
    const savedAreasFromStorage = localStorage.getItem('savedAreas');
    if (savedAreasFromStorage) {
      try {
        const parsedAreas = JSON.parse(savedAreasFromStorage);
        setSavedAreas(parsedAreas);
      } catch (error) {
        console.error('Error parsing saved areas:', error);
        localStorage.removeItem('savedAreas');
      }
    }
  }, []);

  // Save to localStorage whenever savedAreas changes
  useEffect(() => {
    if (savedAreas.length > 0) {
      localStorage.setItem('savedAreas', JSON.stringify(savedAreas));
    }
  }, [savedAreas]);

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
  };

  const isSaved = (areaName: string) => {
    return savedAreas.some(area => area.name === areaName);
  };

  return (
    <SavedResultsContext.Provider value={{ savedAreas, saveArea, removeArea, isSaved }}>
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
