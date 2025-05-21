export interface Job {
  cpu: number;
  mem: number;
  hdd: number;
  probability: number;
}
export interface JobDistribution {
  initial_time: number;
  final_time: number;
  probability: number;
}
export interface Server {
  cpu: number;
  mem: number;
  hdd: number;
  availability: string;
}
export interface SimulationData {
  name: string;
  time: number;
  exec_time: number;
  seed_users?: number;
  seed_servers?: number;
  type_exec: number;
  type_placement: number;
}

export interface CreateSimulationPayload {
    formData: SimulationData;
    possibleJobs: Job[];
    jobDistributions: JobDistribution[];
    servers: Server[];
}