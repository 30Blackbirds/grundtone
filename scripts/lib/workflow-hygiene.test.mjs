// @vitest-environment node
//
// Two rules for every workflow in .github/workflows:
//   1. every job sets `timeout-minutes`, so a hung step cannot hold a runner
//      for GitHub's default of six hours;
//   2. no trigger lists the `main` branch; `develop` is the default branch.
//
// The file is read as text, not parsed as YAML, so the check needs no extra
// dependency. The negative-control cells below feed the helpers a workflow
// that breaks each rule, so the checks cannot pass on a bug in themselves.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const workflowsDir = fileURLToPath(
  new URL('../../.github/workflows/', import.meta.url),
);

/** Job ids under `jobs:` that have no `timeout-minutes` at job level. */
export function jobsWithoutTimeout(text) {
  const lines = text.split('\n');
  const start = lines.indexOf('jobs:');
  if (start === -1) return [];
  const missing = [];
  let job = null;
  let hasTimeout = false;
  const close = () => {
    if (job && !hasTimeout) missing.push(job);
  };
  for (const line of lines.slice(start + 1)) {
    const header = /^ {2}([A-Za-z0-9_-]+):\s*$/.exec(line);
    if (header) {
      close();
      job = header[1];
      hasTimeout = false;
    } else if (/^ {4}timeout-minutes:\s*\S/.test(line)) {
      hasTimeout = true;
    } else if (/^\S/.test(line)) {
      break;
    }
  }
  close();
  return missing;
}

/** Lines whose `branches:` list names `main`. */
export function mainBranchTriggers(text) {
  return text
    .split('\n')
    .filter(line => /^\s*branches:\s*\[[^\]]*\bmain\b[^\]]*\]/.test(line));
}

const workflows = readdirSync(workflowsDir)
  .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
  .map(name => ({ name, text: readFileSync(workflowsDir + name, 'utf8') }));

describe('workflow hygiene', () => {
  it('finds the workflows', () => {
    expect(workflows.length).toBeGreaterThan(0);
  });

  it.each(workflows)('$name: every job sets timeout-minutes', ({ text }) => {
    expect(jobsWithoutTimeout(text)).toEqual([]);
  });

  it.each(workflows)('$name: no trigger names the main branch', ({ text }) => {
    expect(mainBranchTriggers(text)).toEqual([]);
  });
});

describe('workflow hygiene helpers (negative controls)', () => {
  const bad = [
    'on:',
    '  push:',
    '    branches: [main, develop]',
    'jobs:',
    '  with-timeout:',
    '    runs-on: ubuntu-latest',
    '    timeout-minutes: 5',
    '    steps:',
    '      - run: echo',
    '  without-timeout:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - run: echo',
    '        timeout-minutes: 3',
  ].join('\n');

  it('reports a job without a job-level timeout', () => {
    expect(jobsWithoutTimeout(bad)).toEqual(['without-timeout']);
  });

  it('reports a trigger on main', () => {
    expect(mainBranchTriggers(bad)).toEqual(['    branches: [main, develop]']);
  });

  it('accepts develop-only triggers', () => {
    expect(mainBranchTriggers('    branches: [develop]')).toEqual([]);
  });
});
