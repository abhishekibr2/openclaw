#!/bin/bash

# Navigate to the target repository
cd /root/.openclaw/

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository at $(pwd)"
    exit 1
fi

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected, performing backup commit..."
    
    # Remove any nested .git directories (convert submodules to regular directories)
    find . -mindepth 2 -name ".git" -type d ! -path "./.git/*" -exec rm -rf {} + 2>/dev/null
    
    # Add all changes
    git add -A
    
    # Get current date and time for commit message
    datetime=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Commit with timestamp
    if git commit -m "Backup commit ${datetime}"; then
        echo "Committed changes at ${datetime}"
        
        # Push to main branch
        if git push origin main; then
            echo "Backup completed successfully at ${datetime}"
        else
            echo "Git push failed"
            # Get the error details
            error_details=$(git push origin main 2>&1)
            echo "ERROR: $error_details"
            exit 1
        fi
    else
        echo "Nothing to commit, working tree clean"
    fi
else
    echo "No changes to commit, skipping backup."
fi