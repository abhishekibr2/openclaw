#!/bin/bash

# Reporter helper script to fetch reports from Supabase
# within a given time range (and optional report type).

# Change to repo root so paths match other scripts
cd "$(dirname "$0")/.."

# Usage:
#   ./workspace-reporter/fetch_reports.sh <startIso> <endIso> [reportType]
#
# Examples:
#   ./workspace-reporter/fetch_reports.sh "2026-02-10T00:00:00.000Z" "2026-02-10T23:59:59.999Z"
#   ./workspace-reporter/fetch_reports.sh "2026-02-01T00:00:00.000Z" "2026-02-29T23:59:59.999Z" daily

START_TIME="$1"
END_TIME="$2"
REPORT_TYPE="$3"

if [ -z "$START_TIME" ] || [ -z "$END_TIME" ]; then
  echo "Usage: $0 <startIso> <endIso> [reportType]"
  exit 1
fi

./scripts/fetch_reports.sh "$START_TIME" "$END_TIME" "$REPORT_TYPE"

