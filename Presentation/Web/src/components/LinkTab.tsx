import React from 'react';
import { IonTabButton, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface LinkTabProps {
  label: string;
  to: string;
}

const LinkTab: React.FC<LinkTabProps> = ({ label, to }) => {
  const history = useHistory();

  return (
    <IonTabButton onClick={() => history.push(to)}>
      <IonLabel>{label}</IonLabel>
    </IonTabButton>
  );
};

export default LinkTab;
