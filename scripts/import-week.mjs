// Turn a weekly outstanding-invoices sheet (.xlsx) into a clean .csv.
//
// Usage: node scripts/import-week.mjs data/weekly/2026-11-09.xlsx
// Writes: data/weekly/2026-11-09.csv
//
// The file name must start with the sheet date (YYYY-MM-DD).
// days_outstanding is counted from each invoice date to that date.
// Amounts are copied exactly as they are in the sheet. Nothing is rounded.

import ExcelJS from 'exceljs';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';

const COLUMNS = ['customer', 'invoice_no', 'invoice_date', 'amount_pkr', 'contact_name', 'email', 'days_outstanding'];
const DAY_MS = 24 * 60 * 60 * 1000;

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

function csvField(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const input = process.argv[2];
if (!input) fail('give the .xlsx file, for example: node scripts/import-week.mjs data/weekly/2026-11-09.xlsx');
if (path.extname(input).toLowerCase() !== '.xlsx') fail(`expected an .xlsx file, got ${input}`);

const base = path.basename(input, path.extname(input));
const match = base.match(/^(\d{4})-(\d{2})-(\d{2})/);
if (!match) fail(`file name must start with the sheet date as YYYY-MM-DD, got ${base}`);
const sheetDate = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
if (isoDate(sheetDate) !== match.slice(1, 4).join('-')) fail(`${match[0]} is not a real date`);

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
let count = 0;

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
  const invoiceDate = isoDate(date);
  const daysOutstanding = Math.round((sheetDate - Date.parse(invoiceDate)) / DAY_MS);

  const amount = get('amount');
  if (typeof amount !== 'number') fail(`row ${r} (${customer}) has no numeric amount`);

  const emailCell = String(get('email') ?? '').trim();
  const parts = emailCell.match(/^(.*?)\s*<\s*([^<>\s]+)\s*>$/);
  if (!parts) fail(`row ${r} (${customer}) email is not in the form "Name <address>": ${emailCell}`);
  const contactName = parts[1].trim();
  const email = parts[2];

  lines.push([customer, invoiceNo, invoiceDate, amount, contactName, email, daysOutstanding].map(csvField).join(','));
  count++;
}

const output = path.join(path.dirname(input), `${base}.csv`);
await writeFile(output, lines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${count} invoices to ${output}`);
