import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/react';
import type { SimulationData } from '../../interfaces';

interface Props {
  formData: SimulationData;
  onChange: <K extends keyof SimulationData>(field: K, value: SimulationData[K]) => void;
}

export default function GeneralForm({ formData, onChange }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  // Validate whenever formData changes
  useEffect(() => {
    const errs: string[] = [];
    if (!formData.name.trim()) errs.push('Name is required');
    if (formData.time <= 0) errs.push('Total time must be > 0');
    if (formData.exec_time <= 0) errs.push('Execution time must be > 0');
    setErrors(errs);
  }, [formData]);

  return (
    <IonList>
      <IonItem>
        <IonLabel position="floating">Simulation Name</IonLabel>
        <IonInput
          value={formData.name}
          onIonChange={e => onChange('name', e.detail.value || '')}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Total Time</IonLabel>
        <IonInput
          type="number"
          value={formData.time}
          onIonChange={e => onChange('time', Number(e.detail.value))}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Execution Time</IonLabel>
        <IonInput
          type="number"
          value={formData.exec_time}
          onIonChange={e => onChange('exec_time', Number(e.detail.value))}
        />
      </IonItem>

      <IonItem>
        <IonLabel>Execution Type</IonLabel>
        <IonSelect
          value={formData.type_exec}
          onIonChange={e => onChange('type_exec', e.detail.value!)}
        >
          {[0,1,2,3].map(i => (
            <IonSelectOption key={i} value={i}>Type {i}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Placement Type</IonLabel>
        <IonSelect
          value={formData.type_placement}
          onIonChange={e => onChange('type_placement', e.detail.value!)}
        >
          {[0,1,2,3].map(i => (
            <IonSelectOption key={i} value={i}>Placement {i}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      {errors.map((err, idx) => (
        <IonText key={idx} color="danger">
          <p style={{ margin: '4px 16px' }}>{err}</p>
        </IonText>
      ))}
    </IonList>
  );
}
