/**
 * @file main.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Application entry point that mounts the React app to the DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
