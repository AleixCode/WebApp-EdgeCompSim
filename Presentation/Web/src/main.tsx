import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Use react-dom/client for React 18+
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { setupIonicReact } from '@ionic/react';

/* >>> IONIC CSS <<< */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional utilities that Ionic components rely on */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Initialize Ionic React
setupIonicReact();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider> {/* Provides auth state to the app */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
