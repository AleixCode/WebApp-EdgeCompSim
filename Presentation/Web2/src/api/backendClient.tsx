// src/api/backendClient.ts
import { CreateSimulationPayload } from "../interfaces";
  
  // Base URL of your API
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
  
  /**
   * Create a new simulation on the server.
   */
  export async function createSimulation(payload: CreateSimulationPayload) {
    const newPayload = transformPayload(payload)
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPayload),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`createSimulation failed: ${errorText}`);
    }
    return res.json(); // or whatever your API returns
  }
  
  /**
   * Fetch a list of simulations.
   */
  export async function getSimulations() {
    const res = await fetch(`${API_BASE}/simulations`);
    if (!res.ok) {
      throw new Error('getSimulations failed');
    }
    return res.json();
  }




  function transformPayload(input: any): any {
    const { formData, possibleJobs, jobDistributions, servers } = input;
  
    const availabilityMap: Record<string, string> = {
      Low: 'L',
      Medium: 'M',
      High: 'H',
    };
  
    return {
      ...formData,
      possible_jobs: possibleJobs,
      job_distributions: jobDistributions,
      servers: servers.map(s => ({
        ...s,
        availability: availabilityMap[s.availability] || s.availability
      }))
    };
  }
  
  
  // You can add more endpoints here...
  // export async function deleteSimulation(id: string) { ... }
  // export async function updateSimulation(...) { ... }
  