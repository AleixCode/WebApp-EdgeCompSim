import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupIonicReact } from '@ionic/react';
import { AuthProvider } from './contexts/AuthContext';

// Ionic core CSS
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// Initialize Ionic React
setupIonicReact();

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
