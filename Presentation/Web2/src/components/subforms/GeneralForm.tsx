import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonList,
  IonListHeader,
} from "@ionic/react";
import { GeneralSimulationData } from "../../interfaces";

interface Props {
  formData: GeneralSimulationData;
  onChange: <K extends keyof GeneralSimulationData>(
    field: K,
    value: GeneralSimulationData[K]
  ) => void;
  onValidChange: (isValid: boolean) => void;
}

export default function GeneralForm({
  formData,
  onChange,
  onValidChange,
}: Props) {
  // Use local states for all inputs so that they can be empty (displaying only placeholders)
  const [localName, setLocalName] = useState(formData.name);
  const [localTime, setLocalTime] = useState(
    formData.time > 0 ? formData.time.toString() : ""
  );
  const [localExecTime, setLocalExecTime] = useState(
    formData.exec_time > 0 ? formData.exec_time.toString() : ""
  );
  // For seeds, an empty string means “not provided” (later default to 0)
  const [localSeedUsers, setLocalSeedUsers] = useState(
    formData.seed_users >= 0 ? formData.seed_users.toString() : ""
  );
  const [localSeedServers, setLocalSeedServers] = useState(
    formData.seed_servers >= 0 ? formData.seed_servers.toString() : ""
  );

  // Track touched state for each field so that errors only appear after user interacts.
  const [touched, setTouched] = useState({
    name: false,
    time: false,
    exec_time: false,
    seed_users: false,
    seed_servers: false,
  });

  // Display an error for a field only if it is touched and invalid.
  const nameError =
    touched.name && localName.trim() === "" ? "Name is required" : "";
  const timeError =
    touched.time && (localTime.trim() === "" || Number(localTime) <= 0)
      ? "Time must be greater than 0"
      : "";
  const execTimeError =
    touched.exec_time &&
    (localExecTime.trim() === "" || Number(localExecTime) <= 0)
      ? "Exec Time must be greater than 0"
      : "";
  const seedUsersError =
    touched.seed_users &&
    localSeedUsers.trim() !== "" &&
    Number(localSeedUsers) < 0
      ? "Seed Users must be 0 or more"
      : "";
  const seedServersError =
    touched.seed_servers &&
    localSeedServers.trim() !== "" &&
    Number(localSeedServers) < 0
      ? "Seed Servers must be 0 or more"
      : "";

  // Overall form validity is computed from the local states.
  const isValid =
    localName.trim() !== "" &&
    localTime.trim() !== "" &&
    Number(localTime) > 0 &&
    localExecTime.trim() !== "" &&
    Number(localExecTime) > 0 &&
    (localSeedUsers.trim() === "" || Number(localSeedUsers) >= 0) &&
    (localSeedServers.trim() === "" || Number(localSeedServers) >= 0);

  // Report overall validity to the parent.
  useEffect(() => {
    onValidChange(isValid);
  }, [isValid]);

  // Handlers: on blur we mark the field as touched and send the converted value to parent.
  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }));
    onChange("name", localName);
  };

  const handleTimeBlur = () => {
    setTouched((prev) => ({ ...prev, time: true }));
    const num = localTime.trim() === "" ? 0 : Number(localTime);
    onChange("time", num);
  };

  const handleExecTimeBlur = () => {
    setTouched((prev) => ({ ...prev, exec_time: true }));
    const num = localExecTime.trim() === "" ? 0 : Number(localExecTime);
    onChange("exec_time", num);
  };

  const handleSeedUsersBlur = () => {
    setTouched((prev) => ({ ...prev, seed_users: true }));
    const num = localSeedUsers.trim() === "" ? 0 : Number(localSeedUsers);
    onChange("seed_users", num);
  };

  const handleSeedServersBlur = () => {
    setTouched((prev) => ({ ...prev, seed_servers: true }));
    const num = localSeedServers.trim() === "" ? 0 : Number(localSeedServers);
    onChange("seed_servers", num);
  };

  // A simple style override for select items (this stays unchanged)
  const selectStyles = { "--padding-start": "0px" };

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>General Information</IonLabel>
      </IonListHeader>

      {/* Simulation Name */}
      <IonItem>
        <IonLabel position="stacked">Simulation Name</IonLabel>
        <IonInput
          value={localName}
          placeholder="Enter Simulation Name"
          onIonInput={(e) => setLocalName(e.detail.value!)}
          onIonBlur={handleNameBlur}
        />
      </IonItem>
      {nameError && <ErrorText text={nameError} />}

      {/* Time to simulate */}
      <IonItem>
        <IonLabel position="stacked">Time to simulate</IonLabel>
        <IonInput
          type="number"
          value={localTime}
          placeholder="Enter Time (greater than 0)"
          onIonInput={(e) => setLocalTime(e.detail.value!)}
          onIonBlur={handleTimeBlur}
        />
      </IonItem>
      {timeError && <ErrorText text={timeError} />}

      {/* Real execution time */}
      <IonItem>
        <IonLabel position="stacked">Real execution time</IonLabel>
        <IonInput
          type="number"
          value={localExecTime}
          placeholder="Enter Exec Time (greater than 0)"
          onIonInput={(e) => setLocalExecTime(e.detail.value!)}
          onIonBlur={handleExecTimeBlur}
        />
      </IonItem>
      {execTimeError && <ErrorText text={execTimeError} />}

      {/* Seed Users */}
      <IonItem>
        <IonLabel position="stacked">Seed Users</IonLabel>
        <IonInput
          type="number"
          value={localSeedUsers}
          placeholder="Optional: Enter Seed Users (default 0)"
          onIonInput={(e) => setLocalSeedUsers(e.detail.value!)}
          onIonBlur={handleSeedUsersBlur}
        />
      </IonItem>
      {seedUsersError && <ErrorText text={seedUsersError} />}

      {/* Seed Servers */}
      <IonItem>
        <IonLabel position="stacked">Seed Servers</IonLabel>
        <IonInput
          type="number"
          value={localSeedServers}
          placeholder="Optional: Enter Seed Servers (default 0)"
          onIonInput={(e) => setLocalSeedServers(e.detail.value!)}
          onIonBlur={handleSeedServersBlur}
        />
      </IonItem>
      {seedServersError && <ErrorText text={seedServersError} />}

      {/* Placement Type */}
      <IonItem>
        <IonLabel position="stacked">Placement Type</IonLabel>
        <IonSelect
          interface="popover"
          style={selectStyles}
          value={formData.type_placement}
          onIonChange={(e) => onChange("type_placement", e.detail.value!)}
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
      <p style={{ marginLeft: "16px", marginTop: "4px", fontSize: "0.8em" }}>
        {text}
      </p>
    </IonText>
  );
}
