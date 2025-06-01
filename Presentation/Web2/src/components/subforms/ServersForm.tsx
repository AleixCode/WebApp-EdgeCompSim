import React, { useState, useEffect } from "react";
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
} from "@ionic/react";
import type { Server } from "../../interfaces";

interface Props {
  items: Server[];
  onAdd: (server: Server) => void;
  onRemove: (index: number) => void;
  onValidChange: (isValid: boolean) => void;
  readOnly: boolean;
}

export default function ServersForm({
  items,
  onAdd,
  onRemove,
  onValidChange,
  readOnly,
}: Props) {
  // The form fields are stored as strings so that they start empty.
  const initialServer = { cpu: "", mem: "", hdd: "", availability: "" };
  const [srv, setSrv] = useState(initialServer);
  const [quantity, setQuantity] = useState("");

  // Touched state to show errors only after user interaction.
  const [touched, setTouched] = useState({
    cpu: false,
    mem: false,
    hdd: false,
    availability: false,
    quantity: false,
  });

  // --- Field-level error computation ---

  const cpuError =
    touched.cpu && (srv.cpu.trim() === "" || Number(srv.cpu) <= 0)
      ? "CPU must be greater than 0."
      : "";
  const memError =
    touched.mem && (srv.mem.trim() === "" || Number(srv.mem) <= 0)
      ? "Memory must be greater than 0."
      : "";
  const hddError =
    touched.hdd && (srv.hdd.trim() === "" || Number(srv.hdd) <= 0)
      ? "HDD must be greater than 0."
      : "";
  const availabilityError =
    touched.availability && srv.availability.trim() === ""
      ? "Please select an availability level."
      : "";
  const quantityError =
    touched.quantity && quantity.trim() !== "" && Number(quantity) <= 0
      ? "Quantity must be greater than 0."
      : "";

  // The Add button is enabled only when the current input values are valid.
  const isInputValid =
    srv.cpu.trim() !== "" &&
    Number(srv.cpu) > 0 &&
    srv.mem.trim() !== "" &&
    Number(srv.mem) > 0 &&
    srv.hdd.trim() !== "" &&
    Number(srv.hdd) > 0 &&
    srv.availability.trim() !== "" &&
    (quantity.trim() === "" || Number(quantity) > 0);

  // --- onValidChange: report validity based solely on the added data ---
  useEffect(() => {
    // The Servers form is considered valid only when at least one server has been added.
    onValidChange(items.length > 0);
  }, [items]);

  // --- Handlers ---
  const handleAdd = () => {
    // Mark all input fields as touched so that errors (if any) become visible.
    setTouched({
      cpu: true,
      mem: true,
      hdd: true,
      availability: true,
      quantity: true,
    });
    if (!isInputValid) return;

    // Use quantity if specified; default is 1.
    const qty = quantity.trim() === "" ? 1 : Number(quantity);
    console.log("Quantity parsed is = ", qty);
    console.log("Quantity normal is = ", quantity);
    const newServer: Server = {
      cpu: Number(srv.cpu),
      mem: Number(srv.mem),
      hdd: Number(srv.hdd),
      availability: srv.availability,
    };
    for (let i = 0; i < qty; i++) {
      onAdd(newServer);
    }
    // Reset the form inputs and the touched state.
    setSrv(initialServer);
    setQuantity("");
    setTouched({
      cpu: false,
      mem: false,
      hdd: false,
      availability: false,
      quantity: false,
    });
  };

  return (
    <IonList>
      {!readOnly && (
        <>
          <IonListHeader>
            <IonLabel>Add Server</IonLabel>
          </IonListHeader>

          {/* CPU */}
          <IonItem>
            <IonLabel position="stacked">CPU</IonLabel>
            <IonInput
              type="number"
              value={srv.cpu}
              placeholder="Enter CPU"
              onIonInput={(e) =>
                setSrv({ ...srv, cpu: e.detail.value as string })
              }
              onIonBlur={() => setTouched((prev) => ({ ...prev, cpu: true }))}
              disabled={readOnly}
            />
          </IonItem>
          {cpuError && <ErrorText text={cpuError} />}

          {/* Memory */}
          <IonItem>
            <IonLabel position="stacked">Memory</IonLabel>
            <IonInput
              type="number"
              value={srv.mem}
              placeholder="Enter Memory"
              onIonInput={(e) =>
                setSrv({ ...srv, mem: e.detail.value as string })
              }
              onIonBlur={() => setTouched((prev) => ({ ...prev, mem: true }))}
              disabled={readOnly}
            />
          </IonItem>
          {memError && <ErrorText text={memError} />}

          {/* HDD */}
          <IonItem>
            <IonLabel position="stacked">HDD</IonLabel>
            <IonInput
              type="number"
              value={srv.hdd}
              placeholder="Enter HDD"
              onIonInput={(e) =>
                setSrv({ ...srv, hdd: e.detail.value as string })
              }
              onIonBlur={() => setTouched((prev) => ({ ...prev, hdd: true }))}
              disabled={readOnly}
            />
          </IonItem>
          {hddError && <ErrorText text={hddError} />}

          {/* Availability */}
          <IonItem>
            <IonLabel position="stacked">Availability</IonLabel>
            <IonSelect
              value={srv.availability}
              placeholder="Select Availability"
              onIonChange={(e) =>
                setSrv({ ...srv, availability: e.detail.value })
              }
              onIonBlur={() =>
                setTouched((prev) => ({ ...prev, availability: true }))
              }
              disabled={readOnly}
            >
              <IonSelectOption value="High">High Availability</IonSelectOption>
              <IonSelectOption value="Medium">
                Medium Availability
              </IonSelectOption>
              <IonSelectOption value="Low">Low Availability</IonSelectOption>
            </IonSelect>
          </IonItem>
          {availabilityError && <ErrorText text={availabilityError} />}

          {/* Quantity */}
          <IonItem>
            <IonLabel position="stacked">Quantity</IonLabel>
            <IonInput
              type="number"
              value={quantity}
              placeholder="Enter Quantity (default 1)"
              onIonInput={(e) => setQuantity(e.detail.value as string)}
              onIonBlur={() =>
                setTouched((prev) => ({ ...prev, quantity: true }))
              }
              disabled={readOnly}
            />
          </IonItem>
          {quantityError && <ErrorText text={quantityError} />}

          <IonButton
            expand="full"
            onClick={handleAdd}
            disabled={!isInputValid || readOnly}
          >
            Add Server
          </IonButton>
        </>
      )}

      {items.length > 0 && (
        <>
          <IonListHeader>
            <IonLabel>Server List</IonLabel>
          </IonListHeader>
          {items.map((s, i) => (
            <IonItem key={i}>
              <IonLabel>
                CPU: {s.cpu}, MEM: {s.mem}, HDD: {s.hdd}, Availability:{" "}
                {s.availability}
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

function ErrorText({ text }: { text: string }) {
  return (
    <IonText color="danger">
      <p style={{ marginLeft: "16px", marginTop: "4px", fontSize: "0.8em" }}>
        {text}
      </p>
    </IonText>
  );
}
