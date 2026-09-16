#!/usr/bin/env bash
set -euo pipefail

# Creates GitHub repo UniSOLdev/first500 and pushes main branch.
# Requires: gh auth login (or GH_TOKEN env var)

REPO_OWNER="${REPO_OWNER:-UniSOLdev}"
REPO_NAME="${REPO_NAME:-first500}"
VISIBILITY="${VISIBILITY:-private}"

cd "$(dirname "$0")/.."

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated. Run: gh auth login"
  echo "Or set GH_TOKEN with repo scope."
  exit 1
fi

echo "Creating ${REPO_OWNER}/${REPO_NAME} (${VISIBILITY})..."
gh repo create "${REPO_OWNER}/${REPO_NAME}" \
  --"${VISIBILITY}" \
  --source=. \
  --remote=origin \
  --push \
  --description "FIRST \$500 — 7-Day Local Service Business Challenge MVP"

echo ""
echo "Done: https://github.com/${REPO_OWNER}/${REPO_NAME}"
