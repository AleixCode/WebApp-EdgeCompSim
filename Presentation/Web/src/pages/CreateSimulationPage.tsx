import React from 'react';
import { useHistory } from 'react-router-dom';
import CreateSimulation, { SimulationData, Job, JobDistribution, Server } from '../components/CreateSimulation';
import { IonPage, IonContent, IonHeader, IonTitle } from '@ionic/react';

export default function CreateSimulationPage() {
  const history = useHistory();

  const handleCreate = async (data: {
    formData: SimulationData;
    possibleJobs: Job[];
    jobDistributions: JobDistribution[];
    servers: Server[];
  }) => {
    try {
      // Mock API call
      console.log('Submitting full form data:', data);

      // After successful submission
      history.push('/simulations');
    } catch (error) {
      console.error('Failed to create simulation:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>New Simulation Setup</IonTitle>
      </IonHeader>
      <IonContent className="ion-padding">
        <CreateSimulation onCreate={handleCreate} />
      </IonContent>
    </IonPage>
  );
}
