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
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  deleteSimulation,
  runSimulation,
  updateSimulation,
} from "../api/backendClient";
import { SimulationData } from "../interfaces";

type Status = "pending" | "running" | "finished";

interface SimulationsCardProps {
  title: string;
  status: Status;
  simulationId: string;
  // Optionally pass the full simulation details for editing purposes
  simulation?: SimulationData;
}

const statusColorMap: Record<Status, string> = {
  pending: "#ef5350", // red
  running: "#ffb300", // amber
  finished: "#66bb6a", // green
};

export default function SimulationsCard({
  title,
  status,
  simulationId,
  simulation,
}: SimulationsCardProps) {
  // Local state for showing modals, alerts, and managing loading states.
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fields for the edit form. You might have additional fields.
  const [editTitle, setEditTitle] = useState(title);

  // Handling running a simulation
  const handleRun = async () => {
    setLoading(true);
    try {
      await runSimulation(simulationId);
    } catch (error) {
      console.error("Failed to run simulation:", error);
    }
    setLoading(false);
  };

  // Handling deletion with confirmation
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSimulation(simulationId);
    } catch (error) {
      console.error("Failed to delete simulation:", error);
    }
    setLoading(false);
    setShowDeleteAlert(false);
  };

  // Handling saving of edited simulation details
  const handleEditSave = async () => {
    setLoading(true);
    try {
      // Adjust the updateSimulation call based on your API.
      await updateSimulation(simulationId, {
        title: editTitle,
      });
    } catch (error) {
      console.error("Failed to update simulation:", error);
    }
    setLoading(false);
    setShowEditModal(false);
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
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
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
            <IonButton
              fill="outline"
              color="medium"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </IonButton>
            <IonButton color="primary" onClick={handleRun}>
              Run
            </IonButton>
            <IonButton color="danger" onClick={() => setShowDeleteAlert(true)}>
              Delete
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Delete Confirmation Alert */}
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

      {/* Edit Simulation Modal */}
      <IonModal
        isOpen={showEditModal}
        onDidDismiss={() => setShowEditModal(false)}
      >
        <div style={{ padding: "16px" }}>
          <h2>Edit Simulation</h2>
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput
              value={editTitle}
              onIonChange={(e) => setEditTitle(e.detail.value!)}
            />
          </IonItem>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <IonButton onClick={() => setShowEditModal(false)} fill="outline">
              Cancel
            </IonButton>
            <IonButton onClick={handleEditSave} color="primary">
              Save
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Global Loading Indicator */}
      <IonLoading isOpen={loading} message={"Please wait..."} />
    </>
  );
}
