// src/api/backendClient.ts
import { CreateSimulationPayload } from "../interfaces";
import { useAuth } from "../contexts/AuthContext";

// Base URL of your API
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/**
 * Create a new simulation on the server.
 * Optionally accepts a callback function to update user data after a successful API call.
 */
export async function createSimulation(
  payload: CreateSimulationPayload,
  onSuccessUpdateUserData?: () => Promise<void>
) {
  const newPayload = transformPayload(payload);
  const res = await fetch(`${API_BASE}/simulations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPayload),
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`createSimulation failed: ${errorText}`);
  }

  const result = await res.json(); // or whatever your API returns

  // If a callback was provided, call it to refresh user data
  if (onSuccessUpdateUserData) {
    await onSuccessUpdateUserData();
  }

  return result;
}

/**
 * Run a simulation on the server.
 * Also supports an optional callback for updating user data.
 */
export async function runSimulation(
  simId: string,
  onSuccessUpdateUserData?: () => Promise<void>
) {
  const res = await fetch(`${API_BASE}/simulations/${simId}/run`, {
    method: "POST",
    credentials: "include", // important to include cookies for JWT
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`runSimulation failed: ${errorText}`);
  }

  const result = await res.json(); // Should contain task_id and simulation_id

  if (onSuccessUpdateUserData) {
    await onSuccessUpdateUserData();
  }

  return result;
}

/**
 * Get a single simulation by ID
 */
export async function getSimulation(id: string) {
  const res = await fetch(`${API_BASE}/simulations/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Update an existing simulation
 */
export async function updateSimulation(
  id: string,
  data: any,
  onSuccessUpdateUserData?: () => Promise<void>
) {
  const res = await fetch(`${API_BASE}/simulations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());

  const result = await res.json();

  if (onSuccessUpdateUserData) {
    await onSuccessUpdateUserData();
  }

  return result;
}

/**
 * Delete a simulation
 */
export async function deleteSimulation(
  id: string,
  onSuccessUpdateUserData?: () => Promise<void>
) {
  const res = await fetch(`${API_BASE}/simulations/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());

  const result = await res.json();

  if (onSuccessUpdateUserData) {
    await onSuccessUpdateUserData();
  }

  return result;
}

/**
 * Download a file for a simulation
 */
export function downloadFile(simId: string, filename: string) {
  const url = `${API_BASE}/download?sim_id=${encodeURIComponent(
    simId
  )}&filename=${encodeURIComponent(filename)}`;
  window.open(url, "_blank");
}

/**
 * Check DB connection
 */
export async function testDB() {
  const res = await fetch(`${API_BASE}/testdb`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Transform simulation payload
 */
function transformPayload(input: any): any {
  const { formData, possibleJobs, jobDistributions, servers } = input;

  const availabilityMap: Record<string, string> = {
    Low: "L",
    Medium: "M",
    High: "H",
  };

  return {
    ...formData,
    possible_jobs: possibleJobs,
    job_distributions: jobDistributions,
    servers: servers.map((s: any) => ({
      ...s,
      availability: availabilityMap[s.availability] || s.availability,
    })),
  };
}

// You can add more endpoints here...
// export async function deleteSimulation(id: string) { ... }
// export async function updateSimulation(...) { ... }
