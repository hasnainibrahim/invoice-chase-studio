---
paths:
  - "chase/**/emails/*.md"
---

# Reminder email rules

These rules apply to every reminder email file, and only to reminder files. Follow `brand/voice.md` for everything else. Where this file and the voice guide differ, this file wins for reminders.

## Header lines

Every reminder file starts with these three lines, in this order:

1. `To: Name <address>`. Use the contact name and email address from the sheet for that customer, and no other.
2. `Subject: ...`. Keep it to 70 characters or fewer.
3. `Preview: ...`. Keep it to 90 characters or fewer.

The `Preview:` line is the email's preheader. It is never pasted into the body. The send-ready HTML copy puts it in a hidden preheader.

## Greeting

- Men: `Dear Mr. {{first_name}},` This is the default, because most of our contacts are men.
- Women: `Dear Madam,` with no name, for a contact the accounts team confirms is a woman.
- Where the sheet shows "Dr.": `Dear Doctor {{first_name}},` with "Doctor" written in full.
- Never guess the title from the name. Each week, before drafting, list every contact and ask the accounts team which ones should not get "Mr.". Do not draft until they answer.

## Opening and request

Payment terms are 30 days, as confirmed by the accounts team. The sheet has no due dates, so the wording depends on how old each invoice is on the day the drafts are written. Name that day as the date of our records, for example "according to our records on Sunday 15 November 2026". Count Days outstanding from the invoice date to that day with a command, never by hand.

- **Oldest invoice 30 days or less** (not yet due on 30-day terms): send it as a statement. Open with "Please find below a statement of the open invoices on the account of {{customer}}, according to our records on {{as_of}}." Ask: "Kindly arrange payment of the outstanding balance of PKR {{total}} by its due date."
- **Oldest invoice 31 to 90 days:** open with "According to our records on {{as_of}}, the account of {{customer}} has {{invoice_count}} open {{invoices_word}} with an outstanding balance of PKR {{total}}, shown below." Ask: "Kindly arrange payment of the outstanding balance of PKR {{total}}."
- **Oldest invoice over 90 days:** use the 31 to 90 day wording, then add "Please let us know if you need a copy of the invoice." (or "invoices" when there is more than one).

## Invoice table

- List every open invoice for that customer in one Markdown table.
- Use exactly these columns, in this order: `Invoice | Date | Amount (PKR) | Days outstanding`
- End the table with a **Total** row.
- The total must equal the sum of the rows above it. Work it out with a command, never by hand.
- The Markdown file is the source. Never paste the Markdown table into an email. Send the HTML copy, which shows a real table.

## Amounts

- Copy every amount exactly from the sheet. Never round or change one.
- Write amounts with thousands separators, for example `1,168,000`.

## How to pay

Give the payment details on one line:

`Payment details: Bank: Example Bank, Account 0000-0000000`

This is practice text. Real bank details go in only at send time, never in the repo. Questions are covered by the sign-off, so do not add a second email line.

## Never say

- No legal action. Never mention lawyers, courts or debt collectors.
- No late fees.
- No account suspension, and no stopping service, support, deliveries or warranty.

## Ending

End with the sign-off from `brand/voice.md`:

Should you have any query, please call or email us.

Best Regards,
Accounts Team, ITM
Email: accounts@itm.example
Phone: +92 21 0000 0000

Then add this footer as plain text, not inside a code block:

This statement is sent to {{customer}} because there are open invoices with ITM.

Do not add an "already paid? ignore this" line or a thank-you line. The voice guide forbids both.
