#!/usr/bin/env node
const { execSync } = require("node:child_process");
const fs = require("node:fs");
fs.mkdirSync(".aegis/tmp", { recursive: true });

const run = (cmd) =>
  execSync(cmd, { stdio: "inherit", env: process.env });

const out = { grade: "F", score: 10, checks: {} };

const step = (name, fn) => {
  try { fn(); out.checks[name] = true; }
  catch (e) { out.checks[name] = false; }
};

step("types", () => run("pnpm types:full && pnpm types:baseline"));
step("format", () => run("pnpm format:check"));
step("depAudit", () => run("pnpm dep:audit"));

fs.writeFileSync("quality.json", JSON.stringify(out, null, 2));
console.log("Wrote quality.json (CI)");
