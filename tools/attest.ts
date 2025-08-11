#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.0
 * @mode: strict
 * @intent: Generate cryptographic attestations for file provenance
 * @context: Enforce constitutional governance through cryptographic signatures
 * @model: claude-3-5-sonnet
 * @hash: 4f3a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

interface AttestationConfig {
  hmacKey: string;
  outputDir: string;
  commitSha: string;
}

class AttestationGenerator {
  private config: AttestationConfig;

  constructor(config: AttestationConfig) {
    this.config = config;
  }

  /**
   * Generate attestation for a file
   */
  async attestFile(filePath: string): Promise<string> {
    const content = fs.readFileSync(filePath, 'utf8');
    const normalizedContent = this.normalizeContent(content);
    const hash = crypto.createHash('sha256').update(normalizedContent).digest('hex');

    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', this.config.hmacKey);
    hmac.update(hash);
    const signature = hmac.digest('hex');

    // Create attestation record
    const attestation = {
      file: filePath,
      hash: hash,
      signature: signature,
      timestamp: new Date().toISOString(),
      commit: this.config.commitSha,
      algorithm: 'sha256+hmac-sha256',
    };

    // Write attestation file
    const attestationPath = this.getAttestationPath(filePath);
    fs.mkdirSync(path.dirname(attestationPath), { recursive: true });
    fs.writeFileSync(attestationPath, JSON.stringify(attestation, null, 2));

    return signature;
  }

  /**
   * Verify attestation for a file
   */
  async verifyAttestation(filePath: string): Promise<boolean> {
    try {
      const attestationPath = this.getAttestationPath(filePath);
      if (!fs.existsSync(attestationPath)) {
        console.error(`No attestation found for ${filePath}`);
        return false;
      }

      const attestation = JSON.parse(fs.readFileSync(attestationPath, 'utf8'));
      const content = fs.readFileSync(filePath, 'utf8');
      const normalizedContent = this.normalizeContent(content);
      const computedHash = crypto.createHash('sha256').update(normalizedContent).digest('hex');

      if (computedHash !== attestation.hash) {
        console.error(`Hash mismatch for ${filePath}`);
        return false;
      }

      // Verify HMAC signature
      const hmac = crypto.createHmac('sha256', this.config.hmacKey);
      hmac.update(computedHash);
      const expectedSignature = hmac.digest('hex');

      if (expectedSignature !== attestation.signature) {
        console.error(`Signature mismatch for ${filePath}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error verifying attestation for ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Normalize content for consistent hashing
   */
  private normalizeContent(content: string): string {
    // Remove the @hash line to avoid circular dependency
    const lines = content.split('\n');
    const normalizedLines = lines.filter(line => !line.includes('@hash:'));

    // Normalize line endings to LF
    return normalizedLines.join('\n').replace(/\r\n/g, '\n');
  }

  /**
   * Get attestation file path
   */
  private getAttestationPath(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath);
    return path.join(this.config.outputDir, this.config.commitSha, `${relativePath}.sig`);
  }

  /**
   * Attest all files in a directory
   */
  async attestDirectory(
    dirPath: string,
    extensions: string[] = ['.ts', '.js', '.tsx', '.jsx']
  ): Promise<Map<string, string>> {
    const signatures = new Map<string, string>();

    const files = this.getFilesRecursively(dirPath, extensions);

    for (const file of files) {
      try {
        const signature = await this.attestFile(file);
        signatures.set(file, signature);
        console.log(`✅ Attested: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to attest ${file}:`, error);
      }
    }

    return signatures;
  }

  /**
   * Verify all attestations in a directory
   */
  async verifyDirectory(dirPath: string, extensions: string[] = ['.ts', '.js', '.tsx', '.jsx']): Promise<boolean> {
    const files = this.getFilesRecursively(dirPath, extensions);
    let allValid = true;

    for (const file of files) {
      const isValid = await this.verifyAttestation(file);
      if (!isValid) {
        allValid = false;
      }
    }

    return allValid;
  }

  /**
   * Get all files recursively
   */
  private getFilesRecursively(dirPath: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dirPath)) {
      return files;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (item !== 'node_modules' && item !== '.git') {
          files.push(...this.getFilesRecursively(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || !['attest', 'verify'].includes(command)) {
    console.error('Usage: node tools/attest.ts <attest|verify> [directory]');
    process.exit(1);
  }

  const hmacKey = process.env.AEGIS_HMAC_KEY;
  if (!hmacKey) {
    console.error('AEGIS_HMAC_KEY environment variable is required');
    process.exit(1);
  }

  const commitSha = process.env.GITHUB_SHA || 'local';
  const outputDir = '.aegis/attestations';
  const targetDir = args[1] || 'tools';

  const generator = new AttestationGenerator({
    hmacKey,
    outputDir,
    commitSha,
  });

  try {
    if (command === 'attest') {
      console.log(`🔐 Attesting files in ${targetDir}...`);
      const signatures = await generator.attestDirectory(targetDir);
      console.log(`✅ Attested ${signatures.size} files`);

      // Write summary
      const summary = {
        timestamp: new Date().toISOString(),
        commit: commitSha,
        filesAttested: signatures.size,
        signatures: Object.fromEntries(signatures),
      };

      fs.writeFileSync(path.join(outputDir, commitSha, 'attestation-summary.json'), JSON.stringify(summary, null, 2));
    } else if (command === 'verify') {
      console.log(`🔍 Verifying attestations in ${targetDir}...`);
      const isValid = await generator.verifyDirectory(targetDir);

      if (isValid) {
        console.log('✅ All attestations verified successfully');
      } else {
        console.error('❌ Some attestations failed verification');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Attestation operation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Attestation failed:', error.message);
    process.exit(1);
  });
}

export { AttestationGenerator };
