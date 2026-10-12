#!/usr/bin/env node
/**
 * Aura Music Academy — secret scanner.
 *
 * Scans tracked files for credential patterns that must never be committed.
 *
 * IMPORTANT: this scanner deliberately ignores documentation, .gitignore and
 * .env.example, because those files legitimately *mention* the names of
 * credential mechanisms (for example a guideline that says "never commit
 * firebase-adminsdk keys"). Matching on documentation prose produces false
 * positives that would train contributors to ignore the check.
 *
 * What it looks for:
 *   - Real private key blocks (BEGIN ... PRIVATE KEY with base64 body)
 *   - GitHub tokens (ghp_, gho_, ghs_, ghr_, github_pat_)
 *   - Google API keys (AIza...)
 *   - AWS access key ids (AKIA...)
 *   - Slack tokens (xox...)
 *   - Firebase Admin SDK service-account JSON shapes
 *
 * Exit code 1 when a finding is present, 0 otherwise.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SKIP_PATTERNS = [
  /^docs\//,
  /^README\.md$/,
  /^CHANGELOG\.md$/,
  /^CONTRIBUTING\.md$/,
  /^\.gitignore$/,
  /^\.env\.example$/,
  /^scripts\/check-secrets\.mjs$/,
  /^package-lock\.json$/,
  /^\.github\//,
  /\.md$/,
];

const RULES = [
  {
    id: 'private-key-block',
    description: 'Private key material',
    pattern: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----[\r\n]+[A-Za-z0-9+/=\r\n]{100,}/,
  },
  {
    id: 'github-token',
    description: 'GitHub personal access token',
    pattern: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/,
  },
  {
    id: 'github-fine-grained-pat',
    description: 'GitHub fine-grained personal access token',
    pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  },
  {
    id: 'google-api-key',
    description: 'Google / Firebase API key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/,
  },
  {
    id: 'aws-access-key',
    description: 'AWS access key id',
    pattern: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/,
  },
  {
    id: 'slack-token',
    description: 'Slack token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  },
  {
    id: 'service-account-json',
    description: 'Firebase Admin SDK service-account JSON',
    pattern: /"type"\s*:\s*"service_account"[\s\S]{0,4000}?"private_key"\s*:\s*"-----BEGIN/,
  },
];

function trackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
  return output.split('\0').filter((f) => f.length > 0);
}

function shouldSkip(file) {
  return SKIP_PATTERNS.some((p) => p.test(file));
}

function looksBinary(buffer) {
  return buffer.includes(0);
}

const findings = [];
const files = trackedFiles().filter((f) => !shouldSkip(f));

for (const file of files) {
  let buffer;
  try {
    buffer = readFileSync(file);
  } catch {
    continue;
  }
  if (looksBinary(buffer)) continue;

  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  for (const rule of RULES) {
    const globalPattern = new RegExp(rule.pattern.source, 'g');
    let match;
    while ((match = globalPattern.exec(text)) !== null) {
      const lineNumber = text.slice(0, match.index).split(/\r?\n/).length;
      // Never print the matched secret itself — only its location.
      findings.push({
        file,
        line: lineNumber,
        rule: rule.id,
        description: rule.description,
        context: (lines[lineNumber - 1] ?? '').slice(0, 60).replace(/[A-Za-z0-9+/=_-]{12,}/g, '***'),
      });
    }
  }
}

const allowlist = process.env.SECRET_SCAN_ALLOWLIST
  ? process.env.SECRET_SCAN_ALLOWLIST.split(',').map((s) => s.trim())
  : [];

const realFindings = findings.filter((f) => !allowlist.includes(f.file));

if (realFindings.length === 0) {
  console.log(`Secret scan clean — inspected ${files.length} tracked files, no credential patterns found.`);
  process.exit(0);
}

console.error('SECRET SCAN FAILED — potential credentials detected:\n');
for (const f of realFindings) {
  console.error(`  ${f.file}:${f.line}  [${f.description}]`);
  console.error(`    ${f.context}`);
}
console.error(
  '\nRemove the credential, rotate it immediately, and purge it from git history.\n' +
    'If this is a false positive, add the file to SKIP_PATTERNS in scripts/check-secrets.mjs\n' +
    'with a comment explaining why.'
);
process.exit(1);
