# Weekly chase plan

**As of:** Monday 9 November 2026
**Source:** `data/weekly/2026-11-09.csv` (made from `data/weekly/2026-11-09.xlsx`)
**Total outstanding:** PKR 3,026,180 across 20 invoices and 20 customers

No accounting system is connected. Every number here comes from the weekly sheet, and every total was worked out with a command, not by hand. The bucket totals add up to the same PKR 3,026,180 as the sheet's Total row.

"Age" means days from the invoice date to 9 November 2026. The sheet has no due dates or payment terms, so this is not "days past due".

## Aging

| Bucket | Invoices | Total |
|---|---|---|
| 0-30 days | 9 | PKR 2,028,100 |
| 31-60 days | 3 | PKR 99,600 |
| 61-90 days | 2 | PKR 244,900 |
| 90+ days | 6 | PKR 653,580 |
| **All** | **20** | **PKR 3,026,180** |

Two out of three rupees owed (PKR 2,028,100) are less than 31 days old. The 90+ bucket is smaller (PKR 653,580), but it holds the oldest debts. Falconridge Security Systems (502 days) and Silverline Enterprises (273 days) make up most of it.

## Customers

Oldest first. Each customer has one open invoice this week.

| Customer | Invoices | Total owed | Oldest invoice age |
|---|---|---|---|
| Falconridge Security Systems | 1 (KITM18864) | PKR 309,160 | 502 days |
| Helix Pharma Pvt Ltd | 1 (KITM19028) | PKR 7,000 | 454 days |
| Sunrise Leather Works | 1 (KITM19536) | PKR 8,520 | 313 days |
| Silverline Enterprises | 1 (KITM19624) | PKR 312,000 | 273 days |
| AirBridge Cargo Services | 1 (KITM19939) | PKR 8,900 | 153 days |
| Skyline Aero Consultants | 1 (KITM20015) | PKR 8,000 | 115 days |
| Bytecraft Software House | 1 (KITM20101) | PKR 6,900 | 89 days |
| Indus Continental Traders | 1 (KITM20157) | PKR 238,000 | 66 days |
| Meridian Freight Pvt Ltd | 1 (KITM20201) | PKR 2,700 | 49 days |
| Global Learning Council | 1 (KITM20232) | PKR 94,400 | 39 days |
| CodeNest Solutions | 1 (KITM20260) | PKR 2,500 | 33 days |
| Oceanic Consolidators | 1 (KITM20277) | PKR 27,600 | 28 days |
| Northwind Supply Chain | 1 (KITM20298) | PKR 76,300 | 21 days |
| Pinnacle Technologies | 1 (KITM20299) | PKR 11,500 | 21 days |
| Crescent Health Services | 1 (KITM20305) | PKR 1,168,000 | 19 days |
| City Care Hospital | 1 (KITM20307) | PKR 385,000 | 18 days |
| Civic Futures Foundation | 1 (KITM20314) | PKR 246,500 | 17 days |
| Greenleaf Publishers | 1 (KITM20320) | PKR 11,800 | 13 days |
| Valley Woollen Mills | 1 (KITM20324) | PKR 82,500 | 12 days |
| QuickRide Logistics | 1 (KITM20329) | PKR 18,900 | 11 days |

## Weekly rhythm

1. **Monday morning:** the accounts team updates the sheet of unpaid invoices and saves it as `data/weekly/YYYY-MM-DD.xlsx`, named for that Monday.
2. **Monday, 9:00 AM Pakistan time:** the sheet is imported with `scripts/import-week.mjs`, and one reminder per customer is drafted into `chase/YYYY-MM-DD/emails/`.
3. **You approve and send.** You read each draft, fix or hold any that look wrong, and send the approved ones yourself. The studio never emails a customer.
4. **Paid invoices drop off.** When a customer pays, the invoice is left off next week's sheet. It is never edited or deleted in this week's files.

## The reminders

- **One reminder per customer.** If a customer has more than one open invoice, all of them go in the same email. This week every customer has exactly one.
- **Each reminder lists:** every open invoice number, its date and its amount in PKR (copied exactly from the CSV), and the customer's total outstanding balance.
- **One standard tone:** the polite, professional tone in `brand/voice.md`.
  - Open with a title and first name, for example "Dear Mr. Imran,". The title is "Mr." by default, "Madam" for a contact confirmed as a woman, and "Doctor", written in full, where the sheet shows "Dr.".
  - Use "outstanding balance" and "Kindly arrange payment of the outstanding balance."
  - Keep it short and direct.
  - End with the standard ITM sign-off, which includes "Should you have any query, please call or email us."
  - No threats, late fees, talk of stopping service, "already paid? ignore this" line or thank-you for their business.
- **No firmer tone yet.** The voice guide allows a firmer tone for customers who are often late. But we have no payment history to show who those customers are, so this week everyone gets the same standard tone. The oldest accounts (Falconridge, Helix, Sunrise, Silverline) are worth reviewing before next week.
- **To:** the email address in the CSV for that customer, and no other.

## Risks and how we prevent them

| Risk | How we prevent it |
|---|---|
| **A wrong amount** in a reminder | Amounts come only from the CSV, which the script copies straight from the sheet. Nobody types or rounds an amount. Before sending, a command checks that each reminder's total matches the CSV. |
| **Chasing an invoice that is already paid** | Paid invoices drop off the next Monday sheet, so a payment made mid-week can still be on this week's sheet. Before you send, check with accounts for any payment since Monday morning, and hold that customer's reminder. |
| **A wrong email address** | The To: address is copied from the CSV for that customer only. A command checks each draft's To: line against the CSV. In this studio every address must end in `.example`. |
| **A wrong title or name** in the greeting | The sheet gives a name but usually no title. Use the title on the sheet where there is one (for example "Dr. Salman Yusuf"). Otherwise, each week before drafting, ask the accounts team to confirm which contacts are "Mr." and which are "Madam". Never guess it from the name. |
| **A reminder that breaks the voice guide** | Check every draft against `brand/voice.md` before it is approved, especially the "never say" list. |
| **Real customer data in the repo** | Only the made-up practice sheet is used here. Real sheets go in `data/real/`, which git ignores. |
