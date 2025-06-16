// SimulationsCard.tsx
import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonAlert,
  IonModal,
  IonLoading,
  IonContent,
} from "@ionic/react";
import {
  deleteSimulation,
  runSimulation,
  updateSimulation,
} from "../api/backendClient";
import {
  SimulationData,
  CreateSimulationPayload,
  ResultsSimulationData,
} from "../interfaces";
import CreateSimulation from "./CreateSimulation";
import { useAuth } from "../contexts/AuthContext";

type Status = "Pending" | "Running" | "Finished";

interface SimulationsCardProps {
  title: string;
  status: Status;
  simulationId: string;
  simulation: SimulationData; // if results are available, simulation should be of type ResultsSimulationData
}

const statusColorMap: Record<Status, string> = {
  Pending: "#ef5350",
  Running: "#ffb300",
  Finished: "#66bb6a",
};

export default function SimulationsCard({
  title,
  status,
  simulationId,
  simulation,
}: SimulationsCardProps) {
  const { updateUserData } = useAuth();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Build initialData for editing/viewing.
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
    // Map either "results" or fallback to "result"
    results:
      (simulation as ResultsSimulationData).results ||
      (simulation as any).result ||
      undefined,
    logs: (simulation as ResultsSimulationData).logs,
  };

  const handleEditSave = async (updatedPayload: CreateSimulationPayload) => {
    setLoading(true);
    try {
      await updateSimulation(simulationId, updatedPayload, updateUserData);
    } catch (error) {
      console.error("Failed to update simulation:", error);
    }
    setLoading(false);
    setShowEditModal(false);
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      await runSimulation(simulationId, updateUserData);
    } catch (error) {
      console.error("Failed to run simulation:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSimulation(simulationId, updateUserData);
    } catch (error) {
      console.error("Failed to delete simulation:", error);
    }
    setLoading(false);
    setShowDeleteAlert(false);
  };

  return (
    <>
      <IonCard
        style={{
          width: 300,
          backgroundColor: "#f9f9fb",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
          <IonCardSubtitle
            style={{ fontWeight: 600, color: statusColorMap[status] }}
          >
            Status: {status}
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              padding: "8px",
            }}
          >
            {status !== "Pending" && (
              <IonButton color="primary" onClick={() => setShowViewModal(true)}>
                View
              </IonButton>
            )}
            {status !== "Running" && (
              <IonButton
                fill="outline"
                color="medium"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </IonButton>
            )}
            {status === "Pending" && (
              <IonButton color="primary" onClick={handleRun}>
                Run
              </IonButton>
            )}
            {status !== "Running" && (
              <IonButton
                color="danger"
                onClick={() => setShowDeleteAlert(true)}
              >
                Delete
              </IonButton>
            )}
          </div>
        </IonCardContent>
      </IonCard>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Confirm Delete"
        message="Are you sure you want to delete this simulation? This action cannot be undone."
        buttons={[
          { text: "Cancel", role: "cancel" },
          { text: "Delete", handler: handleDelete },
        ]}
      />

      <IonModal
        isOpen={showEditModal}
        onDidDismiss={() => setShowEditModal(false)}
      >
        <IonContent>
          <CreateSimulation
            initialData={initialData}
            onCreate={handleEditSave}
          />
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={showViewModal}
        onDidDismiss={() => setShowViewModal(false)}
      >
        <IonContent>
          <CreateSimulation
            initialData={initialData}
            readOnly={true}
            onCreate={() => {}}
            simId={simulationId}
          />
        </IonContent>
      </IonModal>

      <IonLoading isOpen={loading} message={"Please wait..."} />
    </>
  );
}
