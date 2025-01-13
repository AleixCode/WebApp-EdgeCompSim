import os
import subprocess
import shutil

# Creates all the directories names
def get_directories(sim_id):
    base_dir = f"./Simulations/{sim_id}"
    input_dir = os.path.join(base_dir, "input")
    output_dir = os.path.join(base_dir, "output")
    test_dir = os.path.join(base_dir, "test")
    return input_dir, output_dir, test_dir

# Gets the input that the simulation needs, creates the directory inside the Simulations with the id, 
# then creates the directories input output and test
def create_directories(directories):
    for directory in directories:
        # Check if the directory exists
        if os.path.exists(directory):
            # Delete the directory and its contents
            shutil.rmtree(directory)

        # Create the directory again, now empty
        os.makedirs(directory)

def create_text_for_input():
    simulation.time servers.size() 0 job_distributions.size() possible_jobs.size() \n

    map_bcn.json Eixample

    for server in servers:
        server.cpu server.mem server.hdd server.availability \n

    None \n

    for job_distribution in job_distributions:

        job_distribution.initial_time job_distribution.final_time job_distribution.probability \n

    for possible_job in possible_jobs:
        possible_job.cpu possible_job.mem possible_job.hdd possible_job.probability \n

def create_text_for_test():
    simulation.name simulation.exec_time simulation.seed_users simulation.seed_servers 0 simulation.type_placement ???


#Creates the input and test file needed for the execution in the
def create_files_with_input(simulation, servers, job_distributions, possible_jobs, input_dir, output_dir, test_dir):
    # write on input_dir with name simulation.name_input.txt
    text_for_input = ""
    # write on output_dir with name tests2Run.txt
    text_for_test  = ""
    


# Runs the docker script which is gonna run the simulation
def execute_docker_script(input_dir, output_dir, test_dir):
    # Define the path to your script
    script_path = "./run_project.sh"
    
    # Construct the command
    run_docker_command = [script_path, input_dir, output_dir, test_dir]
    try:
        # Run the script
        subprocess.run(run_docker_command, check=True)
    except subprocess.CalledProcessError as e:
        print("Error while executing the script:", e.stderr)
        raise

# Pre: Dona per suposat que tots els inputs son correctes i no fa cap comprobacio
def run_project(simulation, servers, job_distributions, possible_jobs):

    input_dir, output_dir, test_dir = get_directories(simulation.id)

    create_directories([input_dir, output_dir, test_dir])

    create_files_with_input(simulation, servers, job_distributions, possible_jobs, input_dir, output_dir, test_dir)

    execute_docker_script(input_dir, output_dir, test_dir)