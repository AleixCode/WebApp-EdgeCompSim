import React, { useState } from 'react';
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/react';
import type { JobDistribution } from '../../interfaces';

interface Props {
  items: JobDistribution[];
  onAdd: (dist: JobDistribution) => void;
}

export default function JobDistributionsForm({ items, onAdd }: Props) {
  const [dist, setDist] = useState<JobDistribution>({
    initial_time: 0,
    final_time: 0,
    probability: 0,
  });
  const [error, setError] = useState('');

  const validate = (): string => {
    if (dist.initial_time < 0 || dist.final_time <= dist.initial_time) {
      return 'Final time must be > initial time';
    }
    if (dist.probability <= 0 || dist.probability > 1) {
      return 'Probability must be between 0 and 1';
    }
    return '';
  };

  const handleAdd = () => {
    const err = validate();
    if (err) {
      setError(err);
    } else {
      onAdd(dist);
      setDist({ initial_time: 0, final_time: 0, probability: 0 });
      setError('');
    }
  };

  const isValid = validate() === '';

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
          onIonChange={e => setDist({ ...dist, initial_time: Number(e.detail.value) })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Final Time</IonLabel>
        <IonInput
          type="number"
          value={dist.final_time}
          onIonChange={e => setDist({ ...dist, final_time: Number(e.detail.value) })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Probability (0-1)</IonLabel>
        <IonInput
          type="number"
          value={dist.probability}
          onIonChange={e => setDist({ ...dist, probability: Number(e.detail.value) })}
        />
      </IonItem>

      {error && (
        <IonText color="danger">
          <p style={{ margin: '4px 16px' }}>{error}</p>
        </IonText>
      )}

      <IonButton expand="full" onClick={handleAdd} disabled={!isValid}>
        Add Distribution
      </IonButton>

      {items.map((d, i) => (
        <IonItem key={i}>
          <IonLabel>
            [{d.initial_time}–{d.final_time}] Prob: {d.probability}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
);
}
