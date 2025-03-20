import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Demo from './pages/Demo';
import NotFound from './pages/NotFound';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
