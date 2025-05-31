import React, { useState, useCallback } from "react";
import {
  IonCard,
  IonCardHeader,
  IonToolbar,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";

import GeneralForm from "./subforms/GeneralForm";
import PossibleJobsForm from "./subforms/PossibleJobsForm";
import JobDistributionsForm from "./subforms/JobDistributionsForm";
import ServersForm from "./subforms/ServersForm";

import type {
  CreateSimulationPayload,
  GeneralSimulationData,
  Job,
  JobDistribution,
  Server,
} from "../interfaces";

export default function CreateSimulation({
  onCreate,
}: {
  onCreate: (data: CreateSimulationPayload) => void;
}) {
  const [tab, setTab] = useState<"general" | "jobs" | "dist" | "servers">(
    "general"
  );

  // form data
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

  // track tab validity
  const [validTabs, setValidTabs] = useState({
    general: false,
    jobs: false,
    dist: false,
    servers: false,
  });

  // Memoized callbacks to avoid infinite loops
  const handleGeneralValid = useCallback(
    (valid: boolean) => setValidTabs((v) => ({ ...v, general: valid })),
    []
  );
  const handleJobsValid = useCallback(
    (valid: boolean) => setValidTabs((v) => ({ ...v, jobs: valid })),
    []
  );
  const handleDistsValid = useCallback(
    (valid: boolean) => setValidTabs((v) => ({ ...v, dist: valid })),
    []
  );
  const handleServersValid = useCallback(
    (valid: boolean) => setValidTabs((v) => ({ ...v, servers: valid })),
    []
  );

  const handleFormChange = <K extends keyof GeneralSimulationData>(
    field: K,
    value: GeneralSimulationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    Object.values(validTabs).every((v) => v) &&
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
              <IonLabel>
                General{" "}
                {validTabs.general && <IonIcon icon={checkmarkCircleOutline} />}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jobs">
              <IonLabel>
                Jobs{" "}
                {validTabs.jobs && <IonIcon icon={checkmarkCircleOutline} />}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="dist">
              <IonLabel>
                Distributions{" "}
                {validTabs.dist && <IonIcon icon={checkmarkCircleOutline} />}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="servers">
              <IonLabel>
                Servers{" "}
                {validTabs.servers && <IonIcon icon={checkmarkCircleOutline} />}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonCardHeader>

      <IonCardContent>
        {tab === "general" && (
          <GeneralForm
            formData={formData}
            onChange={handleFormChange}
            onValidChange={handleGeneralValid}
          />
        )}

        {tab === "jobs" && (
          <PossibleJobsForm
            items={possibleJobs}
            onAdd={(item) => setPossibleJobs([...possibleJobs, item])}
            onRemove={(i: number) =>
              setPossibleJobs(possibleJobs.filter((_, idx) => idx !== i))
            }
            onValidChange={handleJobsValid}
          />
        )}

        {tab === "dist" && (
          <JobDistributionsForm
            simulationTime={formData.time}
            items={jobDistributions}
            onAdd={(item) => setJobDistributions([...jobDistributions, item])}
            onRemove={(i: number) =>
              setJobDistributions(
                jobDistributions.filter((_, idx) => idx !== i)
              )
            }
            onValidChange={handleDistsValid}
          />
        )}

        {tab === "servers" && (
          <ServersForm
            items={servers}
            onAdd={(item) => setServers((prev) => [...prev, item])}
            onRemove={(i: number) =>
              setServers(servers.filter((_, idx) => idx !== i))
            }
            onValidChange={handleServersValid}
          />
        )}

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
              Please complete all sections (tabs show a ✔︎ when valid).
            </IonText>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}
