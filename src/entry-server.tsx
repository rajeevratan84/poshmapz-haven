
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, context: any) {
  return renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
}
