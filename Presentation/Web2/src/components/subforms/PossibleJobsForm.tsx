import React, { useState, useEffect } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonListHeader,
  IonText,
} from "@ionic/react";
import { Job } from "../../interfaces";

interface Props {
  items: Job[];
  onAdd: (job: Job) => void;
  onRemove: (index: number) => void;
  onValidChange: (isValid: boolean) => void;
  readOnly: boolean;
}

export default function PossibleJobsForm({
  items,
  onAdd,
  onRemove,
  onValidChange,
  readOnly,
}: Props) {
  // Local state for the new job, stored as strings so that inputs start empty.
  const initialState = { cpu: "", mem: "", hdd: "", probability: "" };
  const [job, setJob] = useState(initialState);

  // Track touched state for each field so errors only show after interaction.
  const [touched, setTouched] = useState({
    cpu: false,
    mem: false,
    hdd: false,
    probability: false,
  });

  // Compute error messages for each field (shown just under their corresponding input)
  const cpuError =
    touched.cpu && (job.cpu === "" || Number(job.cpu) <= 0)
      ? "CPU must be greater than 0."
      : "";
  const memError =
    touched.mem && (job.mem === "" || Number(job.mem) <= 0)
      ? "Memory must be greater than 0."
      : "";
  const hddError =
    touched.hdd && (job.hdd === "" || Number(job.hdd) <= 0)
      ? "HDD must be greater than 0."
      : "";
  const probabilityError =
    touched.probability &&
    (job.probability === "" ||
      Number(job.probability) <= 0 ||
      Number(job.probability) > 1)
      ? "Probability must be between 0 and 1."
      : "";

  // Check if the new job form is completely filled.
  const isJobInputFilled =
    job.cpu !== "" &&
    job.mem !== "" &&
    job.hdd !== "" &&
    job.probability !== "";
  // And if all fields are valid.
  const isJobInputValid =
    isJobInputFilled &&
    !cpuError &&
    !memError &&
    !hddError &&
    !probabilityError;

  // Global condition: the list of added jobs must not be empty and the sum of their probabilities must equal 1.
  const totalProbability = items.reduce(
    (sum, j) => sum + Number(j.probability),
    0
  );
  const globalValid =
    items.length > 0 && Math.abs(totalProbability - 1) < 0.0001;

  // Inform the parent about the overall validity of this form.
  useEffect(() => {
    onValidChange(globalValid);
  }, [globalValid]);

  const handleAdd = () => {
    // Mark each field as touched so errors show up if the input is incorrect.
    setTouched({
      cpu: true,
      mem: true,
      hdd: true,
      probability: true,
    });
    if (!isJobInputValid) return;

    // Create a new job with numbers converted appropriately.
    const newJob: Job = {
      cpu: Number(job.cpu),
      mem: Number(job.mem),
      hdd: Number(job.hdd),
      probability: Number(job.probability),
    };
    onAdd(newJob);

    // Reset the new job form.
    setJob(initialState);
    setTouched({
      cpu: false,
      mem: false,
      hdd: false,
      probability: false,
    });
  };

  return (
    <IonList>
      {!readOnly && (
        <>
          <IonListHeader>
            <IonLabel>Add Possible Job</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel position="stacked">CPU (MIPS)</IonLabel>
            <IonInput
              type="number"
              value={job.cpu}
              placeholder="Enter CPU"
              onIonInput={(e) => setJob({ ...job, cpu: e.detail.value! })}
              onIonBlur={() => setTouched({ ...touched, cpu: true })}
              disabled={readOnly}
            />
          </IonItem>
          {cpuError && (
            <IonText color="danger">
              <p style={{ margin: "4px 16px" }}>{cpuError}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Memory (Mbytes)</IonLabel>
            <IonInput
              type="number"
              value={job.mem}
              placeholder="Enter Memory"
              onIonInput={(e) => setJob({ ...job, mem: e.detail.value! })}
              onIonBlur={() => setTouched({ ...touched, mem: true })}
              disabled={readOnly}
            />
          </IonItem>
          {memError && (
            <IonText color="danger">
              <p style={{ margin: "4px 16px" }}>{memError}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">HDD (Mbytes)</IonLabel>
            <IonInput
              type="number"
              value={job.hdd}
              placeholder="Enter HDD"
              onIonInput={(e) => setJob({ ...job, hdd: e.detail.value! })}
              onIonBlur={() => setTouched({ ...touched, hdd: true })}
              disabled={readOnly}
            />
          </IonItem>
          {hddError && (
            <IonText color="danger">
              <p style={{ margin: "4px 16px" }}>{hddError}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Probability (0–1)</IonLabel>
            <IonInput
              type="number"
              value={job.probability}
              placeholder="Enter Probability"
              onIonInput={(e) =>
                setJob({ ...job, probability: e.detail.value! })
              }
              onIonBlur={() => setTouched({ ...touched, probability: true })}
              disabled={readOnly}
            />
          </IonItem>
          {probabilityError && (
            <IonText color="danger">
              <p style={{ margin: "4px 16px" }}>{probabilityError}</p>
            </IonText>
          )}

          <IonButton
            expand="full"
            onClick={handleAdd}
            disabled={!isJobInputFilled || !isJobInputValid || readOnly}
          >
            Add Job
          </IonButton>
        </>
      )}

      {/* Global error message about the sum of probabilities */}
      {items.length > 0 && Math.abs(totalProbability - 1) >= 0.0001 && (
        <IonText color="danger">
          <p style={{ margin: "4px 16px" }}>
            Total probability of added jobs is {totalProbability.toFixed(2)}. It
            must equal 1.
          </p>
        </IonText>
      )}

      {/* List of added jobs with remove buttons */}
      {items.length > 0 && (
        <>
          <IonListHeader>
            <IonLabel>Jobs List</IonLabel>
          </IonListHeader>
          {items.map((j, i) => (
            <IonItem key={i}>
              <IonLabel>
                {`CPU: ${j.cpu}, MEM: ${j.mem}, HDD: ${j.hdd}, Prob: ${j.probability}`}
              </IonLabel>
              <IonButton
                disabled={readOnly}
                color="danger"
                onClick={() => onRemove(i)}
              >
                Remove
              </IonButton>
            </IonItem>
          ))}
        </>
      )}
    </IonList>
  );
}
