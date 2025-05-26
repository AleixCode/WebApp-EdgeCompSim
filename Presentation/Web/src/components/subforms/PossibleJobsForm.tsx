import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';

import { Job } from '../CreateSimulation';

interface PossibleJobsFormProps {
  items: Job[];
  onAdd: (job: Job) => void;
}

export default function PossibleJobsForm({ items, onAdd }: PossibleJobsFormProps) {
  const [job, setJob] = useState<Job>({ cpu: 0, mem: 0, hdd: 0, probability: 0 });

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
          onIonChange={(event) => setJob({ ...job, cpu: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Memory</IonLabel>
        <IonInput
          type="number"
          value={job.mem}
          onIonChange={(event) => setJob({ ...job, mem: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">HDD</IonLabel>
        <IonInput
          type="number"
          value={job.hdd}
          onIonChange={(event) => setJob({ ...job, hdd: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Probability</IonLabel>
        <IonInput
          type="number"
          value={job.probability}
          onIonChange={(event) => setJob({ ...job, probability: Number(event.detail.value) })}
        />
      </IonItem>

      <IonButton expand="full" onClick={() => onAdd(job)}>
        Add Job
      </IonButton>

      <IonList>
        {items.map((j, i) => (
          <IonItem key={i}>
            <IonLabel>{`CPU: ${j.cpu}, MEM: ${j.mem}, HDD: ${j.hdd}, Prob: ${j.probability}`}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonList>
  );
}
