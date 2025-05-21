// src/components/CreateSimulation.tsx
import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonToolbar,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';

import GeneralForm from './subforms/GeneralForm';
import PossibleJobsForm from './subforms/PossibleJobsForm';
import JobDistributionsForm from './subforms/JobDistributionsForm';
import ServersForm from './subforms/ServersForm';
import type {
  CreateSimulationPayload,
  SimulationData,
  Job,
  JobDistribution,
  Server
} from '../interfaces';

export interface CreateSimulationProps {
  onCreate: (data: {
    formData: SimulationData;
    possibleJobs: Job[];
    jobDistributions: JobDistribution[];
    servers: Server[];
  }) => void;
}

export default function CreateSimulation({ onCreate }: CreateSimulationProps) {
  const [tab, setTab] = useState<'general' | 'jobs' | 'dist' | 'servers'>('general');
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

  const handleFormChange = <K extends keyof SimulationData>(field: K, value: SimulationData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const triggerCreate = () => {
    if (formData.name && formData.time > 0 && formData.exec_time > 0) {
      onCreate({ formData, possibleJobs, jobDistributions, servers });
    }
  };

  const canSubmit =
    formData.name !== '' &&
    formData.time > 0 &&
    formData.exec_time > 0 &&
    possibleJobs.length > 0 &&
    jobDistributions.length > 0 &&
    servers.length > 0;

  return (
    <IonCard>
      <IonCardHeader>
        <IonToolbar>
          <IonCardTitle>Create Simulation</IonCardTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={tab}
            onIonChange={e => setTab(e.detail.value as any)}
            scrollable={true}
          >
            <IonSegmentButton value="general">
              <IonLabel>General</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jobs">
              <IonLabel>Possible Jobs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="dist">
              <IonLabel>Distributions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="servers">
              <IonLabel>Servers</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonCardHeader>

      <IonCardContent>
        {tab === 'general' && (
          <GeneralForm formData={formData} onChange={handleFormChange} />
        )}
        {tab === 'jobs' && (
          <PossibleJobsForm
            items={possibleJobs}
            onAdd={item => setPossibleJobs([...possibleJobs, item])}
          />
        )}
        {tab === 'dist' && (
          <JobDistributionsForm
            items={jobDistributions}
            onAdd={item => setJobDistributions([...jobDistributions, item])}
          />
        )}
        {tab === 'servers' && (
          <ServersForm
            items={servers}
            onAdd={item => setServers([...servers, item])}
          />
        )}

        <IonButton
          expand="block"
          style={{ marginTop: 24 }}
          onClick={() => onCreate({ formData, possibleJobs, jobDistributions, servers })}
          disabled={!canSubmit}
        >
          Save Simulation
        </IonButton>
        {!canSubmit && (
          <p style={{ color: 'red', marginTop: 8, fontSize: '0.9em' }}>
            All sections must be valid and contain at least one entry before you can save.
          </p>
        )}
      </IonCardContent>
    </IonCard>
  );
}