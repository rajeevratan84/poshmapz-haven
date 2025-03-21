
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Ensure the DOM is fully loaded before hydration
const main = () => {
  const root = document.getElementById('root');

  if (!root) {
    console.error('Root element not found!');
    return;
  }

  // Use hydrateRoot for client-side hydration of server-rendered content
  hydrateRoot(
    root,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

// Execute main function when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
