import React from "react";
import { useAuth } from "../contexts/AuthContext";
import routes from "../config/routes";

import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuToggle,
} from "@ionic/react";

import {
  homeOutline,
  mailOutline,
  personCircle,
  logInOutline,
  logOutOutline,
} from "ionicons/icons";

import "./Nav.css"; // Import our custom styles

// Map route names to icons for visual polish
const iconMap: { [key: string]: string } = {
  Home: homeOutline,
  Contact: mailOutline,
  Profile: personCircle,
};

const Nav: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <IonMenu contentId="main-content">
      <IonHeader className="nav-header">
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="nav-content">
        <IonList>
          {routes
            .filter(
              (r) =>
                (r.isNoAuthNav && !isAuthenticated) ||
                (r.isAuthNav && isAuthenticated)
            )
            .map((r) => (
              <IonMenuToggle key={r.path} autoHide={false}>
                <IonItem
                  routerLink={r.path}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                  className="nav-item"
                >
                  <IonIcon slot="start" icon={iconMap[r.name] || homeOutline} />
                  <IonLabel>{r.name}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          {isAuthenticated && (
            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                onClick={logout}
                lines="none"
                detail={false}
                className="nav-item"
              >
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
