from typing import List

class Server:
    def __init__(self, cpu: int, mem: int, hdd: int, availability: str):
        self.cpu: int = cpu
        self.mem: int = mem
        self.hdd: int = hdd
        self.availability: str = availability


class JobDistribution:
    def __init__(self, initial_time: int, final_time: int, probability: float):
        self.initial_time: int = initial_time
        self.final_time: int = final_time
        self.probability: float = probability


class PossibleJob:
    def __init__(self, cpu: int, mem: int, hdd: int, probability: float):
        self.cpu: int = cpu
        self.mem: int = mem
        self.hdd: int = hdd
        self.probability: float = probability

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
        jobs_distribution: List[JobDistribution],
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
        
