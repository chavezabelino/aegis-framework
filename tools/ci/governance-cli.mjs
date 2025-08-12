#!/usr/bin/env node
/**
 * Aegis Governance CLI (Node-only)
 *
 * Usage:
 *   node tools/ci/governance-cli.mjs enable
 *   node tools/ci/governance-cli.mjs disable
 *   node tools/ci/governance-cli.mjs enforce validation|hooks|intel|monitoring|all
 *   node tools/ci/governance-cli.mjs hooks install|uninstall
 *   node tools/ci/governance-cli.mjs replay
 *   node tools/ci/governance-cli.mjs status
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import process from "node:process";
import path from "node:path";

const run = (cmd, env = {}) =>
  new Promise((resolve) => {
    const child = spawn(cmd, {
      shell: true,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("close", (code) => resolve(code ?? 0));
  });

const args = process.argv.slice(2);
const [cmd, sub] = args;

function help(exit = 0) {
  console.log(`
Aegis Governance CLI

Commands:
  enable                           Run full suite in DRY-RUN mode
  disable                          Run full suite in OFF mode (no blocking)
  enforce <group>                  Enforce one group: validation|hooks|intel|monitoring|all
  hooks install|uninstall          Manage local pre-commit hook
  replay                           Re-run suite against SHAs (tools/ci/replay-shas.txt)
  status                           Print current env-based status
`);
  process.exit(exit);
}

function envBlock(overrides = {}) {
  return { ...process.env, ...overrides };
}

async function doEnable() {
  return run("node tools/ci/run-governance-suite.mjs --group all", {
    AEGIS_GOVERNANCE_MODE: "dry-run",
  });
}

async function doDisable() {
  return run("node tools/ci/run-governance-suite.mjs --group all", {
    AEGIS_GOVERNANCE_MODE: "off",
  });
}

async function doEnforce(group) {
  const base = { AEGIS_GOVERNANCE_MODE: "enforce" };
  switch (group) {
    case "validation":
      return run("node tools/ci/run-governance-suite.mjs --group validation", {
        ...base,
        AEGIS_ENFORCE_VALIDATION: "1",
        AEGIS_ENFORCE_PREVENTION: "0",
        AEGIS_ENFORCE_INTEL: "0",
        AEGIS_ENFORCE_MONITORING: "0",
      });
    case "hooks":
    case "prevention":
      return run("node tools/ci/run-governance-suite.mjs --group prevention", {
        ...base,
        AEGIS_ENFORCE_VALIDATION: "0",
        AEGIS_ENFORCE_PREVENTION: "1",
        AEGIS_ENFORCE_INTEL: "0",
        AEGIS_ENFORCE_MONITORING: "0",
      });
    case "intel":
      return run("node tools/ci/run-governance-suite.mjs --group intelligence", {
        ...base,
        AEGIS_ENFORCE_VALIDATION: "0",
        AEGIS_ENFORCE_PREVENTION: "0",
        AEGIS_ENFORCE_INTEL: "1",
        AEGIS_ENFORCE_MONITORING: "0",
      });
    case "monitoring":
      return run("node tools/ci/run-governance-suite.mjs --group monitoring", {
        ...base,
        AEGIS_ENFORCE_VALIDATION: "0",
        AEGIS_ENFORCE_PREVENTION: "0",
        AEGIS_ENFORCE_INTEL: "0",
        AEGIS_ENFORCE_MONITORING: "1",
      });
    case "all":
      return run("node tools/ci/run-governance-suite.mjs --group all", {
        ...base,
        AEGIS_ENFORCE_VALIDATION: "1",
        AEGIS_ENFORCE_PREVENTION: "1",
        AEGIS_ENFORCE_INTEL: "1",
        AEGIS_ENFORCE_MONITORING: "1",
      });
    default:
      console.error(`Unknown group: ${group}`);
      return help(2);
  }
}

async function doHooks(action) {
  if (action === "install") {
    return run("bash tools/setup-git-hooks.sh install");
  }
  if (action === "uninstall") {
    return run("bash tools/setup-git-hooks.sh uninstall");
  }
  console.error("hooks requires install|uninstall");
  return help(2);
}

async function doReplay() {
  return run("node tools/ci/replay-harness.mjs");
}

function doStatus() {
  const envs = [
    "AEGIS_GOVERNANCE_MODE",
    "AEGIS_ENFORCE_VALIDATION",
    "AEGIS_ENFORCE_PREVENTION",
    "AEGIS_ENFORCE_INTEL",
    "AEGIS_ENFORCE_MONITORING",
    "AEGIS_INTEL_THRESHOLD",
    "TS_RUNNER",
  ];
  console.log("Aegis Governance Status:");
  envs.forEach((k) => console.log(`  ${k}=${process.env[k] ?? "(unset)"}`));

  const p = path.resolve(".aegis-artifacts");
  if (existsSync(p)) {
    try {
      const lastVal = readFileSync(path.join(p, "latest-validation.json"), "utf8");
      console.log("\nLatest validation artifact present.");
      void lastVal; // no-op
    } catch {}
  }
  process.exit(0);
}

(async () => {
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") return help();

  if (cmd === "enable") return process.exit(await doEnable());
  if (cmd === "disable") return process.exit(await doDisable());
  if (cmd === "enforce") return process.exit(await doEnforce((sub || "").toLowerCase()));
  if (cmd === "hooks") return process.exit(await doHooks((sub || "").toLowerCase()));
  if (cmd === "replay") return process.exit(await doReplay());
  if (cmd === "status") return doStatus();

  return help(2);
})();
