
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SavedResultsProvider } from '@/context/SavedResultsContext';
import './App.css';

// Pages
import Index from '@/pages/Index';
import Maps from '@/pages/Maps';
import NotFound from '@/pages/NotFound';
import Demo from '@/pages/Demo';
import PostcodeSearch from '@/pages/PostcodeSearch';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import SavedResults from '@/pages/SavedResults';
import MySearches from '@/pages/MySearches';

// Loading screen for suspense fallback
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  const location = useLocation();

  // Scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedResultsProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/postcode" element={<PostcodeSearch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/saved" element={<SavedResults />} />
              <Route path="/searches" element={<MySearches />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </SavedResultsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
