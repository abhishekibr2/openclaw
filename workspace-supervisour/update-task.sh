#!/bin/bash

# Update Task Status - Supervisor Agent Helper Script
# Wrapper for easy task status updates from the Supervisor

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="$SCRIPT_DIR/supabase/update-task-status.js"

# Check if task ID provided
if [ -z "$1" ]; then
  echo "Usage: ./update-task.sh <taskId> [status] [message]"
  echo ""
  echo "Arguments:"
  echo "  taskId   - Task ID to update (required)"
  echo "  status   - New status: completed, done, or failed (default: completed)"
  echo "  message  - Result message for completed/done, or error for failed"
  echo ""
  echo "Examples:"
  echo "  ./update-task.sh 27fd3f9b-... completed \"Task finished successfully\""
  echo "  ./update-task.sh 27fd3f9b-... done \"Comment posted\""
  echo "  ./update-task.sh 27fd3f9b-... failed \"Login required\""
  exit 1
fi

# Run the Node.js script with all arguments
node "$NODE_SCRIPT" "$@"
