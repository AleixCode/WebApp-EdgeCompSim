// src/pages/NotFound.tsx
import React from 'react';
import { IonText } from '@ionic/react';
import Layout from '../components/Layout';

const NotFound: React.FC = () => (
  <Layout title="Not Found">
    <IonText>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </IonText>
  </Layout>
);

export default NotFound;
