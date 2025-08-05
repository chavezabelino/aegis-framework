#!/usr/bin/env node

import fs from "fs";
import path from "path";

const [,, featureName] = process.argv;
if (!featureName) {
  console.error("Usage: aegis-cli init <feature-name>");
  process.exit(1);
}

const dir = `blueprints/${featureName}`;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(`${dir}/blueprint.yaml`, `id: ${featureName}
name: ${featureName.replace(/-/g, " ")}
version: 1.0.0
`);

console.log(`✅ Initialized blueprint scaffold in ${dir}`);
