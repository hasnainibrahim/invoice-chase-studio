# Invoice Chase Studio

A Claude Code studio that writes one polite payment reminder per customer each week for ITM, an IT and AV supplier in Karachi.

Every Monday, the studio takes the sheet of unpaid invoices and groups the invoices by customer. It then writes one statement email for each customer who owes money. A separate, read-only review checks every rupee against the sheet. Nothing reaches a real customer: the studio writes drafts only, and practice sends go to Resend test addresses or to the owner's own address.

Built for the Panaversity **FDE-102 Email Studio Lab**.

> **All data in this repo is made up.** The customers are practice customers, and every email address ends in `.example`. Real sheets go in `data/real/`, which git ignores.

---

## What one week looks like

The rehearsal week is **Monday 23 November 2026**.

| | |
|---|---|
| Sheet | `data/weekly/2026-11-23.xlsx` → `data/weekly/2026-11-23.csv` |
| Open invoices | 19, across 17 customers |
| Total being chased | PKR 2,732,380 |
| Reminders written | 17, in `chase/2026-11-23/emails/` |
| Automatic review | 0 findings, exit code 0 |

One reminder, shortened, from `chase/2026-11-23/emails/crescent-health-services.md`:

```
To: Imran Qureshi <imran.qureshi@crescenthealth.example>
Subject: 3 open invoices with ITM: PKR 1,225,500 outstanding

Dear Mr. Imran,

According to our records on Monday 23 November 2026, the account of
Crescent Health Services has 3 open invoices with an outstanding
balance of PKR 1,225,500, shown below.

| Invoice   | Date        | Amount (PKR) | Days outstanding |
|-----------|-------------|--------------|------------------|
| KITM20305 | 21 Oct 2026 | 1,168,000    | 33               |
| KITM20401 | 11 Nov 2026 | 45,000       | 12               |
| KITM20402 | 12 Nov 2026 | 12,500       | 11               |
| Total     |             | 1,225,500    |                  |

Kindly arrange payment of the outstanding balance of PKR 1,225,500.

Should you have any query, please call or email us.

Best Regards,
Accounts Team, ITM
```

---

## The Monday routine

1. **Import the sheet.** Save the new `.xlsx` in `data/weekly/`, then run:
   ```
   node scripts/import-week.mjs data/weekly/2026-11-23.xlsx --as-of 2026-11-23
   ```
   This writes a clean `.csv` and prints each customer's invoices, total and oldest invoice. Amounts are copied exactly. Rows with no email address, or with an amount of zero or less, are listed under "needs attention".
2. **Write the reminders.** In Claude Code, run `/weekly-chase data/weekly/2026-11-23.xlsx`. The skill runs in its own forked context. It fills `chase/templates/emails/weekly-statement.md` once for each customer and picks the opening by the age of the oldest invoice.
3. **Review them.** Run the automatic money check:
   ```
   node scripts/review.mjs chase/2026-11-23 data/weekly/2026-11-23.csv
   ```
4. **Fix and review again** until the review reports no high-severity finding.
5. **Send** only after the owner approves. Both send guards run before every Resend call.

---

## How the reminders stay correct

### 1. Rules Claude always follows

| File | What it controls |
|---|---|
| `CLAUDE.md` | Studio rules: plain English, PKR amounts copied exactly, drafts only, no real customer data, ask before deleting. |
| `brand/voice.md` | ITM's voice: **Professional. Respectful. Direct.** Words to use and avoid, the sign-off, and things a reminder must never say (no legal threats, late fees or stopping service). |
| `.claude/rules/reminders.md` | Loads only for reminder files. Sets the header lines, greeting, opening by invoice age, table columns, payment line and footer. |
| `data/CLAUDE.md` | Loads only for the data folder. Practice customers only, and never edit an amount. |

**Opening by invoice age** (payment terms are 30 days):

| Oldest invoice | Opening |
|---|---|
| 30 days or less | "Please find below a statement of the open invoices…", and asks for payment "by its due date". |
| 31 to 90 days | Gives the number of open invoices and the outstanding balance first. |
| Over 90 days | Same as 31 to 90 days, and offers a copy of the invoice. |

### 2. Numbers come from the sheet, never by hand

Counts, totals and days outstanding are worked out by scripts. The weekly-chase skill also checks every draft's Total row against the sheet before it replies.

### 3. A fresh-eyes review that runs by itself

