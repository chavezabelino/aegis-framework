#!/usr/bin/env node

/**
 * Safe Markdown Transformer
 * Parses markdown files into segments and applies fixes only to prose content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MarkdownTransformer {
  constructor() {
    this.segments = [];
  }

  parse(content) {
    this.segments = [];
    let currentSegment = { type: 'prose', content: '', start: 0 };
    let i = 0;
    let inFence = false;
    let inInlineCode = false;
    let fenceChar = '';
    let fenceCount = 0;

    while (i < content.length) {
      const char = content[i];
      const nextChar = content[i + 1];
      const prevChar = content[i - 1];

      // Handle fenced code blocks
      if (char === '`' && nextChar === '`' && content[i + 2] === '`') {
        if (!inFence) {
          // Start of fence
          if (currentSegment.content) {
            this.segments.push({ ...currentSegment, end: i });
          }
          inFence = true;
          fenceChar = '`';
          fenceCount = 3;
          currentSegment = { type: 'fence', content: '```', start: i };
          i += 3;
          continue;
        } else if (fenceChar === '`') {
          // End of fence
          currentSegment.content += '```';
          this.segments.push({ ...currentSegment, end: i + 3 });
          inFence = false;
          currentSegment = { type: 'prose', content: '', start: i + 3 };
          i += 3;
          continue;
        }
      }

      // Handle inline code
      if (char === '`' && !inFence) {
        if (!inInlineCode) {
          // Start of inline code
          if (currentSegment.content) {
            this.segments.push({ ...currentSegment, end: i });
          }
          inInlineCode = true;
          currentSegment = { type: 'inline-code', content: '`', start: i };
        } else {
          // End of inline code
          currentSegment.content += '`';
          this.segments.push({ ...currentSegment, end: i + 1 });
          inInlineCode = false;
          currentSegment = { type: 'prose', content: '', start: i + 1 };
        }
        i++;
        continue;
      }

      // Add character to current segment
      if (inFence || inInlineCode) {
        currentSegment.content += char;
      } else {
        currentSegment.content += char;
      }
      i++;
    }

    // Add final segment
    if (currentSegment.content) {
      this.segments.push({ ...currentSegment, end: content.length });
    }

    return this.segments;
  }

  applyFixes(segments) {
    return segments.map(segment => {
      if (segment.type === 'prose') {
        return {
          ...segment,
          content: this.fixProse(segment.content)
        };
      }
      return segment;
    });
  }

  fixProse(content) {
    // MD044: Proper names (case-correct whole words only)
    content = this.fixProperNames(content);
    
    // MD012: Collapse multiple blank lines
    content = this.fixMultipleBlankLines(content);
    
    // MD013: Soft-wrap at 120 chars where safe
    content = this.fixLineLength(content);
    
    return content;
  }

  fixProperNames(content) {
    // Define proper name mappings with word boundary checks
    const properNames = [
      { pattern: /(?<![/\w`])aegis(?![/\w])/gi, replacement: 'Aegis' },
      { pattern: /(?<![/\w`])cli(?![/\w])/gi, replacement: 'CLI' },
      { pattern: /(?<![/\w`])json(?![/\w])/gi, replacement: 'JSON' },
      { pattern: /(?<![/\w`])blueprint(s?)(?![/\w])/gi, replacement: 'Blueprint$1' },
      { pattern: /(?<![/\w`])telemetry(?![/\w])/gi, replacement: 'Telemetry' },
      { pattern: /(?<![/\w`])github(?![/\w])/gi, replacement: 'GitHub' },
      { pattern: /(?<![/\w`])markdown(?![/\w])/gi, replacement: 'Markdown' },
      { pattern: /(?<![/\w`])typescript(?![/\w])/gi, replacement: 'TypeScript' },
      { pattern: /(?<![/\w`])vitest(?![/\w])/gi, replacement: 'Vitest' },
      { pattern: /(?<![/\w`])playwright(?![/\w])/gi, replacement: 'Playwright' },
      { pattern: /(?<![/\w`])stryker(\.js)?(?![/\w])/gi, replacement: 'Stryker$1' }
    ];

    // Apply Constitutional fix only for title-cased phrases
    content = content.replace(
      /(^|^#+\s+|^[-*+]\s+)(constitutional\s+[A-Z][a-z])/gim,
      '$1Constitutional$2'
    );

    // Apply other proper name fixes
    properNames.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    return content;
  }

  fixMultipleBlankLines(content) {
    // Collapse multiple blank lines to single blank lines
    return content.replace(/\n{3,}/g, '\n\n');
  }

  fixLineLength(content) {
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines that shouldn't be wrapped
      if (line.length <= 120 || 
          line.includes('|') || // Tables
          line.includes('http') || // URLs
          line.startsWith('```') || // Code fences
          line.startsWith('>') || // Blockquotes
          line.startsWith('#') || // Headings
          line.startsWith('- ') || // List items with long content
          line.startsWith('* ') ||
          line.startsWith('+ ') ||
          /^\d+\./.test(line)) { // Numbered lists
        result.push(line);
        continue;
      }

      // Soft-wrap long lines at word boundaries
      if (line.length > 120) {
        const words = line.split(' ');
        let currentLine = '';
        const wrappedLines = [];

        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          if ((currentLine + word).length > 120 && currentLine) {
            wrappedLines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine += (currentLine ? ' ' : '') + word;
          }
        }
        
        if (currentLine) {
          wrappedLines.push(currentLine.trim());
        }
        
        result.push(...wrappedLines);
      } else {
        result.push(line);
      }
    }

    return result.join('\n');
  }

  reconstruct(segments) {
    return segments.map(s => s.content).join('');
  }
}

// Main execution
async function main() {
  const transformer = new MarkdownTransformer();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node markdown-safe-transformer.js <file>');
    process.exit(1);
  }

  const filePath = args[0];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const segments = transformer.parse(content);
    const fixedSegments = transformer.applyFixes(segments);
    const result = transformer.reconstruct(fixedSegments);
    
    // Ensure exactly one trailing newline (MD047)
    if (!result.endsWith('\n')) {
      result += '\n';
    }
    
    fs.writeFileSync(filePath, result);
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default MarkdownTransformer;
