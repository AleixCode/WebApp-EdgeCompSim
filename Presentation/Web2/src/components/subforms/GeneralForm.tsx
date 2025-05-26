import React from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonList,
  IonListHeader,
} from '@ionic/react';
import { SimulationData } from '../../interfaces';

interface Props {
  formData: SimulationData;
  onChange: <K extends keyof SimulationData>(field: K, value: SimulationData[K]) => void;
}

export default function GeneralForm({ formData, onChange }: Props) {
  const errors: { [key in keyof SimulationData]?: string } = {};
  
  if (!formData.name) errors.name = 'Name is required';
  if (formData.time <= 0) errors.time = 'Time must be greater than 0';
  if (formData.exec_time <= 0) errors.exec_time = 'Exec Time must be greater than 0';
  if (formData.seed_users < 0) errors.seed_users = 'Seed Users must be 0 or more';
  if (formData.seed_servers < 0) errors.seed_servers = 'Seed Servers must be 0 or more';

  const selectStyles = { '--padding-start': '0px' };

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>General Information</IonLabel>
      </IonListHeader>

      {/* Name */}
      <IonItem>
        <IonLabel position="stacked">Simulation Name</IonLabel>
        <IonInput
          value={formData.name}
          onIonInput={e => onChange('name', e.detail.value!)}
        />
      </IonItem>
      {errors.name && <ErrorText text={errors.name} />}

      {/* Time */}
      <IonItem>
        <IonLabel position="stacked">Time to simulate</IonLabel>
        <IonInput
          type="number"
          value={formData.time}
          onIonInput={e => onChange('time', Number(e.detail.value))}
        />
      </IonItem>
      {errors.time && <ErrorText text={errors.time} />}

      {/* Execution Time */}
      <IonItem>
        <IonLabel position="stacked">Real execution time</IonLabel>
        <IonInput
          type="number"
          value={formData.exec_time}
          onIonInput={e => onChange('exec_time', Number(e.detail.value))}
        />
      </IonItem>
      {errors.exec_time && <ErrorText text={errors.exec_time} />}

      {/* Seed Users */}
      <IonItem>
        <IonLabel position="stacked">Seed Users</IonLabel>
        <IonInput
          type="number"
          value={formData.seed_users}
          onIonInput={e => onChange('seed_users', Number(e.detail.value))}
        />
      </IonItem>
      {errors.seed_users && <ErrorText text={errors.seed_users} />}

      {/* Seed Servers */}
      <IonItem>
        <IonLabel position="stacked">Seed Servers</IonLabel>
        <IonInput
          type="number"
          value={formData.seed_servers}
          onIonInput={e => onChange('seed_servers', Number(e.detail.value))}
        />
      </IonItem>
      {errors.seed_servers && <ErrorText text={errors.seed_servers} />}


      {/* Type Execution */}
      {/*
      <IonItem>
        <IonLabel position="stacked">Execution Type</IonLabel>
        <IonSelect
          interface="popover"
          style={selectStyles}
          value={formData.type_exec}
          onIonChange={e => onChange('type_exec', e.detail.value!)}
        >
          <IonSelectOption value={0}>Round Robin</IonSelectOption>
          <IonSelectOption value={1}>Priority</IonSelectOption>
          <IonSelectOption value={2}>Random</IonSelectOption>
        </IonSelect>
      </IonItem>
      */}

      {/* Type Placement */}
      <IonItem>
        <IonLabel position="stacked">Placement Type</IonLabel>
        <IonSelect
          interface="popover"
          style={selectStyles}
          value={formData.type_placement}
          onIonChange={e => onChange('type_placement', e.detail.value!)}
        >
          <IonSelectOption value={0}>Bin Packing</IonSelectOption>
          <IonSelectOption value={1}>Spread</IonSelectOption>
          <IonSelectOption value={2}>Load Aware</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <IonText color="danger">
      <p style={{ marginLeft: '16px', marginTop: '4px', fontSize: '0.8em' }}>
        {text}
      </p>
    </IonText>
  );
}
