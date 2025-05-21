import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

interface LayoutProps {
  title: string;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <div style={{ padding: '16px' }}>{children}</div>
    </IonContent>
  </IonPage>
);

export default Layout;
