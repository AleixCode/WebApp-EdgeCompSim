from typing import List

class Server:
    def __init__(self, cpu: int, mem: int, hdd: int, availability: str):
        self.cpu: int = cpu
        self.mem: int = mem
        self.hdd: int = hdd
        self.availability: str = availability

    def to_dict(self):
        return {
            "cpu": self.cpu,
            "mem": self.mem,
            "hdd": self.hdd,
            "availability": self.availability
        }


class JobDistribution:
    def __init__(self, initial_time: int, final_time: int, probability: float):
        self.initial_time: int = initial_time
        self.final_time: int = final_time
        self.probability: float = probability

    def to_dict(self):
        return {
            "initial_time": self.initial_time,
            "final_time": self.final_time,
            "probability": self.probability
        }


class PossibleJob:
    def __init__(self, cpu: int, mem: int, hdd: int, probability: float):
        self.cpu: int = cpu
        self.mem: int = mem
        self.hdd: int = hdd
        self.probability: float = probability

    def to_dict(self):
        return {
            "cpu": self.cpu,
            "mem": self.mem,
            "hdd": self.hdd,
            "probability": self.probability
        }


class Simulation:
    def __init__(
        self,
        sim_id: int,
        name: str,
        time: int,
        exec_time: int,
        seed_users: int,
        seed_servers: int,
        type_exec: int,
        type_placement: int,
        possible_jobs: List[PossibleJob],
        job_distributions: List[JobDistribution],
        servers: List[Server],
    ):
        self.id: int = sim_id
        self.name: str = name
        self.time: int = time
        self.exec_time: int = exec_time
        self.seed_users: int = seed_users
        self.seed_servers: int = seed_servers
        self.type_exec: int = type_exec
        self.type_placement: int = type_placement
        self.possible_jobs: List[PossibleJob] = possible_jobs
        self.job_distributions: List[JobDistribution] = job_distributions
        self.servers: List[Server] = servers

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "time": self.time,
            "exec_time": self.exec_time,
            "seed_users": self.seed_users,
            "seed_servers": self.seed_servers,
            "type_exec": self.type_exec,
            "type_placement": self.type_placement,
            "possible_jobs": [job.to_dict() for job in self.possible_jobs],
            "job_distributions": [dist.to_dict() for dist in self.job_distributions],
            "servers": [server.to_dict() for server in self.servers]
        }

        
# Function to create Simulation from JSON
def create_simulation_from_json(data: dict) -> Simulation:
    # Create PossibleJob instances from JSON data
    possible_jobs = [
        PossibleJob(cpu=job['cpu'], mem=job['mem'], hdd=job['hdd'], probability=job['probability'])
        for job in data.get('possible_jobs', [])
    ]
    
    # Create JobDistribution instances from JSON data
    job_distributions = [
        JobDistribution(initial_time=dist['initial_time'], final_time=dist['final_time'], probability=dist['probability'])
        for dist in data.get('job_distributions', [])
    ]
    
    # Create Server instances from JSON data
    servers = [
        Server(cpu=server['cpu'], mem=server['mem'], hdd=server['hdd'], availability=server['availability'])
        for server in data.get('servers', [])
    ]
    
    # Create the Simulation instance
    simulation = Simulation(
        sim_id=data['sim_id'],
        name=data['name'],
        time=data['time'],
        exec_time=data['exec_time'],
        seed_users=data['seed_users'],
        seed_servers=data['seed_servers'],
        type_exec=data['type_exec'],
        type_placement=data['type_placement'],
        possible_jobs=possible_jobs,
        job_distributions=job_distributions,
        servers=servers
    )
    
    return simulation

def from_dict(data: dict) -> Simulation:
    possible_jobs = [PossibleJob(**job) for job in data["possible_jobs"]]
    job_distributions = [JobDistribution(**dist) for dist in data["job_distributions"]]
    servers = [Server(**server) for server in data["servers"]]
    return Simulation(
        sim_id=data["id"],
        name=data["name"],
        time=data["time"],
        exec_time=data["exec_time"],
        seed_users=data["seed_users"],
        seed_servers=data["seed_servers"],
        type_exec=data["type_exec"],
        type_placement=data["type_placement"],
        possible_jobs=possible_jobs,
        job_distributions=job_distributions,
        servers=servers
    )
