#!/bin/bash

# List of script paths (relative paths)
scripts=(
    "./Persistence/start.sh"
    "./Logic/run.sh"
)

# Save the current working directory
original_dir="$(pwd)"

run_script() {
    script_path="$1"
    script_dir="$(dirname "$script_path")"

    echo "Running $script_path in $script_dir..."
    
    # Change to script directory, run the script, then return to original directory
    (cd "$script_dir" && bash "$(basename "$script_path")")
    
    # Restore working directory
    cd "$original_dir"
}

# Loop through scripts and execute them
for script in "${scripts[@]}"; do
    run_script "$script"
done

