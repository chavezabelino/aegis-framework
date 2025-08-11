#!/usr/bin/env bash
set -euo pipefail

BASELINE_PATH=".aegis/baselines/types.baseline.txt"
CURRENT_RAW=".aegis/tmp/types.raw.txt"
CURRENT_PATH=".aegis/tmp/types.txt"

mkdir -p .aegis/baselines .aegis/tmp

# 1) Generate current errors (do not fail build here)
pnpm types > "${CURRENT_RAW}" 2>&1 || true

# 2) Strip ANSI for stable diffs
sed -r 's/\x1B\[[0-9;]*[mK]//g' "${CURRENT_RAW}" > "${CURRENT_PATH}"

# 3) Initialize baseline if absent
if [[ ! -f "${BASELINE_PATH}" ]]; then
  echo "No TS baseline found. Creating baseline at ${BASELINE_PATH}"
  cp "${CURRENT_PATH}" "${BASELINE_PATH}"
  exit 0
fi

# 4) Normalize to canonical keys: file:line:col
norm() {
  # Matches: "path/file.tsx:12:34 - error TS1234: ..."
  sed -n 's/.*\(.*\.ts[x]*\):\([0-9]\+\):\([0-9]\+\) - error TS[0-9]\+: .*/\1:\2:\3/p' "$1" \
    | sort -u
}

# 5) Compute new errors vs baseline
comm -13 <(norm "${BASELINE_PATH}") <(norm "${CURRENT_PATH}") > .aegis/tmp/types.new.diff || true

if [[ -s .aegis/tmp/types.new.diff ]]; then
  echo "❌ New TS errors detected (not in baseline):"
  cat .aegis/tmp/types.new.diff
  echo
  echo "Tip: Fix or (sparingly) refresh the baseline AFTER intentional refactors:"
  echo "cp ${CURRENT_PATH} ${BASELINE_PATH}"
  exit 1
else
  echo "✅ No new TS errors beyond baseline."
fi
