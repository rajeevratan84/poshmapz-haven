
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSavedResults } from '@/context/SavedResultsContext';
import { Button } from '@/components/ui/button';
import { 
  History, Search, X, Trash2, ArrowRightLeft, Plus, 
  Info, MapPin, Star, Filter
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import AreaComparisonTable from '@/components/comparison/AreaComparisonTable';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MySearches = () => {
  const navigate = useNavigate();
  const { 
    searchHistory, 
    removeSearchFromHistory, 
    clearSearchHistory,
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare
  } = useSavedResults();
  const [activeView, setActiveView] = useState<'history' | 'compare'>('history');

  const handleAddToCompare = (areaId: string, searchId: string) => {
    const search = searchHistory.find(s => s.id === searchId);
    if (!search) return;
    
    const area = search.results.find(a => a.id === areaId);
    if (!area) return;
    
    addToCompare(area);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              {activeView === 'history' ? (
                <History className="h-8 w-8 text-primary" />
              ) : (
                <ArrowRightLeft className="h-8 w-8 text-primary" />
              )}
              <span>{activeView === 'history' ? 'My Searches' : 'Area Comparison'}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeView === 'history' 
                ? 'View your search history and compare areas'
                : 'Compare different areas side by side'
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={activeView === 'history' ? "default" : "outline"}
              onClick={() => setActiveView('history')}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span>Search History</span>
            </Button>
            <Button 
              variant={activeView === 'compare' ? "default" : "outline"}
              onClick={() => setActiveView('compare')}
              className="flex items-center gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Compare Areas</span>
              {compareItems.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {compareItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search History View */}
        {activeView === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Searches</h2>
              {searchHistory.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSearchHistory}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              )}
            </div>
            
            {searchHistory.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No search history yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  When you search for areas using our tools, your searches will be saved here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/demo')} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>AI Neighborhood Search</span>
                  </Button>
                  <Button onClick={() => navigate('/postcode')} variant="outline" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Postcode Search</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {searchHistory.map((search) => (
                  <Card key={search.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Search className="h-5 w-5 text-primary" />
                            <span>"{search.query}"</span>
                            <Badge variant="outline" className="ml-2">
                              {search.source === 'postcode' ? 'Postcode Search' : 'AI Search'}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {search.timestamp && formatDistanceToNow(new Date(search.timestamp), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSearchFromHistory(search.id)}
                          className="text-muted-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3 font-medium">Results ({search.results.length}):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {search.results.slice(0, 3).map((area) => (
                          <div 
                            key={area.id || area.name} 
                            className="bg-muted/20 p-3 rounded-lg border relative group"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{area.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-0">
                                    {area.matchPercentage}% Match
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                    <span className="text-xs">{area.poshScore}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleAddToCompare(area.id || '', search.id)}
                                    disabled={isInCompare(area.id) || compareItems.length >= 3}
                                  >
                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                    <span>Add to Compare</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/${search.source === 'postcode' ? 'postcode' : 'demo'}?area=${area.name}`)}>
                                    <Info className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{area.description}</p>
                          </div>
                        ))}
                        {search.results.length > 3 && (
                          <div className="bg-muted/10 p-3 rounded-lg border border-dashed flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">+{search.results.length - 3} more areas</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const path = search.source === 'postcode' ? '/postcode' : '/demo';
                          navigate(`${path}?query=${encodeURIComponent(search.query)}`);
                        }}
                        className="text-primary"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Again
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Compare View */}
        {activeView === 'compare' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold mr-2">Area Comparison</h2>
                <Badge variant="outline">{compareItems.length}/3</Badge>
              </div>
              {compareItems.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCompare}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            
            {compareItems.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                <ArrowRightLeft className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No areas to compare</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add up to 3 areas from your search history to compare them side by side.
                </p>
                {searchHistory.length > 0 ? (
                  <Button onClick={() => setActiveView('history')} className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Go to Search History</span>
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/demo')} className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span>AI Neighborhood Search</span>
                    </Button>
                    <Button onClick={() => navigate('/postcode')} variant="outline" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Postcode Search</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 overflow-x-auto">
                  <AreaComparisonTable 
                    areas={compareItems.map(item => item.area)} 
                    onRemove={(areaId) => removeFromCompare(areaId || '')}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MySearches;
