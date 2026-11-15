// Turn a weekly outstanding-invoices sheet (.xlsx) into a clean .csv,
// and print a summary for drafting the reminders.
//
// Usage: node scripts/import-week.mjs data/weekly/2026-11-09.xlsx [--as-of YYYY-MM-DD]
// Writes: data/weekly/2026-11-09.csv
//
// The file name must start with the sheet date (YYYY-MM-DD).
// In the .csv, days_outstanding is counted from each invoice date to the sheet date.
// In the printed summary, days are counted to --as-of (the day the drafts are
// written). Without --as-of, the sheet date is used.
// Amounts are copied exactly as they are in the sheet. Nothing is rounded.
//
// Rows with no email address, or an amount of zero or less, are left out of
// the .csv and the totals, and listed under NEEDS ATTENTION.

import ExcelJS from 'exceljs';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';

const COLUMNS = ['customer', 'invoice_no', 'invoice_date', 'amount_pkr', 'contact_name', 'email', 'days_outstanding'];
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function fail(message) {
  console.error(`import-week: ${message}`);
  process.exit(1);
}

// Plain value of a cell: formula result, rich text joined, hyperlink text.
function plain(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object') {
    if ('result' in value) return plain(value.result);
    if ('richText' in value) return value.richText.map((part) => part.text).join('');
    if ('text' in value) return plain(value.text);
  }
  return value;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

// Parse YYYY-MM-DD into a UTC date, or return null if it is not a real date.
function parseIso(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (!m) return null;
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return isoDate(date) === m.slice(1, 4).join('-') ? date : null;
}

// "Sunday 15 November 2026"
function longDate(date) {
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "12 Oct 2026"
function shortDate(date) {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0, 3)} ${date.getUTCFullYear()}`;
}

function daysBetween(from, to) {
  return Math.round((to - from) / DAY_MS);
}

// Amounts are summed in paisa (whole numbers) so no rounding error creeps in.
function toPaisa(amount) {
  return Math.round(amount * 100);
}

// 1168000 -> "1,168,000"; keeps paisa only when there are some.
function formatPkr(paisa) {
  const rupees = paisa / 100;
  return rupees.toLocaleString('en-US', {
    minimumFractionDigits: paisa % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function csvField(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// --- Arguments ---

const args = process.argv.slice(2);
let input = null;
let asOfText = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--as-of') asOfText = args[++i];
  else if (!input) input = args[i];
  else fail(`unexpected argument: ${args[i]}`);
}
if (!input) fail('give the .xlsx file, for example: node scripts/import-week.mjs data/weekly/2026-11-09.xlsx');
if (path.extname(input).toLowerCase() !== '.xlsx') fail(`expected an .xlsx file, got ${input}`);

const base = path.basename(input, path.extname(input));
if (!/^\d{4}-\d{2}-\d{2}/.test(base)) fail(`file name must start with the sheet date as YYYY-MM-DD, got ${base}`);
const sheetDate = parseIso(base);
if (!sheetDate) fail(`${base.slice(0, 10)} is not a real date`);

let asOf = sheetDate;
if (asOfText !== null) {
  asOf = asOfText === undefined ? null : parseIso(asOfText);
  if (!asOf || asOfText.length !== 10) fail(`--as-of needs a real date as YYYY-MM-DD, got ${asOfText}`);
}

// --- Read the sheet ---

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(input);
const sheet = workbook.worksheets[0];
if (!sheet) fail('the workbook has no sheets');

// Find each column by its header name, so column order does not matter.
const header = {};
sheet.getRow(1).eachCell((cell, col) => {
  const name = String(plain(cell.value) ?? '').trim().toLowerCase();
  if (name) header[name] = col;
});
for (const name of ['customer', 'num', 'date', 'amount', 'email']) {
  if (!header[name]) fail(`header row is missing the "${name}" column`);
}

const lines = [COLUMNS.join(',')];
const customers = new Map(); // customer -> { contact, email, invoices: [] }
const attention = [];

for (let r = 2; r <= sheet.rowCount; r++) {
  const row = sheet.getRow(r);
  const get = (name) => plain(row.getCell(header[name]).value);

  const customer = String(get('customer') ?? '').trim();
  if (!customer) continue; // blank row
  if (customer.toLowerCase() === 'total') continue; // Total row at the bottom

  const invoiceNo = String(get('num') ?? '').trim();
  if (!invoiceNo) fail(`row ${r} (${customer}) has no invoice number`);

  const date = get('date');
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) fail(`row ${r} (${customer}) has no valid date`);
  const invoiceDate = parseIso(isoDate(date));

  const amount = get('amount');
  if (typeof amount !== 'number') fail(`row ${r} (${customer}) has no numeric amount`);

  const emailCell = String(get('email') ?? '').trim();
  const parts = emailCell.match(/^(.*?)\s*<\s*([^<>\s]+)\s*>$/);

  const skip = (reason) => attention.push({ row: r, customer, invoiceNo, amount, reason });
  if (!emailCell) { skip('no email address'); continue; }
  if (!parts) { skip(`email is not in the form "Name <address>": ${emailCell}`); continue; }
  if (amount <= 0) { skip(`amount is zero or less: ${amount}`); continue; }

  const contactName = parts[1].trim();
  const email = parts[2];

  lines.push([customer, invoiceNo, isoDate(invoiceDate), amount, contactName, email, daysBetween(invoiceDate, sheetDate)]
    .map(csvField).join(','));

  if (!customers.has(customer)) customers.set(customer, { contact: contactName, email, invoices: [] });
  const entry = customers.get(customer);
  if (entry.contact !== contactName || entry.email !== email) {
    attention.push({ row: r, customer, invoiceNo, amount,
      reason: `contact differs from the customer's first row (${entry.contact} <${entry.email}>); the first one is used` });
  }
  entry.invoices.push({ invoiceNo, invoiceDate, paisa: toPaisa(amount), days: daysBetween(invoiceDate, asOf) });
}

const output = path.join(path.dirname(input), `${base}.csv`);
await writeFile(output, lines.join('\n') + '\n', 'utf8');

// --- Summary ---

const out = [];
out.push(`Wrote ${lines.length - 1} invoices to ${output}`);
out.push(`As of: ${longDate(asOf)} (${isoDate(asOf)})`);
out.push('');
out.push('CUSTOMERS');

let grandPaisa = 0;
for (const [customer, entry] of customers) {
  const totalPaisa = entry.invoices.reduce((sum, inv) => sum + inv.paisa, 0);
  const oldest = Math.max(...entry.invoices.map((inv) => inv.days));
  const count = entry.invoices.length;
  grandPaisa += totalPaisa;
  out.push(`${customer} | ${entry.contact} <${entry.email}> | ${count} invoice${count === 1 ? '' : 's'} | total ${formatPkr(totalPaisa)} | oldest ${oldest} days`);
  for (const inv of entry.invoices) {
    out.push(`  ${inv.invoiceNo} | ${shortDate(inv.invoiceDate)} | ${formatPkr(inv.paisa)} | ${inv.days} days`);
  }
}

out.push('');
out.push(`GRAND TOTAL: ${customers.size} customer${customers.size === 1 ? '' : 's'}, PKR ${formatPkr(grandPaisa)}`);
out.push('');
out.push('NEEDS ATTENTION');
if (attention.length === 0) out.push('none');
for (const a of attention) {
  out.push(`row ${a.row} | ${a.customer} | ${a.invoiceNo} | ${a.amount} | ${a.reason}`);
}

console.log(out.join('\n'));
