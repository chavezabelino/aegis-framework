#!/usr/bin/env node
/**
 * Aegis Outcome Recorder
 * Usage:
 *   echo '{"agent":"cursor","model":"whatever","prompt":"...","output":"..."}' | node tools/ci/record-outcome.mjs --mode standard
 * or
 *   node tools/ci/record-outcome.mjs --from file.json --mode full
 *
 * Writes:
 *   ./aegis/outcomes/YYYYMMDD/<sessionId>/<stepId>.jsonl   (append)
 *   ./aegis/outcomes/YYYYMMDD/<sessionId>/<stepId>.md      (overwrite)
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { OutcomeRecordSchema, OutcomeModeSchema, sha256, computeBundleHash } from "./outcomes/schema.mjs";
import { writeJSONL, writeMarkdown } from "./outcomes/writers.mjs";

function nowIso() { return new Date().toISOString(); }
function yyyymmdd() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
}

function parseArgs(argv) {
  const out = { mode: process.env.AEGIS_OUTCOME_MODE || "standard", from: null };
  for (let i=2;i<argv.length;i++) {
    const a = argv[i];
    if (a === "--mode") out.mode = argv[++i];
    else if (a === "--from") out.from = argv[++i];
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function usage() {
  console.log(`Aegis Outcome Recorder
Options:
  --mode lite|standard|full|forensic
  --from <path>   Read structured JSON input from file (otherwise read stdin)

Input JSON shape (minimal):
{
  "aegisVersion": "v2.6.0",
  "sessionId": "sess-123",
  "stepId": "step-1",
  "agent": { "name": "cursor", "model": "claude-3.5" },
  "prompt": { "user": "YOUR PROMPT TEXT" },
  "output": { "text": "MODEL OUTPUT" },
  "outcomes": { "summary": "what happened", "verdict": "success" },
  "artifacts": [{ "path":"src/file.ts","kind":"file_modified","sha256":"...","bytes":123 }],
  "diffs": [{ "path": "src/file.ts", "summary": "+20/-3 lines; functions x,y" }],
  "tools": [{ "name":"pnpm","version":"9.0.0","ok":true,"notes":"build passed" }],
  "env": { "repo":"aegis-framework","branch":"feat/outcomes","commit":"abc123" }
}`);
}

async function readInput(from) {
  if (from) return JSON.parse(await readFile(from, "utf8"));
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(raw);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) return usage();

  const raw = await readInput(args.from);
  const modeParse = OutcomeModeSchema.safeParse(args.mode);
  if (!modeParse.success) throw new Error(`Invalid --mode "${args.mode}"`);

  const promptStr = (raw.prompt?.user ?? "") + (raw.prompt?.system ?? "");
  const outputStr = (raw.output?.text ?? "");
  const record = {
    aegisVersion: raw.aegisVersion ?? "v2.6.0",
    policyVersion: raw.policyVersion ?? "v1",
    mode: modeParse.data,
    sessionId: raw.sessionId ?? "sess-" + Date.now(),
    stepId: raw.stepId ?? "step-1",
    timestamp: raw.timestamp ?? nowIso(),
    agent: raw.agent ?? { name: "unknown" },
    prompt: {
      system: raw.prompt?.system,
      user: raw.prompt?.user,
      filesReferenced: raw.prompt?.filesReferenced ?? [],
      promptSha256: raw.prompt?.promptSha256 ?? sha256(promptStr),
    },
    output: {
      text: raw.output?.text,
      outputSha256: raw.output?.outputSha256 ?? sha256(outputStr),
      tokensIn: raw.output?.tokensIn,
      tokensOut: raw.output?.tokensOut,
      latencyMs: raw.output?.latencyMs,
    },
    outcomes: raw.outcomes ?? { summary: "no summary", verdict: "partial" },
    artifacts: (raw.artifacts ?? []).map(a => ({
      ...a,
      sha256: a.sha256, // must be provided or computed upstream
    })),
    tools: raw.tools ?? [],
    diffs: raw.diffs ?? [],
    env: raw.env,
    integrity: { bundleSha256: "pending" },
  };

  record.integrity.bundleSha256 = computeBundleHash(record);

  // Validate final shape
  const parsed = OutcomeRecordSchema.parse(record);

  const day = yyyymmdd();
  const baseDir = join(process.cwd(), "aegis", "outcomes", day, parsed.sessionId);
  const jsonl = `${parsed.stepId}.jsonl`;
  const md = `${parsed.stepId}.md`;

  const jsonlPath = await writeJSONL(baseDir, jsonl, parsed);
  const mdPath = await writeMarkdown(baseDir, md, parsed);

  console.log(JSON.stringify({ ok: true, jsonlPath, mdPath }, null, 2));
}

main().catch(err => {
  console.error(JSON.stringify({ ok:false, error: err.message }, null, 2));
  process.exit(1);
});
