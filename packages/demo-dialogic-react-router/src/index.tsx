import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Can't use StrictMode here because in dev mode the dialog will receive an extra unmount, leading to a hidden dialog
  <App />,
);
