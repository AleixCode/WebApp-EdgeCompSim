// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import { IonPage, IonContent } from '@ionic/react';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => (
  <IonPage>
    <Header title={title} />
    <IonContent className="ion-padding">
      {children}
    </IonContent>
  </IonPage>
);

export default Layout;
