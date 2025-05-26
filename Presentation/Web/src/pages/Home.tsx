// src/pages/Home.tsx
import React from 'react';
import { IonText } from '@ionic/react';
import Layout from '../components/Layout';

const Home: React.FC = () => (
  <Layout title="Home">
    <IonText>
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page of our application.</p>
    </IonText>
  </Layout>
);

export default Home;
