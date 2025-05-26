// src/components/subforms/PossibleJobsForm.tsx
import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonListHeader,
  IonText
} from '@ionic/react';
import { Job } from '../../interfaces';

interface Props {
  items: Job[];
  onAdd: (job: Job) => void;
}

export default function PossibleJobsForm({ items, onAdd }: Props) {
  const [job, setJob] = useState<Job>({ cpu: 0, mem: 0, hdd: 0, probability: 0 });
  const [error, setError] = useState('');

  const validate = () => {
    if (job.cpu <= 0 || job.mem <= 0 || job.hdd <= 0) return 'CPU, Memory, and HDD must be > 0';
    if (job.probability <= 0 || job.probability > 1) return 'Probability must be between 0 and 1';
    return '';
  };

  const handleAdd = () => {
    const err = validate();
    if (err) {
      setError(err);
    } else {
      onAdd(job);
      setJob({ cpu: 0, mem: 0, hdd: 0, probability: 0 });
      setError('');
    }
  };

  const isValid = validate() === '';

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Add Possible Job</IonLabel>
      </IonListHeader>

      <IonItem>
        <IonLabel position="stacked">CPU</IonLabel>
        <IonInput
          type="number"
          value={job.cpu}
          onIonChange={e => setJob({ ...job, cpu: Number(e.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Memory</IonLabel>
        <IonInput
          type="number"
          value={job.mem}
          onIonChange={e => setJob({ ...job, mem: Number(e.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">HDD</IonLabel>
        <IonInput
          type="number"
          value={job.hdd}
          onIonChange={e => setJob({ ...job, hdd: Number(e.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Probability (0–1)</IonLabel>
        <IonInput
          type="number"
          value={job.probability}
          onIonChange={e => setJob({ ...job, probability: Number(e.detail.value) })}
        />
      </IonItem>

      {error && (
        <IonText color="danger">
          <p style={{ margin: 8 }}>{error}</p>
        </IonText>
      )}

      <IonButton expand="full" onClick={handleAdd} disabled={!isValid}>
        Add Job
      </IonButton>

      {items.map((j, i) => (
        <IonItem key={i}>
          <IonLabel>
            {`CPU: ${j.cpu}, MEM: ${j.mem}, HDD: ${j.hdd}, Prob: ${j.probability}`}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
