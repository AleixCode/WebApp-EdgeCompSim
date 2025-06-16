// ViewSimulationPage.tsx
import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import CreateSimulation from "../components/CreateSimulation";
import type {
  ResultsSimulationData,
  CreateSimulationPayload,
} from "../interfaces";

interface ViewSimulationPageProps {
  simulation: ResultsSimulationData;
}

export default function ViewSimulationPage({
  simulation,
}: ViewSimulationPageProps) {
  const initialData: CreateSimulationPayload & {
    results?: string;
    logs?: string;
  } = {
    formData: {
      name: simulation.name,
      time: simulation.time,
      exec_time: simulation.exec_time,
      seed_users: simulation.seed_users,
      seed_servers: simulation.seed_servers,
      type_exec: simulation.type_exec,
      type_placement: simulation.type_placement,
    },
    possibleJobs: simulation.possible_jobs,
    jobDistributions: simulation.job_distributions,
    servers: simulation.servers,
    // Convert results to a formatted string (or adjust as needed)
    results: simulation.results,
    // Likewise for logs:
    logs: Array.isArray(simulation.logs)
      ? JSON.stringify(simulation.logs, null, 2)
      : simulation.logs,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>View Simulation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <CreateSimulation
          initialData={initialData}
          readOnly={true}
          onCreate={() => {}}
          simId={simulation.id}
        />
      </IonContent>
    </IonPage>
  );
}
