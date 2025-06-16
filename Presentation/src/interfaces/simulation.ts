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
export interface GeneralSimulationData {
  name: string;
  time: number;
  exec_time: number;
  seed_users: number;
  seed_servers: number;
  type_exec: number;
  type_placement: number;
}

export interface SimulationData extends GeneralSimulationData {
  id: string;
  status: Status;
  possible_jobs: Job[];
  job_distributions: JobDistribution[];
  servers: Server[];
}

export interface ResultsSimulationData extends SimulationData {
  results?: string;
  logs?: string;
}

export interface CreateSimulationPayload {
  formData: GeneralSimulationData;
  possibleJobs: Job[];
  jobDistributions: JobDistribution[];
  servers: Server[];
}

type Status = "Pending" | "Running" | "Finished";
