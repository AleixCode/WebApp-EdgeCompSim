import os

# Creates all the directories names
def get_directories(sim_id):
    base_dir = f"./app/Simulations/{sim_id}"
    input_dir = os.path.join(base_dir, "inputs")
    output_dir = os.path.join(base_dir, "outputs")
    test_dir = os.path.join(base_dir, "tests")
    return base_dir, input_dir, output_dir, test_dir