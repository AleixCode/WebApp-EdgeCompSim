import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonToolbar,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonTitle,
  IonItemDivider,
} from "@ionic/react";

import GeneralForm from "./subforms/GeneralForm";
import PossibleJobsForm from "./subforms/PossibleJobsForm";
import JobDistributionsForm from "./subforms/JobDistributionsForm";
import ServersForm from "./subforms/ServersForm";

import type {
  CreateSimulationPayload,
  GeneralSimulationData,
  SimulationData,
  Job,
  JobDistribution,
  Server,
} from "../interfaces";

export interface CreateSimulationProps {
  onCreate: (data: {
    formData: GeneralSimulationData;
    possibleJobs: Job[];
    jobDistributions: JobDistribution[];
    servers: Server[];
  }) => void;
}

export default function CreateSimulation({ onCreate }: CreateSimulationProps) {
  const [tab, setTab] = useState<"general" | "jobs" | "dist" | "servers">(
    "general"
  );
  const [formData, setFormData] = useState<GeneralSimulationData>({
    name: "",
    time: 0,
    exec_time: 0,
    seed_users: 0,
    seed_servers: 0,
    type_exec: 0,
    type_placement: 0,
  });
  const [possibleJobs, setPossibleJobs] = useState<Job[]>([]);
  const [jobDistributions, setJobDistributions] = useState<JobDistribution[]>(
    []
  );
  const [servers, setServers] = useState<Server[]>([]);

  const handleFormChange = <K extends keyof GeneralSimulationData>(
    field: K,
    value: GeneralSimulationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    formData.name !== "" &&
    formData.time > 0 &&
    formData.exec_time > 0 &&
    possibleJobs.length > 0 &&
    jobDistributions.length > 0 &&
    servers.length > 0;

  return (
    <IonCard>
      <IonCardHeader>
        <IonToolbar>
          <IonCardTitle>Create Simulation</IonCardTitle>
        </IonToolbar>

        <IonToolbar>
          <IonSegment
            value={tab}
            onIonChange={(e) => setTab(e.detail.value as any)}
            scrollable
          >
            <IonSegmentButton value="general">
              <IonLabel>General</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jobs">
              <IonLabel>Jobs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="dist">
              <IonLabel>Distributions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="servers">
              <IonLabel>Servers</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonCardHeader>

      <IonCardContent>
        <IonItemDivider>
          <IonLabel>
            {tab === "general" && "General Settings"}
            {tab === "jobs" && "Possible Jobs"}
            {tab === "dist" && "Job Distributions"}
            {tab === "servers" && "Server Configuration"}
          </IonLabel>
        </IonItemDivider>

        <div style={{ padding: "12px 0" }}>
          {tab === "general" && (
            <GeneralForm formData={formData} onChange={handleFormChange} />
          )}
          {tab === "jobs" && (
            <PossibleJobsForm
              items={possibleJobs}
              onAdd={(item) => setPossibleJobs([...possibleJobs, item])}
            />
          )}
          {tab === "dist" && (
            <JobDistributionsForm
              items={jobDistributions}
              onAdd={(item) => setJobDistributions([...jobDistributions, item])}
            />
          )}
          {tab === "servers" && (
            <ServersForm
              items={servers}
              onAdd={(item) => setServers([...servers, item])}
            />
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <IonButton
            expand="block"
            onClick={() =>
              onCreate({ formData, possibleJobs, jobDistributions, servers })
            }
            disabled={!canSubmit}
          >
            Save Simulation
          </IonButton>

          {!canSubmit && (
            <IonText color="medium">
              <p style={{ fontSize: "0.85em", paddingTop: 8 }}>
                Please complete all sections with valid data before saving.
              </p>
            </IonText>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}
