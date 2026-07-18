#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log_step_start() {
    local step_name="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting: $step_name"
    export STEP_START_TIME
    STEP_START_TIME=$(date +%s)
}

log_step_end() {
    local step_name="${1:-Unknown step}"
    local end_time
    end_time=$(date +%s)
    local duration=$((end_time - STEP_START_TIME))
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Completed: $step_name (${duration}s)"
}

wait_for_service() {
    local host="$1" port="$2" service_name="$3" max_attempts="${4:-60}" attempt=1
    while [ "$attempt" -le "$max_attempts" ]; do
        if curl -s --connect-timeout 2 --max-time 5 "http://$host:$port" >/dev/null 2>&1; then
            echo "$service_name is ready!"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    echo "ERROR: $service_name failed to start"
    return 1
}

cd "$PROJECT_DIR"

log_step_start "db:push"
bun run db:push 2>/dev/null || true
log_step_end "db:push"

log_step_start "Starting production server"
NODE_OPTIONS="--max-old-space-size=512" PORT=3000 HOSTNAME="0.0.0.0" \
  node .next/standalone/server.js &
DEV_PID=$!
log_step_end "Starting production server"

wait_for_service "localhost" "3000" "Production server"

curl -fsS localhost:3000 >/dev/null
echo "Health check passed"

disown "$DEV_PID" 2>/dev/null || true
unset DEV_PID
