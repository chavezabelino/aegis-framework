import { createHash } from "node:crypto";
import { z } from "zod";

/**
 * Outcome Modes
 * - lite: metadata only (short, paste-friendly)
 * - standard: +prompt excerpt and output excerpt
 * - full: +full prompt/output (optionally truncated), file artifacts
 * - forensic: +env snapshot, command trace, AST/diff summaries
 */
export const OutcomeModeSchema = z.enum(["lite", "standard", "full", "forensic"]);

export const OutcomeArtifactSchema = z.object({
  path: z.string(),
  kind: z.enum(["file_created", "file_modified", "file_deleted", "note"]),
  language: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  sha256: z.string().length(64),
  excerpt: z.string().optional(),
});

export const OutcomeToolUseSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  args: z.record(z.any()).optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  ok: z.boolean().optional(),
  notes: z.string().optional(),
});

export const OutcomeRecordSchema = z.object({
  aegisVersion: z.string(),
  policyVersion: z.string().default("v1"),
  mode: OutcomeModeSchema,
  sessionId: z.string(),                // stable id across a multi-step run
  stepId: z.string(),                   // per step/action
  timestamp: z.string(),                // ISO8601
  agent: z.object({
    name: z.string(),                   // "cursor", "chatgpt", "claude", "gemini"
    model: z.string().optional(),       // e.g., "claude-3.5-sonnet-202408"
    temperature: z.number().min(0).max(2).optional(),
    seed: z.number().optional(),
  }),
  prompt: z.object({
    system: z.string().optional(),
    user: z.string().optional(),
    filesReferenced: z.array(z.string()).optional(),
    promptSha256: z.string().length(64),
  }),
  output: z.object({
    text: z.string().optional(),        // model raw output or summarized
    outputSha256: z.string().length(64),
    tokensIn: z.number().int().nonnegative().optional(),
    tokensOut: z.number().int().nonnegative().optional(),
    latencyMs: z.number().int().nonnegative().optional(),
  }),
  outcomes: z.object({
    summary: z.string(),                // 1–3 lines, human-readable
    verdict: z.enum(["success","partial","failure"]),
    rationale: z.string().optional(),   // why the verdict
  }),
  artifacts: z.array(OutcomeArtifactSchema).default([]),
  tools: z.array(OutcomeToolUseSchema).default([]),
  diffs: z.array(z.object({
    path: z.string(),
    summary: z.string(),                // short, line counts or AST note
  })).default([]),
  env: z.object({
    cwd: z.string().optional(),
    node: z.string().optional(),
    os: z.string().optional(),
    repo: z.string().optional(),
    branch: z.string().optional(),
    commit: z.string().optional(),
  }).optional(),
  integrity: z.object({
    bundleSha256: z.string().length(64),
  }),
});

export function sha256(str) {
  return createHash("sha256").update(str).digest("hex");
}

export function computeBundleHash(record) {
  // Hash the stable fields so other agents can verify integrity after paste/upload.
  const stable = {
    aegisVersion: record.aegisVersion,
    policyVersion: record.policyVersion,
    mode: record.mode,
    sessionId: record.sessionId,
    stepId: record.stepId,
    timestamp: record.timestamp,
    agent: record.agent,
    prompt: record.prompt,
    output: { ...record.output, text: undefined }, // exclude bulky text from bundle hash
    outcomes: record.outcomes,
    artifacts: record.artifacts.map(a => ({ ...a, excerpt: undefined })), // exclude excerpts
    diffs: record.diffs,
    env: record.env,
  };
  return sha256(JSON.stringify(stable));
}
