import os

# Creates all the directories names
def get_directories(sim_id):
    base_dir = f"./app/Simulations/{sim_id}"
    input_dir = os.path.join(base_dir, "inputs")
    output_dir = os.path.join(base_dir, "outputs")
    test_dir = os.path.join(base_dir, "tests")
    return base_dir, input_dir, output_dir, test_dir

def parse_results(sim_id, sim_name):
    # Parse logs.txt
    output_filename = f"{sim_name}_output_.txt"
    statistics_filename = f"{sim_name}_statistics_.txt"
    output_path = os.path.abspath(f"./app/Simulations/{sim_id}/outputs/{output_filename}")
    statistics_path = os.path.abspath(f"./app/Simulations/{sim_id}/outputs/{statistics_filename}")

    logs = []
    with open(output_path, 'r') as logs_file:
        # Skip the header
        header = logs_file.readline().strip().split(',')
        for line in logs_file:
            values = line.strip().split(',')
            log_entry = dict(zip(header, values))
            logs.append(log_entry)
    
    # Parse result.txt
    with open(statistics_path, 'r') as results_file:
        # Read the header and values
        header = results_file.readline().strip().split(';')
        values = results_file.readline().strip().split(';')
        results = dict(zip(header, values))
    
    return logs, results