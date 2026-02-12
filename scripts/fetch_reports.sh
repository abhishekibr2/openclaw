#!/bin/bash

# Wrapper script to fetch reports from Supabase within a time range,
# optionally filtered by report type.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="$SCRIPT_DIR/../supabase/fetch-reports.js"

# Usage:
#   ./fetch_reports.sh <startIso> <endIso> [reportType]
#
# Examples:
#   ./fetch_reports.sh "2026-02-10T00:00:00.000Z" "2026-02-10T23:59:59.999Z"
#   ./fetch_reports.sh "2026-02-01T00:00:00.000Z" "2026-02-29T23:59:59.999Z" daily

START_TIME="$1"
END_TIME="$2"
REPORT_TYPE="$3"

if [ -z "$START_TIME" ] || [ -z "$END_TIME" ]; then
  echo "Usage: $0 <startIso> <endIso> [reportType]"
  exit 1
fi

node "$NODE_SCRIPT" "$START_TIME" "$END_TIME" "$REPORT_TYPE"

