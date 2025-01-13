from Classes import Simulation, Server, JobDistribution, PossibleJob
from run_project import run_project

# Create instances of the classes
possible_jobs = [
    PossibleJob(cpu=2, mem=4, hdd=50, probability=0.5),
    PossibleJob(cpu=1, mem=2, hdd=25, probability=0.5),
]

servers = [
    Server(cpu=8, mem=16, hdd=500, availability="H"),
    Server(cpu=4, mem=8, hdd=250, availability="L"),
]

job_distributions = [
    JobDistribution(initial_time=0, final_time=500, probability=0.7),
    JobDistribution(initial_time=501, final_time=1000, probability=0.3),
]

simulation = Simulation(
    sim_id=1,
    name="TestSimulation",
    time=1000,
    exec_time=500,
    seed_users=10,
    seed_servers=5,
    type_exec=1,
    type_placement=1,
    possible_jobs=possible_jobs,
    jobs_distribution=job_distributions,
    servers=servers,
)

run_project(simulation)

