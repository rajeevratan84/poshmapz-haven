
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center max-w-md px-4">
        <div className="mb-8 flex justify-center">
          <div className={`p-4 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <MapPin className="h-12 w-12 text-coral" />
          </div>
        </div>
        <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>404</h1>
        <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Sorry, we couldn't find this location on our map
        </p>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        <div className="mt-12">
          <Link 
            to="/postcode" 
            className={`flex items-center justify-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <MapPin className="h-4 w-4" /> 
            Check a postcode instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
