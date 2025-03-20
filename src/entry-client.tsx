
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Ensure the DOM is loaded
const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found!');
} else {
  hydrateRoot(
    root,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
