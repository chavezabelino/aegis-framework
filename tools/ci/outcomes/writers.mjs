import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function ensureDir(p) {
  return mkdir(p, { recursive: true });
}

export async function writeJSONL(dir, filename, record) {
  await ensureDir(dir);
  const fp = join(dir, filename);
  const line = JSON.stringify(record) + "\n";
  await appendFile(fp, line, { encoding: "utf8" });
  return fp;
}

function mdEscape(s = "") {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function writeMarkdown(dir, filename, record) {
  await ensureDir(dir);
  const fp = join(dir, filename);

  const md = [
`# Aegis Outcome Log (${record.mode})`,
`- Session: \`${record.sessionId}\`  Step: \`${record.stepId}\`  Time: ${record.timestamp}`,
`- Agent: **${record.agent.name}** (${record.agent.model ?? "model-unknown"})`,
`- Verdict: **${record.outcomes.verdict}** — ${record.outcomes.summary}`,
`- Prompt SHA: \`${record.prompt.promptSha256}\`  Output SHA: \`${record.output.outputSha256}\``,
`- Integrity: \`${record.integrity.bundleSha256}\``,
"",
"## Prompt (excerpt)",
"```text",
mdEscape((record.mode === "lite") ? "[hidden]" :
          (record.mode === "standard") ? (record.prompt?.user ?? "").slice(0, 2000) :
          (record.prompt?.user ?? "")),
"```",
"",
"## Output (excerpt)",
"```text",
mdEscape((record.mode === "lite") ? "[hidden]" :
          (record.mode === "standard") ? (record.output?.text ?? "").slice(0, 2000) :
          (record.output?.text ?? "")),
"```",
"",
(record.artifacts?.length ? "## Artifacts" : ""),
...(record.artifacts ?? []).map(a => `- ${a.kind} \`${a.path}\` (${a.bytes ?? "?"} bytes) — ${a.sha256}`),
"",
(record.diffs?.length ? "## Diffs" : ""),
...(record.diffs ?? []).map(d => `- \`${d.path}\`: ${d.summary}`),
"",
(record.tools?.length ? "## Tool Use" : ""),
...(record.tools ?? []).map(t => `- ${t.name} ${t.version ?? ""} — ${t.ok === false ? "❌" : "✅"} ${t.notes ?? ""}`),
"",
(record.env ? "## Environment" : ""),
...(record.env ? [
  `- repo: ${record.env.repo ?? ""} (${record.env.branch ?? ""}@${record.env.commit ?? ""})`,
  `- node: ${record.env.node ?? ""}  os: ${record.env.os ?? ""}  cwd: ${record.env.cwd ?? ""}`,
] : []),
"",
"## Rationale",
(record.outcomes.rationale ?? "_n/a_"),
"",
].filter(Boolean).join("\n");

  await writeFile(fp, md, { encoding: "utf8" });
  return fp;
}
