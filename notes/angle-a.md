# Angle A: lead with the numbers

The weekly statement opens with how many invoices are open and the total. A busy clerk sees the count and the amount before reading anything else.

Placeholders are filled from the sheet by the script. `{{invoices_word}}` is "invoice" for one and "invoices" for more than one. No amount is typed by hand.

## Subject lines

1. `{{invoice_count}} open {{invoices_word}} with ITM: PKR {{total}} outstanding`
2. `ITM statement: {{invoice_count}} open {{invoices_word}} totalling PKR {{total}}`
3. `PKR {{total}} outstanding on {{invoice_count}} {{invoices_word}} with ITM`

## Opening sentence

According to our records on {{as_of}}, the account of {{customer}} has {{invoice_count}} open {{invoices_word}} with an outstanding balance of PKR {{total}}, shown below.

## Example, filled in from the Crescent Health Services draft (23 November week)

- Subject 1: 3 open invoices with ITM: PKR 1,225,500 outstanding
- Subject 2: ITM statement: 3 open invoices totalling PKR 1,225,500
- Subject 3: PKR 1,225,500 outstanding on 3 invoices with ITM
- Opening: According to our records on Monday 23 November 2026, the account of Crescent Health Services has 3 open invoices with an outstanding balance of PKR 1,225,500, shown below.

## Notes

- All three subjects stay under the 70-character limit with a seven-figure total. Check the length again if a total reaches eight figures.
- The opening fits the 31-day-and-older wording in `.claude/rules/reminders.md`. For a customer whose oldest invoice is 30 days or less, keep the "statement ... by its due date" wording instead.
