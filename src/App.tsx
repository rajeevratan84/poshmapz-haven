
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Demo from './pages/Demo';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Maps from './pages/Maps';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
import { Toaster } from 'sonner';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-black dark:bg-black light:bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-posh-green"></div>
    </div>;
  }
  
  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/demo" element={
          <ProtectedRoute>
            <Demo />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
