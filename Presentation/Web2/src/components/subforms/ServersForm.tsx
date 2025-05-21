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
  const [srv, setSrv] = useState<Server>({
    cpu: 0,
    mem: 0,
    hdd: 0,
    availability: '',
  });
  const [error, setError] = useState('');

  const validate = (): string => {
    if (srv.cpu <= 0 || srv.mem <= 0 || srv.hdd <= 0) {
      return 'CPU, Mem, and HDD must be > 0';
    }
    if (!srv.availability) {
      return 'Availability must be selected';
    }
    return '';
  };

  const handleAdd = () => {
    const err = validate();
    if (err) {
      setError(err);
    } else {
      onAdd(srv);
      setSrv({ cpu: 0, mem: 0, hdd: 0, availability: '' });
      setError('');
    }
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
          onIonChange={e => setSrv({ ...srv, cpu: Number(e.detail.value) })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Memory</IonLabel>
        <IonInput
          type="number"
          value={srv.mem}
          onIonChange={e => setSrv({ ...srv, mem: Number(e.detail.value) })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">HDD</IonLabel>
        <IonInput
          type="number"
          value={srv.hdd}
          onIonChange={e => setSrv({ ...srv, hdd: Number(e.detail.value) })}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Availability</IonLabel>
        <IonSelect
          value={srv.availability}
          onIonChange={e => setSrv({ ...srv, availability: e.detail.value! })}
        >
          <IonSelectOption value="High">High</IonSelectOption>
          <IonSelectOption value="Medium">Medium</IonSelectOption>
          <IonSelectOption value="Low">Low</IonSelectOption>
        </IonSelect>
      </IonItem>

      {error && (
        <IonText color="danger">
          <p style={{ margin: '4px 16px' }}>{error}</p>
        </IonText>
      )}

      <IonButton expand="full" onClick={handleAdd} disabled={!isValid}>
        Add Server
      </IonButton>

      {items.map((s, i) => (
        <IonItem key={i}>
          <IonLabel>
            CPU:{s.cpu}, MEM:{s.mem}, HDD:{s.hdd}, Avail:{s.availability}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
