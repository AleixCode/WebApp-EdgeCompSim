// src/pages/Contact.tsx
import React from 'react';
import { IonText } from '@ionic/react';
import Layout from '../components/Layout';

const Contact: React.FC = () => (
  <Layout title="Contact">
    <IonText>
      <h2>Contact Us</h2>
      <p>You can contact us at contact@example.com.</p>
    </IonText>
  </Layout>
);

export default Contact;
