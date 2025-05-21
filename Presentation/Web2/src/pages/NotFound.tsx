import React from 'react';
import { IonButton } from '@ionic/react';
import Layout from '../components/Layout';

const NotFound: React.FC = () => (
  <Layout title="404 Not Found">
    <p>The page you are looking for does not exist.</p>
    <IonButton routerLink="/home">Go to Home</IonButton>
  </Layout>
);

export default NotFound;
