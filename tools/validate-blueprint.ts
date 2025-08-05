import fs from 'fs';
import yaml from 'js-yaml';

try {
  const filePath = process.argv[2];
  if (!filePath) throw new Error("Usage: node validate-blueprint.js <file.yaml>");

  const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));
  if (!doc.id || !doc.version) throw new Error("Missing required fields: id, version");
  console.log("✅ Blueprint is valid.");
} catch (e) {
  console.error("❌ Validation failed:", e.message);
  process.exit(1);
}
