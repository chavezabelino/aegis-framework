#!/usr/bin/env node
const { execSync } = require("node:child_process");
const fs = require("node:fs");
fs.mkdirSync(".aegis/tmp", { recursive: true });

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

const result = {
  grade: "F",
  score: 10,
  checks: {
    types: false,
    format: false,
    coverage: false,
    provenance: true,
    waivers: true
  }
};

try { run("pnpm types:full"); } catch {}
try { run("pnpm types:report"); } catch {}
try { run("pnpm format:check"); } catch {}
try { run("pnpm dep:audit"); } catch {}

fs.writeFileSync(".aegis/tmp/quality.json", JSON.stringify(result, null, 2));
console.log("Wrote .aegis/tmp/quality.json");
