#!/usr/bin/env bash
set -euo pipefail

mkdir -p .aegis/tmp .aegis/reports

# 1) Generate fresh types output; keep raw for forensics
pnpm types > .aegis/tmp/types.raw.txt 2>&1 || true

# 2) Strip ANSI to make parsing deterministic (if any)
sed -r 's/\x1B\[[0-9;]*[mK]//g' .aegis/tmp/types.raw.txt > .aegis/tmp/types.txt

# 3) Top offending files (tolerate empty)
{
  echo "Top TS error files:"
  grep -E 'error TS' .aegis/tmp/types.txt 2>/dev/null \
    | cut -d'(' -f1 | sed 's/^[[:space:]]*//' \
    | sort | uniq -c | sort -nr | head -50
} > .aegis/reports/types-top.txt || true

# 4) Count totals (default to 0 if none)
TOTAL_ERRORS=$(grep -cE 'error TS' .aegis/tmp/types.txt 2>/dev/null || true)
TOTAL_ERRORS=${TOTAL_ERRORS:-0}

TOTAL_FILES=$(
  (grep -E 'error TS' .aegis/tmp/types.txt 2>/dev/null \
    | cut -d'(' -f1 | sort -u | wc -l) | tr -d ' '
)
TOTAL_FILES=${TOTAL_FILES:-0}

{
  echo "Total errors: ${TOTAL_ERRORS}"
  echo "Files with errors: ${TOTAL_FILES}"
} > .aegis/reports/types-summary.txt

# 5) Emit quick console view
echo "── TS Errors Summary ──"
cat .aegis/reports/types-summary.txt
echo
echo "── Top Files ──"
head -20 .aegis/reports/types-top.txt || true
