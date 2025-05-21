import React from 'react';
import { IonApp, IonSplitPane, IonRouterOutlet } from '@ionic/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import routes from './config/routes';
import Menu from './components/Menu';
import PrivateRoute from './utils/PrivateRoute';

const RouteChangeLogger: React.FC = () => {
  const location = useLocation();
  React.useEffect(() => {
    console.log(`Route changed to ${location.pathname}`);
  }, [location]);
  return null;
};

const App: React.FC = () => (
  <IonApp>
    <Router>
      <RouteChangeLogger />
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Routes>
            {/* Redirect root to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            {/* Define routes from config, wrapping protected ones */}
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.isAuth ? (
                    <PrivateRoute>
                      <route.component />
                    </PrivateRoute>
                  ) : (
                    <route.component />
                  )
                }
              />
            ))}
          </Routes>
        </IonRouterOutlet>
      </IonSplitPane>
    </Router>
  </IonApp>
);

export default App;
