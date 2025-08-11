#!/usr/bin/env node

/**
 * Fix MD041: First line heading issues
 * Ensures the first non-frontmatter, non-blank line is a # H1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixFirstLineHeading(content, filename) {
  const lines = content.split('\n');
  let i = 0;
  
  // Skip frontmatter if present
  if (lines[0] === '---') {
    i = 1;
    while (i < lines.length && lines[i] !== '---') {
      i++;
    }
    i++; // Skip closing ---
  }
  
  // Skip blank lines and comments
  while (i < lines.length && (
    lines[i].trim() === '' || 
    lines[i].trim().startsWith('<!--') ||
    lines[i].trim().startsWith('Constitution-Version:') ||
    lines[i].trim().startsWith('@aegisBlueprint:')
  )) {
    i++;
  }
  
  // If we've reached the end, add a heading
  if (i >= lines.length) {
    const title = path.basename(filename, path.extname(filename))
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `# ${title}\n\n${content}`;
  }
  
  // Check if current line is already a heading
  if (lines[i].startsWith('#')) {
    // If it's not an H1, convert it
    if (!lines[i].startsWith('# ')) {
      lines[i] = lines[i].replace(/^#+/, '#');
    }
    return lines.join('\n');
  }
  
  // Find existing H1 heading
  let existingH1 = null;
  for (let j = i; j < lines.length; j++) {
    if (lines[j].startsWith('# ')) {
      existingH1 = lines[j];
      break;
    }
  }
  
  // Insert H1 heading
  const title = existingH1 ? 
    existingH1.substring(2) : 
    path.basename(filename, path.extname(filename))
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
  lines.splice(i, 0, `# ${title}`, '');
  
  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node fix-markdown-headings.js <file>');
    process.exit(1);
  }

  const filePath = args[0];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixFirstLineHeading(content, filePath);
    fs.writeFileSync(filePath, result);
    console.log(`✅ Fixed heading: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixFirstLineHeading };
