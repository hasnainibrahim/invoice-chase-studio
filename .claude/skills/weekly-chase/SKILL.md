---
name: weekly-chase
description: Turn this week's outstanding-invoices sheet into one payment reminder per customer. Use every Monday after the new sheet is saved in data/weekly/.
argument-hint: "[data/weekly/YYYY-MM-DD.xlsx]"
context: fork
allowed-tools: Read, Glob, Grep, Write, Bash(node scripts/import-week.mjs *)
---

# Weekly chase

Sheet given: `$ARGUMENTS`

Write one payment reminder draft for each customer on this week's sheet. Drafts only: never send an email.

## 1. Check the sheet

- If no sheet was given above, stop. Use Glob to list `data/weekly/*.xlsx` and reply with that list and this line: "Run /weekly-chase with one of these sheets." Do nothing else.
- The file name must start with the sheet date, for example `data/weekly/2026-11-16.xlsx`. That date is `<date>`.
- Only use sheets in `data/weekly/`. Never read `data/real/`.

## 2. Import the sheet

Run, with today's date as `--as-of`:

```
node scripts/import-week.mjs data/weekly/<date>.xlsx --as-of <today as YYYY-MM-DD>
```

- If the script fails, stop. Write no drafts. Reply with the script's error message under "needs attention".
- The script prints three parts. Use them exactly as printed:
  - **CUSTOMERS:** each customer with contact, email, invoice count, total and oldest days, then one line for each invoice (number, date, amount, days outstanding).
  - **GRAND TOTAL:** the number of customers and the total PKR being chased.
  - **NEEDS ATTENTION:** rows the script skipped (no email address, or an amount of zero or less) and any other problems.
- Never add, round or count anything yourself. Every amount, total, date and day count comes from the script's output.

## 3. Read the rules

Read these before drafting, and follow them:

- `chase/templates/emails/weekly-statement.md`: the template.
- `.claude/rules/reminders.md`: header lines, greeting, opening and request wording, table, amounts, payment line, sign-off and footer.
- `brand/voice.md`: the ITM voice, and the words we never use.

## 4. Choose each greeting

You can't ask the accounts team from here, so:

- If the contact's name starts with "Dr.", write `Dear Doctor <first name>,`.
- Otherwise, Grep the drafts from earlier weeks (`chase/*/emails/*.md`) for the same `To:` address. If an earlier draft was found, reuse its greeting. Those titles were confirmed by the accounts team.
- If no earlier draft was found, write `Dear Mr. <first name>,` and add the contact to "needs attention" as "title not confirmed: check with the accounts team before sending".

## 5. Write the drafts

For each customer in CUSTOMERS, write `chase/<date>/emails/<customer-slug>.md`. The slug is the customer name in lower case, with spaces and dots turned into hyphens, for example `meridian-freight-pvt-ltd`.

- If that file already exists, do not overwrite it. Add it to "needs attention" as "draft already exists".
- Fill the template:
  - `{{contact}}`, `{{email}}`, `{{customer}}`: from the script's customer line.
  - `{{total}}`: the customer's total from the script.
  - `{{as_of}}`: the long date from the script's "As of:" line, for example "Sunday 15 November 2026".
  - `{{invoice_rows}}`: one row per invoice: `| <invoice> | <date> | <amount> | <days> |`, copied from the script's invoice lines.
  - `{{opening}}` and `{{request}}`: pick the wording from `.claude/rules/reminders.md` by the customer's "oldest" days (30 or less, 31 to 90, or over 90). Over 90 days, say "invoice" for one invoice and "invoices" for more.
- Keep the Subject line to 70 characters or fewer and the Preview line to 90 or fewer.
- Do not write HTML copies. Do not commit.

## 6. Check before you reply

- Grep the new drafts for three backticks, "legal", "lawyer", "court", "late fee", "As per my last email", "Urgent" and "Final warning". Fix any match.
- Check that every draft's Total row matches the script's total for that customer.

## 7. Reply with a short summary only

```
Reminders written: <number> (in chase/<date>/emails/)
Total being chased: PKR <grand total from the script>
Needs attention:
- <customer> (<invoice>): <reason>
```

Write "Needs attention: none" if the list is empty. Add nothing else.
