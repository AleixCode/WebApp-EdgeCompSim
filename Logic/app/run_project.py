import os
import subprocess
import shutil
from .Classes import Simulation, Server, JobDistribution, PossibleJob

# Creates all the directories names
def get_directories(sim_id):
    base_dir = f"./app/Simulations/{sim_id}"
    input_dir = os.path.join(base_dir, "inputs")
    output_dir = os.path.join(base_dir, "outputs")
    test_dir = os.path.join(base_dir, "tests")
    return base_dir, input_dir, output_dir, test_dir

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

def create_text_for_input(simulation):
    result = f"{simulation.time} {len(simulation.servers)} 0 {len(simulation.job_distributions)} {len(simulation.possible_jobs)}\n" 
    result += "map_bcn.json Eixample\n"

    for server in simulation.servers: 
        result += f"{server.cpu} {server.mem} {server.hdd} {server.availability}\n"

    result += "None\n"
    
    for job_distribution in simulation.job_distributions:
        result += f"{job_distribution.initial_time} {job_distribution.final_time} {job_distribution.probability}\n"
    
    for possible_job in simulation.possible_jobs:
        if possible_job == simulation.possible_jobs[-1]:
            result += f"{possible_job.cpu} {possible_job.mem} {possible_job.hdd} {possible_job.probability}"
        else:
            result += f"{possible_job.cpu} {possible_job.mem} {possible_job.hdd} {possible_job.probability}\n"    
    return result


def create_text_for_test(simulation):
    result = f"{simulation.name} {simulation.exec_time} {simulation.seed_users} {simulation.seed_servers} {simulation.type_exec} 10 map_bcn.json Eixample {simulation.type_placement} 250"
    return result



#Creates the input and test file needed for the execution in the
def create_input(simulation, base_dir, input_dir, test_dir):
    # Get the input text
    text_for_input = create_text_for_input(simulation)
    
    # Get the test text
    text_for_test = create_text_for_test(simulation)
    
    # Define the input file path
    input_file_path = f"{input_dir}/{simulation.name}_input.txt"
    
    # Define the test file path
    test_file_path = f"{test_dir}/tests2Run.txt"
    
    # Write the input text to the input file
    with open(input_file_path, 'w') as input_file:
        input_file.write(text_for_input)
    
    # Write the test text to the test file
    with open(test_file_path, 'w') as test_file:
        test_file.write(text_for_test)

    # Define the source and destination file paths for the geojson file 
    geojson_file_source = f"./app/district.geojson" 
    geojson_file_destination = f"{input_dir}/district.geojson" 
    
    # Check if the geojson file exists before copying
    if os.path.exists(geojson_file_source):
        shutil.copyfile(geojson_file_source, geojson_file_destination)
    else:
        raise FileNotFoundError(f"No such file or directory: '{geojson_file_source}' {base_dir}, {input_dir}, {test_dir}")


# Runs the docker script which is gonna run the simulation
def execute_docker_script(sim_id, input_dir, output_dir, test_dir):
    #subprocess.run("./app/try_docker.sh")
    #return
    # Define the path to your script
    script_path = "app/run_docker.sh"
    
    # Construct the command
    run_docker_command = [script_path, input_dir, output_dir, test_dir, str(sim_id)]
    try:
        # Run the script
        subprocess.run(run_docker_command, check=True, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        print("Error while executing the script:", e.stderr)
        raise

# Pre: Dona per suposat que tots els inputs son correctes i no fa cap comprobacio
def run_project(simulation: Simulation):

    base_dir, input_dir, output_dir, test_dir = get_directories(simulation.id)

    create_directories([input_dir, output_dir, test_dir])

    create_input(simulation, base_dir, input_dir, test_dir)

    execute_docker_script(simulation.id, input_dir, output_dir, test_dir)