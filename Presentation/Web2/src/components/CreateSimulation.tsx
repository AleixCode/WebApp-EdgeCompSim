// CreateSimulation.tsx
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

type Tab = "general" | "jobs" | "dist" | "servers" | "results";

interface CreateSimulationProps {
  onCreate: (data: CreateSimulationPayload) => void;
  initialData?: CreateSimulationPayload & { results?: any; logs?: any };
  readOnly?: boolean;
  simId?: string; // simulation id for fetching images in view mode.
}

export default function CreateSimulation({
  onCreate,
  initialData,
  readOnly = false,
  simId,
}: CreateSimulationProps) {
  // Initialize state from initialData if provided.
  const [formData, setFormData] = useState<GeneralSimulationData>(
    initialData?.formData ?? {
      name: "",
      time: 0,
      exec_time: 0,
      seed_users: 0,
      seed_servers: 0,
      type_exec: 0,
      type_placement: 0,
    }
  );
  const [possibleJobs, setPossibleJobs] = useState<Job[]>(
    initialData?.possibleJobs ?? []
  );
  const [jobDistributions, setJobDistributions] = useState<JobDistribution[]>(
    initialData?.jobDistributions ?? []
  );
  const [servers, setServers] = useState<Server[]>(initialData?.servers ?? []);

  // In readOnly mode, default to "results" tab; otherwise, "general"
  const initialTab: Tab = readOnly ? "results" : "general";
  const [tab, setTab] = useState<Tab>(initialTab);

  // Validity flags (only used when not readOnly)
  const [validTabs, setValidTabs] = useState({
    general: false,
    jobs: false,
    dist: false,
    servers: false,
  });

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

  // Only allow submission when not readOnly.
  const canSubmit =
    !readOnly &&
    Object.values(validTabs).every((v) => v) &&
    possibleJobs.length > 0 &&
    jobDistributions.length > 0 &&
    servers.length > 0;

  const handleSave = () => {
    if (!readOnly) {
      onCreate({ formData, possibleJobs, jobDistributions, servers });
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // State for toggling logs view.
  const [logsExpanded, setLogsExpanded] = useState(false);

  return (
    <IonCard>
      <IonCardHeader>
        <IonToolbar>
          <IonCardTitle>
            {readOnly ? "View Simulation" : "Create Simulation"}
          </IonCardTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={tab}
            onIonChange={(e) => setTab(e.detail.value as Tab)}
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
            {readOnly && (
              <IonSegmentButton value="results">
                <IonLabel>Results</IonLabel>
              </IonSegmentButton>
            )}
          </IonSegment>
        </IonToolbar>
      </IonCardHeader>
      <IonCardContent>
        {tab === "general" && (
          <GeneralForm
            formData={formData}
            onChange={handleFormChange}
            onValidChange={handleGeneralValid}
            readOnly={readOnly}
          />
        )}
        {tab === "jobs" && (
          <PossibleJobsForm
            items={possibleJobs}
            onAdd={(item) => setPossibleJobs((prev) => [...prev, item])}
            onRemove={(i) =>
              setPossibleJobs((prev) => prev.filter((_, idx) => idx !== i))
            }
            onValidChange={handleJobsValid}
            readOnly={readOnly}
          />
        )}
        {tab === "dist" && (
          <JobDistributionsForm
            simulationTime={formData.time}
            items={jobDistributions}
            onAdd={(item) => setJobDistributions((prev) => [...prev, item])}
            onRemove={(i) =>
              setJobDistributions((prev) => prev.filter((_, idx) => idx !== i))
            }
            onValidChange={handleDistsValid}
            readOnly={readOnly}
          />
        )}
        {tab === "servers" && (
          <ServersForm
            items={servers}
            onAdd={(item) => setServers((prev) => [...prev, item])}
            onRemove={(i) =>
              setServers((prev) => prev.filter((_, idx) => idx !== i))
            }
            onValidChange={handleServersValid}
            readOnly={readOnly}
          />
        )}
        {tab === "results" && readOnly && (
          <div style={{ padding: "16px" }}>
            <h2>Simulation Results</h2>
            {initialData?.results || initialData?.logs ? (
              <>
                {initialData.results && (
                  <>
                    <br></br>
                    <h3>Results:</h3>
                    <div>
                      {Object.entries(initialData.results || {}).map(
                        ([key, value]) => (
                          <p key={key}>
                            <strong>{capitalize(key)}:</strong> {value}
                          </p>
                        )
                      )}
                    </div>
                    <br></br>
                  </>
                )}
                {initialData.logs && (
                  <>
                    <h3>Logs:</h3>
                    {/* <IonButton
                      size="small"
                      fill="outline"
                      onClick={() => setLogsExpanded((prev) => !prev)}
                    >
                      {logsExpanded ? "Collapse Logs" : "Expand Logs"}
                    </IonButton> */}
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "8px",
                        padding: "8px",
                        maxHeight: logsExpanded ? "none" : "150px",
                        overflowY: "auto",
                        backgroundColor: "#f7f7f7",
                      }}
                    >
                      <pre style={{ whiteSpace: "pre-wrap" }}>
                        {typeof initialData.logs === "string"
                          ? initialData.logs
                          : JSON.stringify(initialData.logs, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </>
            ) : (
              <IonText>No results available.</IonText>
            )}
            {simId && (
              <div style={{ marginTop: "16px" }}>
                <h3>Simulation Charts</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`http://localhost:5000/api/download?filename=real_jobs_.png&sim_id=${simId}`}
                    alt="Jobs Chart"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <img
                    src={`http://localhost:5000/api/download?filename=real_servers_levels.png&sim_id=${simId}`}
                    alt="Servers Levels Chart"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <img
                    src={`http://localhost:5000/api/download?filename=real_servers_on.png&sim_id=${simId}`}
                    alt="Servers On Chart"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {!readOnly && (
          <div style={{ marginTop: 24 }}>
            <IonButton
              expand="block"
              onClick={handleSave}
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
        )}
      </IonCardContent>
    </IonCard>
  );
}
