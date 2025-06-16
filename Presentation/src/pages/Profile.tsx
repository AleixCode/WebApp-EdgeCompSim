// src/pages/Profile.tsx
import React from 'react';
import { IonText } from '@ionic/react';
import Layout from '../components/Layout';

const Profile: React.FC = () => (
  <Layout title="Profile">
    <IonText>
      <h2>User Profile</h2>
      <p>This is a protected profile page. Only logged-in users can see this.</p>
    </IonText>
  </Layout>
);

export default Profile;
