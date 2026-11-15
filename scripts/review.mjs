// Review a week's reminder drafts with Claude Code, with nobody typing.
//
// Usage: node scripts/review.mjs <reminders-folder> <week-csv>
// Example: node scripts/review.mjs chase/2026-11-23 data/weekly/2026-11-23.csv
//
// Runs `claude -p` headless with read-only tools (Read, Glob, Grep).
// Saves the findings to review/findings.json and prints a one-line summary.
// Exit code: 0 when there is no high-severity finding, 1 when there is one,
// 2 when the review itself could not run.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const [folder, csv] = process.argv.slice(2);
if (!folder || !csv) {
  console.error('Usage: node scripts/review.mjs <reminders-folder> <week-csv>');
  process.exit(2);
}
for (const p of [folder, csv]) {
  if (!existsSync(p)) {
    console.error(`Not found: ${p}`);
    process.exit(2);
  }
}

const schema = readFileSync('review/findings.schema.json', 'utf8');

const prompt =
  `Review every reminder in ${folder} against ${csv}, brand/voice.md and .claude/rules/reminders.md. ` +
  `An invoice number, date or amount that doesn't match the CSV, a missing invoice, an invoice that is not in the CSV, ` +
  `a wrong total or a wrong address is high severity. Report only real problems.`;

const run = spawnSync(
  'claude',
  ['-p', prompt, '--output-format', 'json', '--json-schema', schema, '--allowedTools', 'Read,Glob,Grep'],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 },
);

if (run.error || run.status !== 0) {
  console.error(`claude failed: ${run.error?.message ?? `exit code ${run.status}`}`);
  if (run.stderr) console.error(run.stderr);
  process.exit(2);
}

// The output is either one result object, or a list whose last item is the result.
let output;
try {
  output = JSON.parse(run.stdout);
} catch {
  console.error('Could not read the JSON from claude.');
  console.error(run.stdout.slice(0, 2000));
  process.exit(2);
}
const result = Array.isArray(output) ? output[output.length - 1] : output;
const structured = result?.structured_output;

if (!structured || !Array.isArray(structured.findings)) {
  console.error('No structured_output.findings in the result.');
  console.error(JSON.stringify(result, null, 2).slice(0, 2000));
  process.exit(2);
}

mkdirSync('review', { recursive: true });
writeFileSync('review/findings.json', JSON.stringify(structured, null, 2) + '\n');

const count = (s) => structured.findings.filter((f) => f.severity === s).length;
const high = count('high');
console.log(
  `Reviewed ${folder}: ${structured.findings.length} findings (${high} high, ${count('medium')} medium, ${count('low')} low). Saved to review/findings.json.`,
);
process.exit(high > 0 ? 1 : 0);
