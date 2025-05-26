// src/components/Nav.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import routes from '../config/routes';

import {
  IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle
} from '@ionic/react';

import {
  homeOutline, mailOutline, personCircle, logInOutline, logOutOutline
} from 'ionicons/icons';

// Map route names to icons for visual polish
const iconMap: { [key: string]: string } = {
  Home: homeOutline,
  Contact: mailOutline,
  Profile: personCircle,
};

const Nav: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <IonMenu contentId="main-content">  {/* Tied to IonSplitPane and IonRouterOutlet below */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {routes
            .filter(r => r.isNav && (!r.isAuth || isAuthenticated))
            .map(r => (
              <IonMenuToggle key={r.path} autoHide={false}>
                <IonItem routerLink={r.path} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={iconMap[r.name] || homeOutline} />
                  <IonLabel>{r.name}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          {!isAuthenticated ? (
            <IonMenuToggle autoHide={false}>
              <IonItem routerLink="/login" routerDirection="none" lines="none" detail={false}>
                <IonIcon slot="start" icon={logInOutline} />
                <IonLabel>Login</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ) : (
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={logout} lines="none" detail={false}>
                <IonIcon slot="start" icon={logOutOutline} />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Nav;
