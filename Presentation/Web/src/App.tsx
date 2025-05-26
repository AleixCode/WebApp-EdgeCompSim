// src/App.tsx
import React from 'react';
import { IonApp, IonSplitPane, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Nav from './components/Nav';
import routes from './config/routes';
import NotFoundPage from './pages/NotFound';
import PrivateRoute from './utils/PrivateRoute';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>  {/* Sets up Ionic React routing */}
      <IonSplitPane contentId="main-content">
        <Nav />  {/* Side menu */}

        <IonRouterOutlet id="main-content">
  {routes.map(route =>
    route.isAuth ? (
      <PrivateRoute
        key={route.path}
        exact
        path={route.path}
        component={route.component}    // ← here
      />
    ) : (
      <Route
        key={route.path}
        exact
        path={route.path}
        component={route.component}    // ← and here
      />
    )
  )}
  {/* 404 fallback */}
  <Route path="*" component={NotFoundPage} />
</IonRouterOutlet>


      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default App;

