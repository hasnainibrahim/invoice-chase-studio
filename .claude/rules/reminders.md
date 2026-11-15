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

## Greeting

Greet the contact by first name: `Dear {{first_name}},`

This replaces the "title and surname" greeting in `brand/voice.md` for reminder files.

## Invoice table

- List every open invoice for that customer in one Markdown table.
- Use exactly these columns, in this order: `Invoice | Date | Amount (PKR) | Days outstanding`
- End the table with a **Total** row.
- The total must equal the sum of the rows above it. Work it out with a command, never by hand.

## Amounts

- Copy every amount exactly from the sheet. Never round or change one.
- Write amounts with thousands separators, for example `1,168,000`.

## How to pay or ask a question

Give one way to pay or ask a question: `{{payment_details}}` and `accounts@itm.example`.

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

You're receiving this because {{customer}} has open invoices with ITM.

Do not add an "already paid? ignore this" line or a thank-you line. The voice guide forbids both.
