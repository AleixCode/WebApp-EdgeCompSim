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
  SimulationData,
  CreateSimulationPayload,
  ResultsSimulationData,
} from "../interfaces";

interface ViewSimulationPageProps {
  simulation: ResultsSimulationData;
}

export default function ViewSimulationPage({
  simulation,
}: ViewSimulationPageProps) {
  // Build the initialData from simulation
  const initialData: ResultsSimulationData = {
    name: simulation.name,
    time: simulation.time,
    exec_time: simulation.exec_time,
    seed_users: simulation.seed_users,
    seed_servers: simulation.seed_servers,
    type_exec: simulation.type_exec,
    type_placement: simulation.type_placement,
    possible_jobs: simulation.possible_jobs,
    job_distributions: simulation.job_distributions,
    servers: simulation.servers,
    results: simulation.results,
    logs: simulation.logs,
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
        />
      </IonContent>
    </IonPage>
  );
}