`scripts/review.mjs` runs `claude -p` headless, with read-only tools (`Read`, `Glob`, `Grep`). It checks every reminder against the CSV, the voice guide and the reminder rules.

- **Separate session.** The session that wrote the reminders reads its own work kindly. A new run sees only the files, like an auditor.
- **JSON that matches a schema.** The answer must match `review/findings.schema.json`: each finding has `file`, `line`, `severity` (`high`, `medium` or `low`), `problem` and `fix`. So a program can count the findings and pick the exit code.
- **Exit codes as a gate:**

  | Code | Meaning |
  |---|---|
  | 0 | No high-severity finding. Safe to move on. |
  | 1 | At least one high finding: a wrong amount, a wrong total, a missing or extra invoice, or a wrong address. |
  | 2 | The review itself could not run. `findings.json` is not changed. |

- **Remembers the last review.** If `review/findings.json` is from the same folder, its findings go into the next prompt, so the review reports only problems that are new or still not fixed.

**Tested on a bad draft.** `chase/test-bad/emails/01-bad.md` was written to fail. It includes an invoice that was already paid (KITM20157), a total that doesn't match its rows, and the line "Pay within 24 hours or we will take legal action." The review caught all three as high severity and exited with code 1. See `review/findings-test-bad.json`.

### 4. Send guards

`.claude/settings.json` runs two `PreToolUse` hooks before every Resend tool call. If a hook fails, the call is blocked.

| Hook | What it blocks |
|---|---|
| `scripts/guard-resend.mjs` | Any recipient that is not a Resend test address (`@resend.dev`) or the owner's address. |
| `.claude/hooks/send-guard.mjs` | Wrong recipients. Tools that can reach whole lists (broadcasts, automations, inbox sends). Forbidden wording such as "legal action", "late fee" or "suspend". |

The owner's address is set as `CHASE_OWNER_EMAIL` in `.claude/settings.local.json`, which git ignores, so it never appears in the repo.

---

## Folders

```
brand/      ITM's voice and tone (voice.md)
data/       Weekly sheets (.xlsx) and the clean .csv made from each
  real/     Real sheets. Ignored by git.
chase/      Reminder drafts, one folder per week
  templates/  The weekly statement template
  test-bad/   A draft written to fail, for testing the review
review/     Review schema and the latest findings
scripts/    import-week.mjs, review.mjs, guard-resend.mjs
notes/      Research, decisions and test results, in plain English
.claude/    Reminder rules, the weekly-chase skill, hooks and settings
```

---

## Set up

You need **Node.js** (tested on v24) and **Claude Code**.

```
npm install
```

To try practice sends, create `.claude/settings.local.json` (git ignores it):

```json
{
  "env": {
    "CHASE_OWNER_EMAIL": "you@your-domain.com"
  }
}
```

The Resend connection is set in `.mcp.json`. With no API key set, it uses a practice key and a local address, so nothing goes out.

---

## Claude Code features used

| Feature | Where |
|---|---|
| Project memory (`CLAUDE.md`, with `@brand/voice.md` imported) | `CLAUDE.md` |
| Folder-level memory | `data/CLAUDE.md` |
| Path-scoped rules | `.claude/rules/reminders.md` (applies to `chase/**/emails/*.md`) |
| Custom skill | `.claude/skills/weekly-chase/SKILL.md` |
| Plugin from a marketplace | `small-business` plugin, enabled in `.claude/settings.json` |
| MCP server | Resend, in `.mcp.json` |
| Hooks (`PreToolUse`, block on failure) | `.claude/settings.json`, `scripts/guard-resend.mjs`, `.claude/hooks/send-guard.mjs` |
| Headless mode with structured output | `scripts/review.mjs` (`claude -p --output-format json --json-schema`) |
| Fresh-session review | `notes/review-lessons-2026-11-15.md` |

---

## Notes and decisions

| Note | About |
|---|---|
| `notes/skills-i-chose.md` | Which existing skills were researched, and why. |
| `notes/voice-test-2026-11-15.md` | Testing the voice guide. |
| `notes/angle-a.md`, `notes/angle-b.md`, `notes/handoff.md` | Two ways to open the statement. Angle A (lead with the numbers) was chosen. |
| `notes/review-lessons-2026-11-15.md` | Why the review runs in a fresh session. |
| `notes/resend-test-2026-11-15.md` | End-to-end practice send through Resend. |
| `notes/guard-check-2026-11-15.md` | Checking both send guards after a session reset. |
| `notes/setup-check-2026-11-15.md` | Checking the studio setup. |
