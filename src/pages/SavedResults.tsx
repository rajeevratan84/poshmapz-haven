
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSavedResults } from '@/context/SavedResultsContext';
import SavedAreaCard from '@/components/SavedAreaCard';
import { Button } from '@/components/ui/button';
import { MapPin, Bookmark, Search, ArrowRightLeft, History } from 'lucide-react';

const SavedResults = () => {
  const { savedAreas, compareItems } = useSavedResults();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Bookmark className="h-7 w-7 text-primary" />
              <span>Your Saved Areas</span>
            </h1>
            <p className="text-muted-foreground mt-2">Compare your saved neighborhoods and make an informed decision.</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/searches')} className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>My Searches</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/postcode')} className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Postcode Search</span>
            </Button>
            <Button onClick={() => navigate('/demo')} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>AI Search</span>
            </Button>
          </div>
        </div>
        
        {compareItems.length > 0 && (
          <div className="mb-8">
            <Button 
              variant="outline" 
              className="mb-4 bg-primary/10 text-primary"
              onClick={() => navigate('/searches?view=compare')}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              View {compareItems.length} Areas in Comparison
            </Button>
          </div>
        )}
        
        {savedAreas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedAreas.map((area) => (
              <SavedAreaCard key={area.id} area={area} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No saved areas yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Use our AI Neighborhood finder or Postcode Search tools to discover and save areas you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/demo')} variant="default" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Try AI Search</span>
              </Button>
              <Button onClick={() => navigate('/postcode')} variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Check a Postcode</span>
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedResults;
