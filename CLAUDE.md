# Invoice Chase Studio

This studio prepares one payment reminder per customer each week for ITM, an IT and AV company in Karachi. Each Monday we take the sheet of unpaid invoices, group the invoices by customer, and draft one polite reminder for each customer who owes money.

## Folders

- `brand/` – ITM's voice, tone and email look, so every reminder sounds like the same company.
- `data/` – the weekly sheets of unpaid invoices and the files made from them (real sheets go in `data/real/`, which git ignores).
- `chase/` – the reminder drafts for each week, one per customer.
- `scripts/` – small programs that read the sheets and prepare the data.
- `notes/` – research, decisions and checks, written in plain English.

## Rules

- Write in plain English. Use short sentences and everyday words.
- All amounts are in Pakistani rupees (PKR). Copy every amount exactly from the sheet. Never round an amount, and never work one out by hand.
- Never email a real customer from this studio. Write drafts only.
- Never put real customer names or email addresses in the repo. Use the made-up practice data, with `.example` addresses.
- Ask me before deleting anything.

## Voice

@brand/voice.md
