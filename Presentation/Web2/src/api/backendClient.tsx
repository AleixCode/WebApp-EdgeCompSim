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
  const res = await fetchWithRefresh(`${API_BASE}/simulations`, {
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
  const res = await fetchWithRefresh(`${API_BASE}/simulations/${simId}/run`, {
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
  const res = await fetchWithRefresh(`${API_BASE}/simulations/${id}`, {
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
  const payload = transformUpdatePayload(data);
  const res = await fetchWithRefresh(`${API_BASE}/simulations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
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
  const res = await fetchWithRefresh(`${API_BASE}/simulations/${id}`, {
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

function transformUpdatePayload(input: any): any {
  const output: any = {};

  if (input.formData) {
    Object.assign(output, input.formData);
  }

  if (input.possibleJobs) {
    output.possible_jobs = input.possibleJobs;
  }

  if (input.jobDistributions) {
    output.job_distributions = input.jobDistributions;
  }

  if (input.servers) {
    const availabilityMap: Record<string, string> = {
      Low: "L",
      Medium: "M",
      High: "H",
    };

    output.servers = input.servers.map((s: any) => ({
      ...s,
      availability: availabilityMap[s.availability] || s.availability,
    }));
  }

  return output;
}

// src/api.ts
export async function fetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  // First attempt:
  let resp = await fetch(input, {
    ...init,
    credentials: "include", // always include cookies
  });

  if (resp.status === 401) {
    // 1) access_token expired → call /api/refresh to get a new access_token
    const r = await fetch("http://localhost:5000/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!r.ok) {
      // both tokens are now invalid (e.g. refresh also expired). Force logout.
      throw new Error("Authentication expired");
    }
    // new access_token cookie is set automatically in the response
    // 2) retry the original request:
    resp = await fetch(input, {
      ...init,
      credentials: "include",
    });
    return resp;
  }

  return resp;
}

// You can add more endpoints here...
// export async function deleteSimulation(id: string) { ... }
// export async function updateSimulation(...) { ... }
