import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';

import { JobDistribution } from '../CreateSimulation';

interface JobDistributionsFormProps {
  items: JobDistribution[];
  onAdd: (dist: JobDistribution) => void;
}

export default function JobDistributionsForm({ items, onAdd }: JobDistributionsFormProps) {
  const [dist, setDist] = useState<JobDistribution>({ initial_time: 0, final_time: 0, probability: 0 });

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Add Job Distribution</IonLabel>
      </IonListHeader>

      <IonItem>
        <IonLabel position="stacked">Initial Time</IonLabel>
        <IonInput
          type="number"
          value={dist.initial_time}
          onIonChange={(event) => setDist({ ...dist, initial_time: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Final Time</IonLabel>
        <IonInput
          type="number"
          value={dist.final_time}
          onIonChange={(event) => setDist({ ...dist, final_time: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Probability</IonLabel>
        <IonInput
          type="number"
          value={dist.probability}
          onIonChange={(event) => setDist({ ...dist, probability: Number(event.detail.value) })}
        />
      </IonItem>

      <IonButton expand="full" onClick={() => onAdd(dist)}>
        Add Distribution
      </IonButton>

      <IonList>
        {items.map((d, i) => (
          <IonItem key={i}>
            <IonLabel>{`[${d.initial_time}-${d.final_time}], Prob: ${d.probability}`}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonList>
  );
}
