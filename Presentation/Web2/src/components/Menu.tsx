import React from 'react';
import { IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonLabel } from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import routes from '../config/routes';

const Menu: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList>
          <IonListHeader>Menu</IonListHeader>
          {routes.filter(r => r.isNav).map(r => (
            <IonMenuToggle key={r.path} autoHide={false}>
              <IonItem button onClick={() => navigate(r.path)}>
                <IonLabel>{r.name}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
          {auth.isAuthenticated && (
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={(e) => { e.preventDefault(); auth.logout(); navigate('/login'); }}>
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
