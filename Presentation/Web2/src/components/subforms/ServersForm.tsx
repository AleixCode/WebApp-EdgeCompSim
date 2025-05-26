import React, { useState } from 'react';
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText
} from '@ionic/react';
import type { Server } from '../../interfaces';

interface Props {
  items: Server[];
  onAdd: (server: Server) => void;
}

export default function ServersForm({ items, onAdd }: Props) {
  const initialState: Server = { cpu: 0, mem: 0, hdd: 0, availability: '' };
  const [srv, setSrv] = useState<Server>(initialState);
  const [error, setError] = useState('');

  const parseNumber = (value: string | null | undefined): number => {
    const num = parseFloat(value || '0');
    return isNaN(num) ? 0 : num;
  };

  const validate = (): string => {
    if (srv.cpu <= 0 || srv.mem <= 0 || srv.hdd <= 0) {
      return 'CPU, Memory, and HDD must be greater than 0.';
    }
    if (!srv.availability) {
      return 'Please select an availability level.';
    }
    return '';
  };

  const handleAdd = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    onAdd(srv);
    setSrv(initialState);
    setError('');
  };

  const isValid = validate() === '';

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Add Server</IonLabel>
      </IonListHeader>

      <IonItem>
        <IonLabel position="stacked">CPU</IonLabel>
        <IonInput
          type="number"
          value={srv.cpu}
          onIonInput={e =>
            setSrv({ ...srv, cpu: parseNumber((e.target as HTMLInputElement).value) })
          }
          placeholder="Enter CPU"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Memory</IonLabel>
        <IonInput
          type="number"
          value={srv.mem}
          onIonInput={e =>
            setSrv({ ...srv, mem: parseNumber((e.target as HTMLInputElement).value) })
          }
          placeholder="Enter Memory"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">HDD</IonLabel>
        <IonInput
          type="number"
          value={srv.hdd}
          onIonInput={e =>
            setSrv({ ...srv, hdd: parseNumber((e.target as HTMLInputElement).value) })
          }
          placeholder="Enter HDD"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Availability</IonLabel>
        <IonSelect
          value={srv.availability}
          placeholder="Select Availability"
          onIonChange={e => setSrv({ ...srv, availability: e.detail.value })}
        >
          <IonSelectOption value="High">High Availability</IonSelectOption>
          <IonSelectOption value="Medium">Medium Availability</IonSelectOption>
          <IonSelectOption value="Low">Low Availability</IonSelectOption>
        </IonSelect>
      </IonItem>

      {error && (
        <IonText color="danger">
          <p style={{ margin: '8px 16px' }}>{error}</p>
        </IonText>
      )}

      <IonButton expand="full" onClick={handleAdd} disabled={!isValid}>
        Add Server
      </IonButton>

      {items.length > 0 && (
        <>
          <IonListHeader>
            <IonLabel>Server List</IonLabel>
          </IonListHeader>
          {items.map((s, i) => (
            <IonItem key={i}>
              <IonLabel>
                CPU: {s.cpu}, MEM: {s.mem}, HDD: {s.hdd}, Availability: {s.availability}
              </IonLabel>
            </IonItem>
          ))}
        </>
      )}
    </IonList>
  );
}
