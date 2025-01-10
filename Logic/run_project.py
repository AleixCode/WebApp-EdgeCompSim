import os
import subprocess

# Gets the input that the simulation needs, creates the directory inside the Simulations with the id, 
# then creates the directories input output and test
def create_directories(sim_id):

#Creates the input and test file needed for the execution in the
def create_files_with_input(sim_id, servers, job_distributions, possible_jobs):
    

def execute_docker_script(sim_id):
    base_dir = f"./Simulations/{sim_id}"
    input_dir = os.path.join(base_dir, "input")
    output_dir = os.path.join(base_dir, "output")
    test_dir = os.path.join(base_dir, "test")

    # Ensure directories exist
    if not os.path.isdir(input_dir):
        raise ValueError(f"Input directory does not exist: {input_dir}")
    if not os.path.isdir(output_dir):
        raise ValueError(f"Output directory does not exist: {output_dir}")
    if not os.path.isdir(test_dir):
        raise ValueError(f"Test directory does not exist: {test_dir}")

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

def run_project():
    create_directories
    create_files_with_input
    execute_docker_script