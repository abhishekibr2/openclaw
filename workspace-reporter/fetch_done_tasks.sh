#!/bin/bash

# Change to the reporter supabase directory
cd "$(dirname "$0")/supabase"

# Usage:
#   ./fetch_done_tasks.sh <startIso> <endIso>
#
# Example:
#   ./fetch_done_tasks.sh "2026-02-10T00:00:00.000Z" "2026-02-10T23:59:59.999Z"

START_TIME="$1"
END_TIME="$2"

if [ -z "$START_TIME" ] || [ -z "$END_TIME" ]; then
  echo "Usage: $0 <startIso> <endIso>"
  exit 1
fi

node -e "const { fetchDoneTasksInRange } = require('./fetch-done-tasks'); fetchDoneTasksInRange('$START_TIME', '$END_TIME').then(tasks => console.log(JSON.stringify(tasks, null, 2))).catch(err => { console.error(err); process.exit(1); });"

