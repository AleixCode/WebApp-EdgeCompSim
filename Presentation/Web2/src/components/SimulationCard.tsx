import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
} from "@ionic/react";

type Status = "pending" | "running" | "finished";

interface SimulationsCardProps {
  title: string;
  status: Status;
}

const statusColorMap: Record<Status, string> = {
  pending: "#ef5350", // red
  running: "#ffb300", // amber
  finished: "#66bb6a", // green
};

export default function SimulationsCard({
  title,
  status,
}: SimulationsCardProps) {
  return (
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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          padding: "8px",
        }}
      >
        <IonButton fill="outline" color="medium">
          View
        </IonButton>
        <IonButton color="primary">Edit</IonButton>
      </div>
    </IonCard>
  );
}
