import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption } from '@ionic/react';

import { Server } from '../CreateSimulation';

interface ServersFormProps {
  items: Server[];
  onAdd: (server: Server) => void;
}

export default function ServersForm({ items, onAdd }: ServersFormProps) {
  const [srv, setSrv] = useState<Server>({ cpu: 0, mem: 0, hdd: 0, availability: 'H' });

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
          onIonChange={(event) => setSrv({ ...srv, cpu: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Memory</IonLabel>
        <IonInput
          type="number"
          value={srv.mem}
          onIonChange={(event) => setSrv({ ...srv, mem: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">HDD</IonLabel>
        <IonInput
          type="number"
          value={srv.hdd}
          onIonChange={(event) => setSrv({ ...srv, hdd: Number(event.detail.value) })}
        />
      </IonItem>

      <IonItem>
        <IonLabel>Availability</IonLabel>
        <IonSelect
          value={srv.availability}
          onIonChange={(event) => setSrv({ ...srv, availability: event.detail.value })}
        >
          <IonSelectOption value="H">High</IonSelectOption>
          <IonSelectOption value="M">Medium</IonSelectOption>
          <IonSelectOption value="L">Low</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonButton expand="full" onClick={() => onAdd(srv)}>
        Add Server
      </IonButton>

      <IonList>
        {items.map((s, i) => (
          <IonItem key={i}>
            <IonLabel>{`CPU: ${s.cpu}, MEM: ${s.mem}, HDD: ${s.hdd}, Avail: ${s.availability}`}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonList>
  );
}
