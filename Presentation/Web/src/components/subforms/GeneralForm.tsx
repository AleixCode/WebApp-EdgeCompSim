import { IonInput, IonSelect, IonSelectOption, IonItem, IonLabel, IonList } from '@ionic/react';
import { ChangeEvent } from 'react';

import { SimulationData } from '../CreateSimulation';

interface GeneralFormProps {
  formData: SimulationData;
  onChange: <K extends keyof SimulationData>(
    field: K,
    value: SimulationData[K]
  ) => void;
}

export default function GeneralForm({ formData, onChange }: GeneralFormProps) {
  return (
    <IonList>
      <IonItem>
        <IonLabel position="floating">Simulation Name</IonLabel>
        <IonInput
          type="text"
          value={formData.name}
          onIonChange={(event: any) => onChange('name', event.detail.value)}
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Total Time</IonLabel>
        <IonInput
          type="number"
          value={formData.time}
          onIonChange={(e: any) =>
            onChange('time', Number(e.target.value))
          }
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Execution Time</IonLabel>
        <IonInput
          type="number"
          value={formData.exec_time}
          onIonChange={(e: any) =>
            onChange('exec_time', Number(e.target.value))
          }
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel>Execution Type</IonLabel>
        <IonSelect
          value={formData.type_exec}
          onIonChange={(e) => onChange('type_exec', e.detail.value)}
        >
          <IonSelectOption value={0}>Type 0</IonSelectOption>
          <IonSelectOption value={1}>Type 1</IonSelectOption>
          <IonSelectOption value={2}>Type 2</IonSelectOption>
          <IonSelectOption value={3}>Type 3</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Placement Type</IonLabel>
        <IonSelect
          value={formData.type_placement}
          onIonChange={(e) => onChange('type_placement', e.detail.value)}
        >
          <IonSelectOption value={0}>Placement 0</IonSelectOption>
          <IonSelectOption value={1}>Placement 1</IonSelectOption>
          <IonSelectOption value={2}>Placement 2</IonSelectOption>
          <IonSelectOption value={3}>Placement 3</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
  );
}
