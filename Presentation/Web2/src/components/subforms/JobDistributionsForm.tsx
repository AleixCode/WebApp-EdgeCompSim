import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonList,
  IonListHeader,
} from "@ionic/react";

export interface JobDistribution {
  initial_time: number;
  final_time: number;
  probability: number;
}

interface Props {
  simulationTime: number;
  items: JobDistribution[];
  onAdd: (dist: JobDistribution) => void;
  onRemove: (index: number) => void;
  onValidChange: (isValid: boolean) => void;
}

export default function JobDistributionsForm({
  simulationTime,
  items,
  onAdd,
  onRemove,
  onValidChange,
}: Props) {
  // Local state: store inputs as strings so that the form starts empty.
  const [localInitial, setLocalInitial] = useState("");
  const [localFinal, setLocalFinal] = useState("");
  const [localProb, setLocalProb] = useState("");

  // Track if a field has been touched (so errors only show after interaction)
  const [touched, setTouched] = useState({
    initial: false,
    final: false,
    prob: false,
  });

  // --- Field-level validations (display error below the corresponding input) ---

  // Initial Time errors.
  let initialError = "";
  if (touched.initial && localInitial.trim() === "") {
    initialError = "Initial time is required.";
  } else if (touched.initial && Number(localInitial) < 0) {
    initialError = "Initial time must be at least 0.";
  } else if (touched.initial && Number(localInitial) > simulationTime) {
    initialError = `Initial time must be at most lower than ${
      simulationTime ? simulationTime : "the simulation time"
    }.`;
  }

  // Final Time errors.
  let finalError = "";
  if (touched.final && localFinal.trim() === "") {
    finalError = "Final time is required.";
  } else if (touched.final && Number(localFinal) > simulationTime) {
    finalError = `Final time must be at most ${
      simulationTime ? simulationTime : "the simulation time"
    }.`;
  } else if (
    touched.final &&
    localInitial.trim() !== "" &&
    Number(localFinal) <= Number(localInitial)
  ) {
    finalError = "Final time must be greater than initial time.";
  }

  // Probability errors.
  let probError = "";
  if (touched.prob && localProb.trim() === "") {
    probError = "Jobs per minute is required.";
  } else if (touched.prob && Number(localProb) <= 0) {
    probError = "Jobs per minute must be bigger than 0.";
  }

  // New distribution is valid if all fields are non-empty and pass the tests.
  const isLocalValid =
    localInitial.trim() !== "" &&
    localFinal.trim() !== "" &&
    localProb.trim() !== "" &&
    Number(localInitial) >= 0 &&
    Number(localFinal) <= simulationTime &&
    Number(localFinal) > Number(localInitial) &&
    Number(localProb) >= 0;

  // --- Global validations over the added distributions (items) ---
  const globalErrors: string[] = [];
  if (items.length > 0) {
    // Sort distributions by initial_time.
    const sorted = [...items].sort((a, b) => a.initial_time - b.initial_time);

    if (sorted[0].initial_time !== 0) {
      globalErrors.push("Distributions must start at time 0.");
    }

    // Check for consecutive intervals with no gaps/overlaps.
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].final_time !== sorted[i + 1].initial_time) {
        globalErrors.push("Distributions must not have gaps or overlaps.");
        break; // one error is sufficient.
      }
    }

    if (sorted[sorted.length - 1].final_time !== simulationTime) {
      globalErrors.push(`Distributions must end exactly at ${simulationTime}.`);
    }
  } else {
    // If no distributions added yet, the form is incomplete.
    globalErrors.push("At least one distribution is required.");
  }

  // The overall (global) validity of the distributions subform depends entirely on the list.
  const isGlobalValid = items.length > 0 && globalErrors.length === 0;

  // Inform the parent about global validity.
  useEffect(() => {
    onValidChange(isGlobalValid);
  }, [isGlobalValid, items]);

  // --- Handlers ---
  const handleAdd = () => {
    // Mark all fields as touched so that errors (if any) are displayed.
    setTouched({ initial: true, final: true, prob: true });
    if (!isLocalValid) return;

    const newDistribution: JobDistribution = {
      initial_time: Number(localInitial),
      final_time: Number(localFinal),
      probability: Number(localProb),
    };
    onAdd(newDistribution);
    // Reset the form after a successful add.
    setLocalInitial("");
    setLocalFinal("");
    setLocalProb("");
    setTouched({ initial: false, final: false, prob: false });
  };

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Add Job Distribution</IonLabel>
      </IonListHeader>

      {/* Input for Initial Time */}
      <IonItem>
        <IonLabel position="stacked">Initial Time</IonLabel>
        <IonInput
          type="number"
          value={localInitial}
          placeholder="Enter initial time"
          onIonInput={(e) => setLocalInitial(e.detail.value!)}
          onIonBlur={() => setTouched((prev) => ({ ...prev, initial: true }))}
        />
      </IonItem>
      {initialError && <ErrorText text={initialError} />}

      {/* Input for Final Time */}
      <IonItem>
        <IonLabel position="stacked">Final Time</IonLabel>
        <IonInput
          type="number"
          value={localFinal}
          placeholder="Enter final time"
          onIonInput={(e) => setLocalFinal(e.detail.value!)}
          onIonBlur={() => setTouched((prev) => ({ ...prev, final: true }))}
        />
      </IonItem>
      {finalError && <ErrorText text={finalError} />}

      {/* Input for Jobs per minute */}
      <IonItem>
        <IonLabel position="stacked">Jobs per minute</IonLabel>
        <IonInput
          type="number"
          value={localProb}
          placeholder="Enter Jobs per minute must be bigger or equal than 0"
          onIonInput={(e) => setLocalProb(e.detail.value!)}
          onIonBlur={() => setTouched((prev) => ({ ...prev, prob: true }))}
        />
      </IonItem>
      {probError && <ErrorText text={probError} />}

      {/* Button to add the distribution */}
      <IonButton expand="full" onClick={handleAdd} disabled={!isLocalValid}>
        Add Distribution
      </IonButton>

      {/* Display any global errors (applied to the whole distributions list) */}
      {globalErrors.length > 0 && (
        <IonText color="danger">
          {globalErrors.map((err, idx) => (
            <p key={idx} style={{ margin: "4px 16px" }}>
              {err}
            </p>
          ))}
        </IonText>
      )}

      {/* Display the list of added distributions with a remove button */}
      {items.length > 0 && (
        <>
          <IonListHeader>
            <IonLabel>Distributions List</IonLabel>
          </IonListHeader>
          {items.map((d, i) => (
            <IonItem key={i}>
              <IonLabel>
                [{d.initial_time} – {d.final_time}] Jobs per minute:{" "}
                {d.probability}
              </IonLabel>
              <IonButton color="danger" onClick={() => onRemove(i)}>
                Remove
              </IonButton>
            </IonItem>
          ))}
        </>
      )}
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
