#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-install}"
HOOK_SRC="tools/hooks/pre-commit"
HOOK_DST=".git/hooks/pre-commit"

if [[ "${MODE}" == "install" ]]; then
  if [[ ! -d ".git/hooks" ]]; then
    echo "Not a git repository (missing .git/hooks)"; exit 1
  fi
  chmod +x "${HOOK_SRC}"
  cp "${HOOK_SRC}" "${HOOK_DST}"
  chmod +x "${HOOK_DST}"
  echo "✔ Pre-commit hook installed at ${HOOK_DST}"
elif [[ "${MODE}" == "uninstall" ]]; then
  if [[ -f "${HOOK_DST}" ]]; then
    rm -f "${HOOK_DST}"
    echo "✔ Pre-commit hook removed from ${HOOK_DST}"
  else
    echo "No pre-commit hook to remove."
  fi
else
  echo "Usage: $0 [install|uninstall]"; exit 2
fi
