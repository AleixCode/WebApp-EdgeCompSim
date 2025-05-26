import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonTabBar, IonTabButton, IonLabel, IonTabs, IonContent } from '@ionic/react';

import GeneralForm from './subforms/GeneralForm';
import PossibleJobsForm from './subforms/PossibleJobsForm';
import JobDistributionsForm from './subforms/JobDistributionsForm';
import ServersForm from './subforms/ServersForm';

// Shared data interfaces
export interface Job {
  cpu: number;
  mem: number;
  hdd: number;
  probability: number;
}
export interface JobDistribution {
  initial_time: number;
  final_time: number;
  probability: number;
}
export interface Server {
  cpu: number;
  mem: number;
  hdd: number;
  availability: string;
}
export interface SimulationData {
  name: string;
  time: number;
  exec_time: number;
  seed_users?: number;
  seed_servers?: number;
  type_exec: number;
  type_placement: number;
}

interface CreateSimulationProps {
  onCreate: (data: {
    formData: SimulationData;
    possibleJobs: Job[];
    jobDistributions: JobDistribution[];
    servers: Server[];
  }) => void;
}

export default function CreateSimulation({ onCreate }: CreateSimulationProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState<SimulationData>({
    name: '',
    time: 0,
    exec_time: 0,
    seed_users: 0,
    seed_servers: 0,
    type_exec: 0,
    type_placement: 0,
  });
  const [possibleJobs, setPossibleJobs] = useState<Job[]>([]);
  const [jobDistributions, setJobDistributions] = useState<JobDistribution[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFormChange = <K extends keyof SimulationData>(
    field: K,
    value: SimulationData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const triggerCreate = () => {
    if (formData.name !== '' && formData.time > 0 && formData.exec_time > 0) {
      onCreate({ formData, possibleJobs, jobDistributions, servers });
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Create Simulation</IonCardTitle>
      </IonCardHeader>

      <IonTabs>
        <IonTabBar slot="top">
          <IonTabButton tab="general" onClick={() => setTabIndex(0)}>
            <IonLabel>General</IonLabel>
          </IonTabButton>
          <IonTabButton tab="jobs" onClick={() => setTabIndex(1)}>
            <IonLabel>Possible Jobs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="distributions" onClick={() => setTabIndex(2)}>
            <IonLabel>Distributions</IonLabel>
          </IonTabButton>
          <IonTabButton tab="servers" onClick={() => setTabIndex(3)}>
            <IonLabel>Servers</IonLabel>
          </IonTabButton>
        </IonTabBar>

        <IonContent>
          {tabIndex === 0 && <GeneralForm formData={formData} onChange={handleFormChange} />}
          {tabIndex === 1 && <PossibleJobsForm items={possibleJobs} onAdd={item => setPossibleJobs([...possibleJobs, item])} />}
          {tabIndex === 2 && <JobDistributionsForm items={jobDistributions} onAdd={item => setJobDistributions([...jobDistributions, item])} />}
          {tabIndex === 3 && <ServersForm items={servers} onAdd={item => setServers([...servers, item])} />}
        </IonContent>
      </IonTabs>

      <IonCardContent>
        <IonButton expand="full" onClick={triggerCreate} disabled={!formData.name}>
          Create Simulation
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
}
