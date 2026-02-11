#!/bin/bash

# Change to the reporter supabase directory
cd "$(dirname "$0")/supabase"

# Usage:
#   ./insert_report.sh <reportType> "<content>" [metadataJson]
#
# Examples:
#   ./insert_report.sh daily "Daily report content"
#   ./insert_report.sh task "Task report for XYZ" '{"taskId":"123","status":"completed"}'

node insert-report.js "$@"

