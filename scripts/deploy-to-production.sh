#!/bin/bash
#
# Miscellany Deploy to Production Script
# Called by n8n when content is approved (Fizzy card closed or Mattermost approval)
#
# Usage: ./deploy-to-production.sh
# Returns: JSON with status and details
#
# Environment variables (optional):
#   MISCELLANY_REPO - Path to nm-static/miscellany repo (default: ~/repos/nm-static/miscellany)
#

set -e

MISCELLANY_REPO="${MISCELLANY_REPO:-$HOME/repos/nm-static/miscellany}"
PRODUCTION_URL="https://miscellany.neeldhara.courses"

# Colors for terminal output (disabled in non-interactive mode)
if [ -t 1 ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  NC='\033[0m'
else
  RED=''
  GREEN=''
  YELLOW=''
  NC=''
fi

log() {
  echo -e "${GREEN}[DEPLOY]${NC} $1" >&2
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Output JSON result
output_json() {
  local status="$1"
  local message="$2"
  local commit_hash="$3"

  cat << EOF
{
  "status": "$status",
  "message": "$message",
  "commit": "$commit_hash",
  "production_url": "$PRODUCTION_URL",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
}

# Check prerequisites
check_prereqs() {
  if [ ! -d "$MISCELLANY_REPO" ]; then
    error "Miscellany repo not found at $MISCELLANY_REPO"
    output_json "error" "Miscellany repo not found" ""
    exit 1
  fi
}

# Merge staging to main
merge_to_main() {
  log "Merging staging to main..."
  cd "$MISCELLANY_REPO"

  # Fetch latest
  git fetch origin >&2

  # Checkout main and pull
  git checkout main >&2
  git pull origin main >&2

  # Check if staging has changes not in main
  local staging_ahead=$(git rev-list --count main..origin/staging)

  if [ "$staging_ahead" -eq 0 ]; then
    log "Staging has no new commits to merge"
    output_json "no_changes" "Staging is already merged into main" ""
    return 0
  fi

  log "Staging is $staging_ahead commit(s) ahead of main"

  # Merge staging into main
  git merge origin/staging --no-edit -m "Merge staging: content update $(date +%Y-%m-%d)" >&2

  local commit_hash=$(git rev-parse --short HEAD)

  # Push to main
  log "Pushing to main..."
  git push origin main >&2

  log "Successfully deployed commit $commit_hash to production"
  output_json "success" "Deployed to production" "$commit_hash"
}

# Main execution
main() {
  log "Starting deploy to production..."
  log "Miscellany repo: $MISCELLANY_REPO"

  check_prereqs
  merge_to_main
}

main "$@"
