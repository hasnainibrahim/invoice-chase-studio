FDE-102 · Email Studio Lab · My idea

# Invoice Chase Studio

*Adapted from the Panaversity FDE-102 Email Studio Lab. The studio, data and content are my own.*

You will set up an accounts-receivable studio and run it with Claude Code. Every Monday the sheet of unpaid invoices is updated. Claude groups the invoices by customer, writes one polite statement email per customer, checks every rupee against the sheet, and queues the reminders for the owner to approve before Resend sends them. Along the way you use every Claude Code feature on the CCAR-F exam.

15 stepsabout 30–60 min eachmade-up customers onlynothing sends without you

Example · what one customer receives

ToImran Qureshi \<imran.qureshi@crescenthealth.example>

SubjectStatement of open invoices · Crescent Health Services

Dear Imran,

Here is a summary of the invoices still open on your account as of Monday 16 November 2026.

| Invoice | Date | Amount (PKR) | Days |
| --- | --- | --- | --- |
| KITM20305 | 21 Oct 2026 | 1,168,000 | 26 |
| KITM20401 | 11 Nov 2026 | 45,000 | 5 |
| KITM20402 | 12 Nov 2026 | 12,500 | 4 |
| Total | 1,225,500 |  |  |

If you've already paid, please ignore this message and accept our thanks.

The problem

IT Mechanizer exports about 260 open invoices across 59 customers from QuickBooks every week. Chasing them by hand is slow, uneven and easy to forget.

The studio

Claude Code turns each Monday's sheet into one statement email per customer, in one calm voice, with the totals checked against the sheet.

The result

Every Monday at 9:00 AM Pakistan time, the reminders are waiting in the sheet. The owner ticks the ones to send, and Resend delivers them. Paid invoices drop off on their own.

## Before you start

1. Install **Node.js 22 or newer** from nodejs.org. Check with `node --version`.
2. Install **Git**. Check with `git --version`. On Windows, install Git for Windows, because Claude Code uses its Git Bash.
3. Install **Claude Code**: `npm install -g @anthropic-ai/claude-code`, then sign in when you first run `claude`.
4. Keep your practice sheet handy: `ITM Outstanding with Email.xlsx`, 20 invoices with made-up customers and `.example` addresses. Invoice numbers, dates and amounts are real; names and emails are not.
5. A Google account for Google Sheets, and a free Resend account. You only need them in step 14.
6. Make your studio folder and open Claude Code in it: `mkdir my-invoice-studio` · `cd my-invoice-studio` · `git init` · `claude`

How every step works

1 · Build**Paste the build prompt**In Claude Code, in your studio folder.

2 · Fresh**Start a new session**Type `/exit`, then run `claude` again.

3 · Check**Paste the check prompt**A fresh Claude tests your work. It didn't build it, so it's honest.

4 · Done**Answer its questions**Then tick Done on the step.

## Your studio at the end

```
my-invoice-studio/
├── CLAUDE.md                  the studio's rules
├── brand/voice.md             how our reminders sound
├── data/
│   ├── weekly/2026-11-09.xlsx this week's sheet
│   ├── weekly/2026-11-09.csv  the same, cleaned
│   └── CLAUDE.md              rules for this folder only
├── chase/
│   ├── plan.md                the weekly chase plan
│   ├── templates/emails/      the statement email
│   └── 2026-11-09/emails/     one reminder per customer
├── .claude/
│   ├── rules/reminders.md     rules for every reminder
│   ├── skills/weekly-chase/
│   └── hooks/send-guard.mjs
├── .mcp.json                  practice mailbox
├── scripts/import-week.mjs    .xlsx to .csv
├── scripts/review.mjs         automatic money check
└── apps-script/Code.gs        Monday queue, sends via Resend
```

**Claude will ask permission** before it writes inside `.claude/` or to `.mcp.json`. That's normal. Read what it wants to do, then approve.

**Real customer data never enters this repo.** You practise with the anonymised sheet. The live QuickBooks export goes straight into the Google Sheet in step 14.

0 of 15 done

Part 1 · Plan and write

1. [1Look before you build](#step-1)
2. [2Set up your studio](#step-2)
3. [3Your collections voice](#step-3)
4. [4This week's sheet](#step-4)
5. [5Plan the weekly chase](#step-5)
6. [6Reminder rule and template](#step-6)
7. [7Fresh-eyes review](#step-7)
8. [8Your own skill](#step-8)

Part 2 · Send safely

1. [9Connect a practice mailbox](#step-9)
2. [10The safety guard](#step-10)
3. [11Two practice Mondays](#step-11)

Part 3 · Work like a team, then go live

1. [12Resume and fork](#step-12)
2. [13Automatic money check](#step-13)
3. [14Go live with Resend](#step-14)

Stretch · For fast finishers

1. [15Who pays late](#step-15)

[Before you start](#start)[Your Monday routine](#routine)[Exam map](#exam-map)[Words you'll see](#words)

Part 1 · Steps 1–8

## Plan and write

Set up the studio, give it a collections voice, import this week's sheet and write the reminders. Nothing gets sent in this part.

Step01

Real-world habit2.4

### Look before you build

Search for skills other people made for chasing invoices, and decide which ones to trust.

[ ] Done

**In plain words:** a skill is like an app for Claude. Before you build one, look in the app store. Download counts can be faked, so also check who made it.

BuildPaste in Claude Code

```
I'm setting up an invoice-chase studio in this folder. Every week we update a sheet of unpaid invoices and want to send each customer a polite payment reminder. Before I build anything myself, I want to find skills other people have already made.

1. Search the skills directory at skills.sh by running these one at a time:
   npx skills find invoice reminder
   npx skills find accounts receivable
   npx skills find google apps script
   npx skills find resend
2. For the most promising results, find out who publishes each one and how many stars its GitHub repository has. Look out for official publishers such as anthropics and google.
3. Also check whether Anthropic's plugin marketplace at github.com/anthropics/knowledge-work-plugins has anything for chasing unpaid invoices.
4. Write notes/skills-i-chose.md in plain English with three short sections:
   - Use these: the two sources you recommend for chasing invoices and drafting email, and why.
   - Avoid these: two results you would not trust, and why.
   - How I decided: the three things I should check before installing any skill.

Don't install anything yet.
```

CheckNew session: /exit, then claude, then paste

```
Check my work in notes/skills-i-chose.md. Don't change any files. Test it, don't just read it:

1. For each skill the note recommends, confirm it still exists today: look at its page on skills.sh or its folder in the GitHub repository. Tell me if any has been renamed, merged or removed.
2. Run one of the searches again (for example npx skills find invoice reminder) and confirm the install numbers in the note are roughly right.
3. Is anything recommended from a publisher whose repository has very few GitHub stars?

Give me a short table: Check | OK or Problem | What you found.
Then ask me two quick questions, one at a time, to see if I understand why install counts alone aren't enough.
```

You'll know it worked when

- The note picks official or well-known sources, like Anthropic's **Small Business** plugin, which has an `invoice-chase` skill.
- It warns you off a result with thousands of installs but only a handful of GitHub stars.
- The check may find a skill that was renamed or merged. Ask Claude to fix the note.

Exam note

The exam asks the same question about MCP servers: for a standard need, use an existing community server first, and build your own only for work that is special to your team.

Step02

3.1

### Set up your studio

Install a plugin for this project only, and write the studio's CLAUDE.md.

[ ] Done

**In plain words:** CLAUDE.md is the studio's notice board. Claude reads it every time it starts work here. A plugin installed for this project is like equipment fixed to this office's wall: anyone who joins the team gets it too.

BuildPaste in Claude Code

```
Let's set up my invoice-chase studio in this folder.

1. Install Anthropic's official Small Business plugin for this project only, by running these two commands:
   claude plugin marketplace add anthropics/knowledge-work-plugins --scope project
   claude plugin install small-business@knowledge-work-plugins --scope project
2. Create five folders: brand, data, chase, scripts and notes.
3. Write a CLAUDE.md for the studio in plain English. Include: what the studio is for (sending one weekly payment reminder per customer for IT Mechanizer, an IT and AV company in Karachi), a one-line description of each folder, and these rules: write in plain English; amounts are in Pakistani rupees (PKR) and are copied from the sheet, never rounded or worked out by hand; never email a real customer from this studio; never put real customer names or email addresses in the repo; ask me before deleting anything.
4. Create a .gitignore that ignores .claude/settings.local.json, node_modules/, data/real/ and system files like .DS_Store and Thumbs.db.
5. Commit everything with a clear message.

Then tell me what I have to do so the plugin loads.
```

Then

1. Type `/exit` and run `claude` again. Plugins load when a session starts.
2. Accept the prompts to trust the folder and the plugin.
3. Type `/small-business:` and you should see the plugin's skills appear.

CheckNew session, then paste

```
Check that my studio is set up correctly. Don't change any files. Test it, don't just read it:

1. Is the Small Business plugin turned on for this project only? Compare .claude/settings.json with what `claude plugin list` says about its scope.
2. Can you use the plugin here right now? List the plugin skills you can see whose names include invoice, cash or bills.
3. If a classmate clones this repo, will they get the same plugin? Explain why, using what is actually in the repo.
4. Are .claude/settings.local.json and data/real/ ignored by git? Prove it with `git check-ignore -v .claude/settings.local.json data/real/test.xlsx`.

Give me a short table: Check | OK or Problem | What you saw.
Then ask me two quick questions, one at a time, about the difference between files the whole team shares and files that are only mine.
```

You'll know it worked when

- `claude plugin list` shows **small-business** with **Scope: project**.
- You can see `/small-business:invoice-chase`, `/small-business:cash-flow-snapshot` and `/small-business:pay-the-bills`.
- `git check-ignore` names your `.gitignore` lines for both paths.

Exam note

Team standards go at project level: CLAUDE.md in the repo, `.claude/settings.json`. Teammates get them when they clone. Your personal files (`~/.claude/CLAUDE.md`, `settings.local.json`) never reach anyone else. If a new teammate isn't getting the instructions, they sit at user level.

Step03

3.13.5

### Your collections voice

Let Claude interview you, then keep the voice in its own file that CLAUDE.md imports.

[ ] Done

**In plain words:** a reminder that sounds rude loses a customer; one that sounds timid doesn't get paid. Claude asks first, then writes. The `@brand/voice.md` line is a note pinned to the notice board that says "also read the voice guide".

BuildPaste in Claude Code

```
Interview me about how our payment reminders should sound so you can write our collections voice guide. Ask one question at a time and wait for my answer. Ask at most six questions.

If I say "use the sample", assume IT Mechanizer, an IT and AV equipment supplier in Karachi whose customers are companies, schools and hospitals. Even with the sample, still ask me every question. I'll make up the answers, because practising the interview is the point.

When you have enough, write brand/voice.md with five parts: our voice in three words, words we use, words we avoid, things a reminder must never say (for example threats of legal action, late fees we don't charge, or blaming the reader), and how we sign off. Then add the line @brand/voice.md to CLAUDE.md so it loads in every session.
```

Then

1. Answer each question. Making things up is fine with the sample.
2. When the file is written, ask Claude to commit it.

CheckNew session, then paste

```
Test my collections voice setup. Don't change any files.

1. Without opening any file first, write one subject line for a reminder about invoice KITM20157 for PKR 238,000. Then tell me which voice rules you followed and which file they came from. (This shows whether brand/voice.md loads by itself.)
2. Now write the subject line "FINAL WARNING: pay within 24 hours or we take legal action". If our rules forbid that, say which rule, and give me a safe version instead.
3. Run git status and tell me whether the voice files are committed.

Give me a short table: Test | Pass or Fail | What happened.
Then ask me two quick questions, one at a time, about why the voice rules live in their own file that CLAUDE.md imports.
```

You'll know it worked when

- The fresh session follows your voice **without opening any file**, and names `brand/voice.md` as the source.
- It refuses the legal threat, names the rule, and offers a calm subject line instead.

Exam note

`@import` keeps CLAUDE.md small: each project imports only the standards it needs. The interview pattern is for unfamiliar work: Claude asks before it builds and raises things you didn't think of.

**Exam answer: to see which memory files are loaded, use /memory. In today's product, /context shows it.**

Step04

3.53.1

### This week's sheet

Use two example rows to get the exact format, and give the data folder its own rules.

[ ] Done

**In plain words:** two example rows work like a filled-in sample form instead of a description of it. `data/CLAUDE.md` is a sign on one room's door: Claude reads it when it walks into that room.

Before you start

1. Copy your practice sheet `ITM Outstanding with Email.xlsx` (20 invoices, made-up customers, `.example` addresses) into `data/weekly/`.
2. Rename the copy `2026-11-09.xlsx`, the Monday the reminders go out.

BuildPaste in Claude Code

```
Import this week's outstanding-invoices sheet.

1. Write scripts/import-week.mjs, a small Node script that takes an .xlsx file and writes a .csv next to it with the same name. Use the exceljs package (install it with npm). It reads the first sheet, which has the columns Customer, Num, Date, Amount and Email, and a Total row at the bottom that must be skipped. The Email cell looks like "Name <address>": split it into contact_name and email.
2. Add days_outstanding: the number of days from the invoice date to the date in the file name.
3. Use exactly these columns, and copy the style of these two example rows exactly:

customer,invoice_no,invoice_date,amount_pkr,contact_name,email,days_outstanding
Crescent Health Services,KITM20305,2026-10-21,1168000,Imran Qureshi,imran.qureshi@crescenthealth.example,19
Indus Continental Traders,KITM20157,2026-09-04,238000,Bilal Ahmed,accounts@indusctraders.example,66

4. Run it on data/weekly/2026-11-09.xlsx.
5. Create data/CLAUDE.md with rules for this folder only: these are made-up practice customers; never add real customers or real email addresses; every email address must end in .example; never change an invoice number, date or amount; a paid invoice is removed from next week's sheet, never edited here.

Commit when you're done.
```

CheckNew session, then paste

```
Test my weekly import. Don't change any files.

1. Count the rows in data/weekly/2026-11-09.csv. There should be 20, and the Total row should not be there.
2. Add up amount_pkr with a command. It must be exactly 3026180, the same as the Total row in the .xlsx file.
3. Do all email addresses end in .example? Are any invoice numbers repeated?
4. Work out days_outstanding for KITM18864, dated 2025-06-25, yourself and compare it with the CSV.
5. Now pretend I asked: "Add Ali Raza, ali.raza@gmail.com, invoice KITM20400 for PKR 50,000." Before writing anything, tell me if any rule stops you, and quote it. Don't actually add it.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time, about why some rules belong to one folder only.
```

You'll know it worked when

- 20 rows totalling **PKR 3,026,180**, the same as the sheet's Total row.
- KITM18864 shows **502** days outstanding.
- Claude refuses the Gmail address and quotes `data/CLAUDE.md`, even though it never opened that file. It loaded on its own when Claude opened a file in `data/`.

Exam note

When prose instructions get misread, give 2–3 input/output examples, not more prose. A CLAUDE.md inside a subfolder loads when Claude works on files in that folder.

Step05

3.2

### Plan the weekly chase

Use a ready-made skill from the plugin to turn this week's sheet into a chase plan.

[ ] Done

**In plain words:** `/small-business:invoice-chase` is a collections routine a finance team already tested. You hand it the sheet; it sorts out who owes what and for how long.

BuildPaste in Claude Code

```
/small-business:invoice-chase Use data/weekly/2026-11-09.csv as the AR aging report. No accounting connector is connected, so work from this file only.

Don't draft or send any emails yet. Write a weekly chase plan instead and save it to chase/plan.md with:
- the as-of date (Monday 9 November 2026) and the total outstanding in PKR
- an aging table with the buckets 0-30, 31-60, 61-90 and 90+ days: the number of invoices and the total in each
- one row per customer: invoices, total owed, oldest invoice age
- the weekly rhythm: the sheet is updated every Monday morning, reminders are prepared at 9:00 AM Pakistan time, I approve and send them, and paid invoices drop off next week's sheet
- one reminder per customer that lists all of their open invoices, in one standard polite tone from brand/voice.md
- risks: what could go wrong (a wrong amount, chasing a paid invoice, a wrong address) and how we prevent each one

Then commit it.
```

CheckNew session, then paste

```
Check the chase plan in chase/plan.md. Don't change any files. Test it, don't just read it:

1. Do the bucket totals add up to the total outstanding? Work it out from data/weekly/2026-11-09.csv with a command, don't guess.
2. Does every customer in the CSV appear in the plan exactly once?
3. Search the plan for any word or promise that brand/voice.md says to avoid. Quote every one you find, with its line.
4. Is 9 November 2026 really a Monday? Work it out, don't guess.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time, about why we used an existing skill instead of writing our own prompt.
```

You'll know it worked when

- The aging table reads: 0–30 days **9 invoices, PKR 2,028,100** · 31–60 **3, PKR 99,600** · 61–90 **2, PKR 244,900** · 90+ **6, PKR 653,580**.
- Those add up to PKR 3,026,180, and all 20 customers appear once.
- If the skill suggests a firmer tone for slow payers, that's its tone-matching feature. Our plan uses one tone, so ask Claude to take it out.

Exam note

Skills that come with a plugin are named `/plugin:skill`, so two plugins can't clash. A skill's `description` decides when Claude reaches for it on its own. You'll write the other front-matter settings yourself in step 8.

Step06

3.3

### Reminder rule and template

Write a rule that attaches itself to every reminder file, then write this week's reminders.

[ ] Done

**In plain words:** a path rule is a sticky note that attaches itself to every reminder file, in any week's folder. CLAUDE.md is read for everything. This note shows up only when Claude works on a reminder.

Build 1 of 2Paste in Claude Code, then approve the edit

```
Create a rule that applies to every reminder email file, and only to reminder files.

Make .claude/rules/reminders.md. It must start with exactly this front matter:

---
paths:
  - "chase/**/emails/*.md"
---

Under it, write the rule in plain English. Each reminder file must:
- start with a line "To: Name <address>", then "Subject: ..." of 70 characters or fewer, then "Preview: ..." of 90 characters or fewer
- greet the contact by first name: "Dear {{first_name}},"
- list every open invoice for that customer in a Markdown table with exactly these columns: Invoice | Date | Amount (PKR) | Days outstanding
- end the table with a Total row, and the total must equal the sum of the rows
- write amounts with thousands separators, like 1,168,000, copied from the sheet
- give one way to pay or ask a question: {{payment_details}} and accounts@itmechanizer.example
- never threaten legal action, late fees or account suspension
- end with our sign-off from brand/voice.md, then this two-line footer as plain text, not inside a code block:
  You're receiving this because {{customer}} has open invoices with IT Mechanizer.
  If you've already paid, please ignore this message and accept our thanks.

Commit when you're done.
```

Then

1. Start a new session (`/exit`, then `claude`) so the new rule is picked up.

Build 2 of 2Paste in the new session

```
Write this week's reminders.

First write the template chase/templates/emails/weekly-statement.md, using placeholders such as {{contact}}, {{customer}}, {{first_name}}, {{invoice_rows}} and {{total}}.

Then, for every customer in data/weekly/2026-11-09.csv, write one reminder from that template that lists all of that customer's open invoices. Use chase/plan.md for the timing and key message, and brand/voice.md for our voice. Save each one as chase/2026-11-09/emails/<customer-name-in-kebab-case>.md. Then commit.
```

CheckNew session, then paste

```
Test the reminders in chase/2026-11-09/emails/. Don't change any files. Measure, don't eyeball: count characters and add up amounts with a command where you can.

For each reminder file, check:
1. The Subject line is 70 characters or fewer, and the Preview line is 90 or fewer. Give the real counts.
2. The To: address is the one in data/weekly/2026-11-09.csv for that customer.
3. Every invoice number, date and amount in the table matches the CSV exactly, and no invoice is missing.
4. The Total row equals the sum of the rows.
5. It ends with the footer from .claude/rules/reminders.md as plain text, and uses no word or threat that brand/voice.md forbids.

Give me one table with a row per file and a column per check (Pass or Fail, with the number or quote when it fails).
Then ask me two quick questions, one at a time, about why this rule uses a paths pattern instead of living in CLAUDE.md.
```

You'll know it worked when

- 20 reminder files, one per customer, each starting with `To:`, `Subject:` and `Preview:`, with real character counts under the limits.
- Every table matches the sheet to the rupee, and every Total adds up.
- The template in `chase/templates/emails/` follows the rule too, because it also sits in an `emails/` folder.

Exam note

For conventions that apply to files spread across folders, use `.claude/rules/` with `paths:` patterns. A subfolder CLAUDE.md covers one folder only. One big CLAUDE.md with headings relies on Claude guessing. A skill only works when someone runs it. Use `/context` to see which rules loaded.

Step07

3.63.52.5

### Fresh-eyes review

Review in a new session, fix related problems in one message, then confirm with search.

[ ] Done

**In plain words:** when you check your own invoice, you see what you meant to type. A new session is a second clerk who didn't write it.

Build 1 of 2New session, then paste

```
Review every reminder in chase/2026-11-09/emails/ against brand/voice.md, .claude/rules/reminders.md and data/weekly/2026-11-09.csv. Read them as the accounts manager who has to answer the phone if a customer is upset.

List every problem by severity (high, medium or low), with the file, the line and a suggested fix. A wrong amount, a missing invoice or a wrong address is always high. Don't change any files yet.
```

Build 2 of 2Same session, after you read the review

```
Fix all the problems from your review in one message, keeping all the reminders consistent with each other and with the template. If a fix means changing the template or a rule file too, change it. Leave anything only I can confirm, like our real bank details, and list it for me. Then commit.
```

CheckNew session, then paste

```
Check that the review fixes worked. Don't change any files.

1. Use Glob to list every reminder file in every week's folder.
2. Use Grep to search all of them for three backtick characters in a row, for "legal", and for every word that brand/voice.md says to avoid. There should be no matches.
3. Run git show --stat HEAD and tell me which files the last commit changed.
4. Confirm every Total row still matches data/weekly/2026-11-09.csv.

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why the review happened in a new session, and why all the fixes went in one message.
```

You'll know it worked when

- The review lists problems by severity, for example a subject line over 70 characters or a reminder that promises a call-back the team might not make.
- After the fixes, Grep finds nothing, and the last commit touched only reminder files and maybe the template or rule.

Exam note

The session that wrote something keeps its own reasoning and rarely questions it, so review in a fresh, independent session. Fixes that affect each other go in one detailed message; separate fixes can go one at a time. Glob finds files by name; Grep finds text inside files.

Step08

3.2

### Your own skill: weekly-chase

Build a skill with the three settings the exam asks about, and run it on this week's sheet.

[ ] Done

**In plain words:** a skill is a recipe card. Claude always sees the card's title, and reads the whole card only when it cooks that dish. `context: fork` sends a helper to another kitchen to do the messy work; only the finished dish comes back to you.

Build 1 of 2Paste in Claude Code, then approve the edit

```
Create my own skill for this project at .claude/skills/weekly-chase/SKILL.md.

What it does: it takes this week's sheet from data/weekly/, runs scripts/import-week.mjs on it, and writes one reminder per customer from chase/templates/emails/weekly-statement.md into chase/<date>/emails/, where <date> comes from the sheet's file name. It skips rows with no email address or an amount of zero or less, and lists them as "needs attention". When it finishes, it replies with a short summary only: how many reminders it wrote, the total PKR being chased, and the needs-attention list.

Use exactly this front matter:
---
name: weekly-chase
description: Turn this week's outstanding-invoices sheet into one payment reminder per customer. Use every Monday after the new sheet is saved in data/weekly/.
argument-hint: "[data/weekly/YYYY-MM-DD.xlsx]"
context: fork
allowed-tools: Read, Glob, Grep, Write, Bash(node scripts/import-week.mjs *)
---

If no sheet is given, it should stop and list the sheets in data/weekly/. Commit when you're done.
```

Then

1. Start a new session so the skill is picked up.

Build 2 of 2Paste in the new session

```
/weekly-chase data/weekly/2026-11-09.xlsx
```

Then

1. The skill rewrites the same week's folder. Don't commit yet: the check below uses `git diff` to compare its work with step 7's.

CheckNew session, then paste

```
Test my weekly-chase skill and what it made. Don't change any files.

1. Count the reminder files in chase/2026-11-09/emails/. There should be 20, one per customer.
2. Run git diff --stat and git diff on that folder. Invoice numbers, amounts, totals and addresses must not have changed; only wording may differ. Tell me exactly what changed.
3. Check that every file still follows .claude/rules/reminders.md: subject 70 characters or fewer, preview 90 or fewer, totals add up, footer as plain text. Measure, don't eyeball.
4. Does any reminder use a word or threat that brand/voice.md forbids? Quote it if so.

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time: what "context: fork" changed about how the skill ran, and what "allowed-tools" did.
If everything passes, I'll ask you to commit.
```

You'll know it worked when

- 20 files. `git diff` shows wording changes at most, never a changed rupee.
- Your main chat shows only the short summary, not the work itself.
- Typing `/weekly-chase` with nothing after it shows the hint `[data/weekly/YYYY-MM-DD.xlsx]`.

Exam note

`context: fork` runs the skill in its own context, so long output stays out of your chat. `argument-hint` tells you what to type when you run it with no arguments. A personal copy goes in `~/.claude/skills/` under a different name, so it doesn't clash with the team's.

**Exam answer: allowed-tools restricts which tools the skill can use. In the product it pre-approves the listed tools, and other tools still ask permission. On the exam, answer "restricts".** Here `Bash(node scripts/import-week.mjs *)` approves one command, not all of Bash.

Part 2 · Steps 9–11

## Send safely

Connect an email service through MCP, but point it at a practice mail server on your own computer. Then add a guard so no reminder can reach the wrong person, and rehearse two Mondays.

Step09

2.4

### Connect a practice mailbox

Connect an email service through MCP, with settings that are safe by default.

[ ] Done

**In plain words:** an MCP server is a phone line from Claude to another service. In practice mode that line goes to a pretend post office on your own computer, so no reminder leaves your machine. Your real Resend account comes in step 14.

Before you start

1. Open a **second terminal** window and run: `npx emulate@0.12.3 start --service resend`
2. Wait until it says **Ready** and shows `http://localhost:4000`. Leave that window open for steps 9 to 11.

BuildPaste in Claude Code, then approve the edit

```
Connect our studio to Resend, an email service, in practice mode.

Create .mcp.json in the project root with exactly this content:

{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "resend-mcp@2.27.1"],
      "env": {
        "RESEND_API_KEY": "${RESEND_API_KEY:-re_practice}",
        "RESEND_BASE_URL": "${RESEND_BASE_URL:-http://localhost:4000}",
        "SENDER_EMAIL_ADDRESS": "${SENDER_EMAIL_ADDRESS:-onboarding@resend.dev}"
      }
    }
  }
}

Then update the rule in CLAUDE.md that says never to email a real customer. Keep that rule, and add that sending through Resend is allowed only to Resend's test addresses (ending in @resend.dev) or to my own email address, and that a guard will enforce this in the next step.

Commit. Then explain in two plain sentences what happens when I set nothing, and what I would set to send for real.
```

Then

1. Start a new session and approve the **resend** server when Claude Code asks.
2. Type `/mcp`. You should see resend connected.

CheckNew session, then paste

```
Test my Resend connection. Don't change any files.

1. Use the resend MCP tools to send one email to delivered@resend.dev with the subject "Connection test" and a one-line body. Did it go through? Give me the email id.
2. Use the resend tools to list sent emails, and confirm that one shows up as delivered.
3. Search the whole repo, including git history, for anything that looks like a real Resend key: "re_" followed by a long string, other than re_practice. There should be none.
4. Is .mcp.json committed, so a classmate who clones the repo gets the same connection?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why the key is written as ${RESEND_API_KEY:-re_practice} instead of a real key, and what happens if I forget to set anything.
```

You'll know it worked when

- The test email gets an id and shows as delivered.
- No real key appears anywhere in the repo or its history.

If something goes wrong

- **Connection refused:** the practice server isn't running. Start it again in your second terminal.
- **Pending approval:** start `claude` and approve the resend server.

Exam note

The team's servers go in `.mcp.json`, which is committed. Your personal or experimental servers go in `~/.claude.json`. Credentials use `${VAR}` expansion, so no secret ever lands in the repo. `${VAR:-default}` means "use my setting if I have one, otherwise this safe value". If Claude keeps picking Grep over an MCP tool, the tool's description is too thin.

Step10

1.5

### The safety guard

Make a rule Claude cannot break, using a hook.

[ ] Done

**In plain words:** CLAUDE.md asks Claude to behave. A hook is a guard at the post office door who checks every letter before it leaves. Claude can't talk its way past the guard.

BuildReplace \[your email\] before you press Enter

```
Add a safety guard so Claude can never send a reminder to the wrong people, even by mistake. CLAUDE.md asks nicely. This guard makes sure.

1. Write .claude/hooks/send-guard.mjs, a small Node script for a PreToolUse hook. It reads the tool call as JSON from standard input and looks at tool_name and tool_input:
   - For send-email and send-batch-emails: every address in to, cc and bcc must end in @resend.dev or match my own email, which comes from the MY_EMAIL environment variable. If any address doesn't, print a short reason that names the address and exit with code 2 to block the call.
   - Also for send-email and send-batch-emails: if the subject or body contains "legal action", "late fee" or "suspend", block it with a short reason, because brand/voice.md forbids threats.
   - For send-broadcast, create-automation, send-inbox-draft and send-new-inbox-email: always block, with a short reason, because they can reach whole lists of people.
   - For anything else: exit 0 to allow it.
2. Register it in .claude/settings.json as a PreToolUse hook with the matcher mcp__resend__.* and this command:
   node "$CLAUDE_PROJECT_DIR/.claude/hooks/send-guard.mjs"
   Keep everything that is already in that file.
3. Put my own email in .claude/settings.local.json like this: "env": { "MY_EMAIL": "[your email]" }. That file is only mine and is not committed.
4. Commit the hook and .claude/settings.json.
```

Tip

Use the same email you would sign up to Resend with. In step 14, while test mode is on, every real Resend email comes to this address.

CheckNew session, then paste

```
Test the send guard for real. Don't change any files.

1. Use the resend send-email tool to send the Crescent Health Services reminder from chase/2026-11-09/emails/ to the address on its To: line. This should be blocked. Quote the block message word for word.
2. Send the same reminder to delivered@resend.dev. This should go through.
3. Send a one-line email to delivered@resend.dev with the subject "Final notice: legal action". This should be blocked by the threat check.
4. Send the Crescent reminder to my own email, the MY_EMAIL value in .claude/settings.local.json. This should go through.
5. Run git check-ignore -v .claude/settings.local.json to prove my email address is not committed.

Don't try to get around a block. Give me a short table: Test | Pass or Fail | What happened.
Then ask me two quick questions, one at a time: what the difference is between the CLAUDE.md rule and this guard, and what exit code 2 means for a hook.
```

You'll know it worked when

- The send to the customer's `.example` address is **blocked**, with the guard's own message naming it.
- The legal-threat subject is blocked too, even to a test address.
- The sends to `delivered@resend.dev` and to your own email go through.

Exam note

**Exam answer: the guide names only PostToolUse, for cleaning up tool results. It describes blocking as "tool call interception" without naming the hook.**

In the product, PreToolUse is what blocks, with exit code 2 or a deny decision, and PostToolUse can't block. On the exam, match the behaviour described.

Step11

Real-world skill

### Practice Monday, then next Monday

Send each customer's reminder to the practice mailbox, then update the sheet the way you will every week and run it again.

[ ] Done

**In plain words:** a fire drill twice: once with this week's sheet, and once with next week's, after some customers have paid and new invoices have arrived.

Build 1 of 2Paste in Claude Code

```
Let's do a practice Monday.

For each reminder in chase/2026-11-09/emails/, send it to delivered@resend.dev instead of the customer. Start each subject with the customer's name in square brackets, like [Crescent Health Services]. Replace {{payment_details}} with "Bank details on request", and leave any other placeholders as they are.

Then list the emails you sent and show me a table: customer, subject, total PKR, status.
```

Build 2 of 2Same session

```
Now rehearse next Monday, when the sheet changes.

Create data/weekly/2026-11-16.xlsx from this week's sheet with these changes, and nothing else:
- remove KITM20157, KITM20232 and KITM20329, because they were paid
- add two new made-up invoices for Crescent Health Services: KITM20401 dated 2026-11-11 for 45,000 and KITM20402 dated 2026-11-12 for 12,500

Then run /weekly-chase data/weekly/2026-11-16.xlsx and commit.
```

CheckNew session, then paste

```
Check my two practice Mondays. Don't send anything new and don't change any files.

1. Use the resend tools to list sent emails. Find the ones whose subjects start with a customer name in square brackets. Is each one delivered, and did each go only to an @resend.dev address or to my own email (MY_EMAIL in .claude/settings.local.json)? List any that didn't.
2. In chase/2026-11-16/emails/, confirm there are 17 reminders, and none for Indus Continental Traders, Global Learning Council or QuickRide Logistics.
3. Confirm the Crescent Health Services reminder lists three invoices and its total is 1,225,500.
4. Add up every Total in chase/2026-11-16/emails/ with a command. It should be 2,732,380.

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: what would change if I switched from practice mode to real email, and why the guard still matters then.
```

You'll know it worked when

- 20 practice emails, all delivered, all to test addresses.
- Next Monday has **17** reminders. The three paid invoices are gone, so nobody is chased for money they already paid.
- Crescent's three invoices arrive in **one** email, totalling PKR 1,225,500.

Part 3 · Steps 12–14

## Work like a team, then go live

Pick work up across days, check the money automatically, then put the weekly run on autopilot in Google Sheets, sending through Resend only what you approve.

Step12

1.7

### Resume and fork

Pick up earlier work by name, and try two ideas from the same starting point.

[ ] Done

**In plain words:** a named session is a bookmark. A fork is a fork in the road: two paths from the same spot. Forks share the files on your computer, but not the conversation.

Part A · Start a named session:

```
claude -n chase-angles
```

Build APaste, then /exit

```
Read chase/plan.md and three reminders from chase/2026-11-16/emails/. In five short bullets, tell me what a busy accounts-payable clerk at a customer company needs to see to pay us quickly. Don't write any files.
```

Part B · Come back later:

```
claude --resume chase-angles
```

Build BPaste, then /exit

```
Remind me: what did you say the clerk needs to see first? One sentence.
```

Part C · First fork, with its own name:

```
claude --resume chase-angles --fork-session -n angle-a
```

Build CPaste, then /exit

```
Angle A: write three subject lines and one opening sentence for the weekly statement that lead with the numbers (how many invoices, and the total). Save them to notes/angle-a.md.
```

Part D · Second fork, from the same spot:

```
claude --resume chase-angles --fork-session -n angle-b
```

Build DPaste, then /exit

```
Before you start: do you know anything about an Angle A from our conversation? Answer yes or no first.

Angle B: write three subject lines and one opening sentence for the weekly statement that lead with the relationship (thanks for their business, then the numbers). Save them to notes/angle-b.md.
```

Part E · Start fresh from a summary.

Run `claude --resume chase-angles` and ask:

*"Read notes/angle-a.md and notes/angle-b.md. Then write notes/handoff.md in 10 lines or fewer: what the clerk needs, both angles, and which one you'd pick for a customer who pays late, and why."*

Then start a brand-new session with `claude` and ask:

*"Read notes/handoff.md and continue from it: update the Subject and opening line of chase/templates/emails/weekly-statement.md with the angle you picked, then commit."*

CheckNew session, then paste

```
Check my session experiment. Don't change any files.

1. Do notes/angle-a.md and notes/angle-b.md each have three subject lines of 70 characters or fewer? Count them.
2. Does either file use the other angle's idea? They were written in separate forks, so they shouldn't.
3. Is notes/handoff.md 10 lines or fewer, and does everything it says match the files it describes?
4. Does the updated template still follow .claude/rules/reminders.md?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: when I should resume a session and when I should start fresh with a summary, and what --fork-session gave me that resuming didn't.
```

You'll know it worked when

- The resumed session remembers what it said about the clerk.
- Fork B answers "no" about Angle A's conversation. It may notice the `angle-a.md` file, because forks share files.

If something goes wrong

**"matches 2 sessions":** you forked without `-n`, so the fork kept the original name. Use one of the session ids the error prints, and name forks from now on.

Exam note

To continue a specific earlier investigation, use `--resume <session-name>`. To compare two approaches from one shared starting point, use `fork_session`; on the command line that's `--fork-session`. If the old tool results are stale, start fresh with a structured summary. If files changed since then, name the changed files so Claude re-checks only those.

Step13

3.6

### Automatic money check

Run Claude without chatting, and get results a program can read, before any reminder goes out.

[ ] Done

**In plain words:** instead of chatting, you hand Claude a job sheet and it hands back a filled-in form. The form's shape, called a schema, never changes, so a program can read it and stop the run if a rupee is wrong.

Build 1 of 2Paste in Claude Code

```
Make a review that runs without anyone typing, so it can check every Monday's reminders before they go out.

1. Create review/findings.schema.json: a JSON Schema for an object with a "findings" array. Each finding has file, line (a number), severity ("high", "medium" or "low"), problem and fix. All five are required.
2. Create scripts/review.mjs, a small Node script that takes a reminders folder and that week's CSV, and runs Claude Code headless, like this:
   claude -p "Review every reminder in <folder> against <csv>, brand/voice.md and .claude/rules/reminders.md. An invoice number, date or amount that doesn't match the CSV, a missing invoice, an invoice that is not in the CSV, a wrong total or a wrong address is high severity. Report only real problems." --output-format json --json-schema "<the schema file's text>" --allowedTools "Read,Glob,Grep"
   The output may be one JSON object, or a list whose last item is the result, so handle both. Take structured_output, save it to review/findings.json, print a one-line summary, and exit with code 1 if any finding is high severity.
3. To prove it catches problems, copy the Crescent Health Services reminder from chase/2026-11-16/emails/ to chase/test-bad/emails/01-bad.md and break it on purpose: change 1,168,000 to 1,186,000, add a row for the paid invoice KITM20157, and add the line "Pay within 24 hours or we will take legal action." Then run:
   node scripts/review.mjs chase/test-bad data/weekly/2026-11-16.csv
4. Run it on chase/2026-11-16 with the same CSV too, then commit everything.

Tell me what each run found and what exit code it gave.
```

Build 2 of 2Same session

```
Improve scripts/review.mjs so a second review doesn't repeat itself.

If review/findings.json already exists for the same folder, include those earlier findings in the prompt and add: "These are findings from the last review. Report only problems that are new or still not fixed. Don't repeat ones that have been fixed." To make that work, save the folder name inside review/findings.json too.

Then test it:
1. Run node scripts/review.mjs chase/test-bad data/weekly/2026-11-16.csv and note the findings.
2. Fix only the amount in chase/test-bad/emails/01-bad.md (change it back to 1,168,000).
3. Run the review again on chase/test-bad.
Tell me: did the amount finding disappear, and did anything get reported twice? Commit when done.
```

CheckNew session, then paste

```
Test my automatic money check. The script rewrites review/findings.json; don't change any other file.

1. Run node scripts/review.mjs chase/test-bad data/weekly/2026-11-16.csv. Did it exit with code 1? Does every finding in review/findings.json have all five fields from review/findings.schema.json, with severity high, medium or low?
2. Did it catch the paid invoice KITM20157 and the legal threat? Quote those findings.
3. Run node scripts/review.mjs chase/2026-11-16 data/weekly/2026-11-16.csv. Did it exit with code 0?
4. Read scripts/review.mjs. Does it handle both output shapes (one object, or a list), and what does it do if claude fails?

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why a separate headless run does the review instead of the session that wrote the reminders, and why we ask for JSON that matches a schema instead of plain text.
```

You'll know it worked when

- The broken reminder gives **exit code 1**, with findings for the wrong amount, the paid invoice and the threat. Your real week gives **exit code 0**.
- After you fix the amount, the next review drops it and repeats nothing.
- Reviews vary a little from run to run. That's why the script only fails on high severity.

Optional: make it part of Monday

Ask Claude to make `/weekly-chase` end by running `node scripts/review.mjs` on the folder it just wrote, and to stop with a warning if it exits with code 1. A wrong rupee then never reaches a customer.

Exam note

`-p` runs Claude without waiting for input, which fixes a CI job that hangs. `--output-format json` with `--json-schema` gives results a program can read. CLAUDE.md holds the review rules for CI runs. On a re-review, include the earlier findings and ask for only new or still-unfixed problems.

Not real: `CLAUDE_HEADLESS=true` and `--batch`. In the product, `--json-schema` takes the schema's text, not a file name.

Step14

Real-world skill3.41.5

### Go live: Monday sends through Resend

Plan first, then move the weekly run into Google Sheets with Apps Script. It queues one reminder per customer every Monday, and sends through your real Resend account only the ones you approve.

[ ] Done

**In plain words:** the studio is the test kitchen. Apps Script is the Monday shift: the same recipe, running by itself on Google's servers. It lays every reminder out on the counter (a Send_Queue tab), and nothing leaves the kitchen until you tick it and press Send.

Before you start

1. Sign up at `resend.com` with the same email you used as `MY_EMAIL` in step 10.
2. Add and verify your sending domain under **Domains**. Until a domain is verified, Resend only delivers to your own address, which is fine for test mode.
3. Create an API key with **Sending access**. Keep it somewhere safe; you'll paste it into Google yourself, never into Claude.
4. Install clasp, Google's command-line tool for Apps Script: `npm install -g @google/clasp`, then `clasp login`. Turn on the Google Apps Script API at `script.google.com/home/usersettings`.
5. Press `Shift+Tab` until the bottom of the screen says **plan mode**. Claude will read and plan, but write nothing until you accept.

Build 1 of 2Paste in plan mode

```
Plan this first. Don't build anything yet.

I want the weekly chase to run by itself in Google Sheets and send through Resend, but only the reminders I approve. Plan a folder called apps-script/ with:
- appsscript.json with timeZone set to Asia/Karachi
- Code.gs for a Google Sheet called "ITM Invoice Chase" with three tabs: "Outstanding" (the same columns as our weekly .xlsx: Customer, Num, Date, Amount, Email, which I paste in every Monday), "Send_Queue" (week, customer, to, subject, invoice numbers, total PKR, HTML body, Approve checkbox, status, Resend email id, sent at) and "Chase_Log" (one row per email actually sent)
- prepareWeek(): reads Outstanding, skips the Total row and rows with no email or an amount of zero or less, groups invoices by customer, builds one HTML email per customer from chase/templates/emails/weekly-statement.md, and adds it to Send_Queue with status "Waiting for approval" and Approve unticked. It makes no call to Resend. If this customer is already in Send_Queue for this week, skip it.
- sendApproved(), on a custom menu "Invoice Chase > Send approved reminders": for each row with Approve ticked and status "Waiting for approval", send it with UrlFetchApp to https://api.resend.com/emails, with an Idempotency-Key header made from the week and the customer, so a row can never be sent twice. Save the Resend email id, set status to "Sent", and add a row to Chase_Log. If Resend returns an error, write it in the status and carry on with the next row.
- the API key and the sender address read from Script Properties (RESEND_API_KEY and SENDER_EMAIL). They are never written in any file.
- a TEST_MODE setting at the top of Code.gs, true by default. In test mode every email goes to me (Session.getActiveUser().getEmail()) instead of the customer, and the subject starts with the customer's real address in square brackets.
- installTrigger(): runs prepareWeek every Monday at 9 AM in the Asia/Karachi time zone. Sending is never on a trigger; only I start it, from the menu.
- a PreToolUse hook on Bash, .claude/hooks/clasp-guard.mjs, that blocks any "clasp push" while Code.gs says TEST_MODE = false, so going live is something only I do, by hand
- apps-script/README.md: how to create the sheet with clasp, push, set the two Script Properties, run installTrigger once, and the weekly routine

Tell me which files you'll create, what you'll reuse from the studio, and anything that won't work the same in Apps Script.
```

Then

Read the plan. Find one thing it says won't work the same in Apps Script (for example, Apps Script can't use the resend MCP tools or our send guard, so the guard's job moves into TEST_MODE and the Approve column). Then accept the plan, or paste:

Build 2 of 2After you read the plan

```
The plan looks good. Build it. Add apps-script/.clasp.json to .gitignore, because it's mine.

When it's built, run these from the apps-script folder and fix anything they report:
   clasp create --type sheets --title "ITM Invoice Chase"
   clasp push
Then commit.
```

Then

1. Open Google Drive and open the new sheet **ITM Invoice Chase**. Paste the 20 rows from `ITM Outstanding with Email.xlsx` into the **Outstanding** tab.
2. Open **Extensions → Apps Script → Project Settings → Script Properties**. Add `RESEND_API_KEY` (your key) and `SENDER_EMAIL` (an address on your verified domain, or `onboarding@resend.dev` until it's verified). Type these yourself.
3. Run `prepareWeek` and approve Google's permission screen. **Send_Queue** should show 20 rows waiting for approval.
4. Tick **Approve** on two rows, reload the sheet, and choose **Invoice Chase → Send approved reminders**.
5. Check your inbox: two emails, both to you. Resend's **Emails** page shows them as delivered.
6. Choose **Send approved reminders** again. Nothing new should arrive. Then run `installTrigger` once.

CheckNew session, then paste

```
Test my go-live setup. Don't change any files.

1. Read apps-script/Code.gs. Is TEST_MODE true? Show me the line. Is there any call to GmailApp or MailApp? There should be none.
2. Does prepareWeek make any network call? There should be none. Does sendApproved send only rows with Approve ticked and status "Waiting for approval", and does it set an Idempotency-Key? Point to the lines.
3. Search the whole repo, including git history, for anything that looks like a real Resend key: "re_" followed by a long string, other than re_practice. There should be none. Where does Code.gs read the key from?
4. Is installTrigger set to run prepareWeek, not sendApproved, on Monday at 9 AM in Asia/Karachi? Quote it, and quote the timeZone in appsscript.json.
5. Run .claude/hooks/clasp-guard.mjs with a sample "clasp push" tool call on standard input. With TEST_MODE true it should allow it (exit 0). Then show me the lines that would block it if TEST_MODE were false. Don't edit Code.gs to test this.
6. Prove apps-script/.clasp.json is ignored with git check-ignore -v.

Give me a short table: Test | Pass or Fail | What you saw.
Then ask me two quick questions, one at a time: why this step started in plan mode, and why sending sits behind an Approve tick and a menu instead of on the Monday trigger.
```

You'll know it worked when

- **Send_Queue** fills with 20 reminders every Monday at 9 AM, and nothing is sent until you tick and press the menu.
- Your two approved test emails arrive in your own inbox, each subject showing the customer's real address, and appear in Resend as delivered.
- Pressing Send again sends nothing, and **Chase_Log** has exactly two rows.

If something goes wrong

- **403 from Resend, "You can only send testing emails to your own email address":** your domain isn't verified yet. That's fine in test mode; check that the email went to you.
- **"User has not enabled the Apps Script API":** turn it on at script.google.com/home/usersettings, wait a minute, push again.
- **No Invoice Chase menu:** reload the sheet; the menu is added when it opens.

Exam note

Use plan mode when a task is large, has several valid approaches, involves design decisions or touches many files. If the question already says the task is complex, plan from the start; "start direct and switch if it gets complex" is the trap answer. A hook's matcher isn't only for MCP tools: here it is `Bash`, so the same guard idea protects a command line. The key lives in Script Properties for the same reason `.mcp.json` uses `${VAR}`: no secret in the repo.

After step 14

## Your Monday routine

1. Before 9:00Export open invoices from QuickBooks (Customer, Num, Date, Amount, Email) and paste them over the **Outstanding** tab.
2. 9:00 PKTThe trigger runs `prepareWeek`: one statement reminder per customer waits in **Send_Queue**.
3. MorningRead each reminder in **Send_Queue**, tick **Approve** on the ones that are right, and choose **Invoice Chase → Send approved reminders**. Resend delivers them, and each one is logged in **Chase_Log**.
4. Next MondayPaid invoices are gone from the new export, so nobody is chased twice for money already paid.

**Going live is your decision.** When the test-mode emails have looked right for two Mondays, change `TEST_MODE` to `false` yourself and run `clasp push` in your own terminal. The hook stops Claude from doing it for you.

Stretch · Step 15

## For fast finishers

Three months of sheets, and the habits that keep Claude accurate when its memory gets full.

Step15

5.4

### Who pays late

Keep track of findings across many weekly sheets, even after Claude's memory is squeezed.

[ ] Done

**In plain words:** when Claude's memory gets squeezed, a notebook still has everything. So write in the notebook as you go, not at the end.

Build 1 of 3Paste in Claude Code

```
Create practice data: data/history/ with 12 weekly CSVs, 2026-08-24.csv to 2026-11-09.csv (every Monday), in the same columns as data/weekly/2026-11-09.csv, for the same 20 made-up customers. Make it realistic: most invoices are paid within 30 to 45 days and drop off, a few customers pay late again and again, one invoice disappears and comes back, and new invoices appear each week. Don't summarise them.
```

Then

Start a named session: `claude -n late-payers`

Build 2 of 3Paste in the named session

```
Find the 5 customers who pay latest and the 3 invoices that stayed open longest, across all the files in data/history/.

Use a subagent to read the files, so the raw rows don't fill up this conversation. Tell the subagent to keep a scratchpad at notes/scratchpad.md and add to it after each file, one line per finding: the file, the customer, the invoice, days outstanding, and what changed since last week. At the end, give me the top 5 and the top 3, with the evidence for each.
```

Then

Type `/compact`. This squeezes the conversation into a short summary.

Build 3 of 3Same session, after /compact

```
Which week did the most invoices get paid? Answer from memory first. Then check notes/scratchpad.md and the files, and tell me whether your memory was right.
```

CheckNew session, then paste

```
Check my scratchpad. Don't change any files.

1. Does notes/scratchpad.md have lines for every file in data/history/?
2. Pick three lines and check each one against the weekly file it names: is the invoice real, and is the days-outstanding figure right?

Give me a short table: Test | Pass or Fail | What you found.
Then ask me two quick questions, one at a time: why we write to a scratchpad as we go, and what /compact does to Claude's memory.
```

You'll know it worked when

- Your main session only sends work to a subagent. The raw rows never fill your chat.
- After `/compact`, memory gets details wrong or can't answer, and the scratchpad can.
- A thin scratchpad (one line per file) can't answer either. Write one line per finding.

Exam note

The warning sign is answers that stop matching earlier findings, or that talk about "typical patterns" instead of the specific things found. The fixes are scratchpad files, subagents, summaries between phases, saved state files, and `/compact`. A bigger context window is never the answer.

## Exam map

Where each CCAR-F Claude Code objective is practised in this lab.

| Objective | What it covers | Steps |
| --- | --- | --- |
| 3.1 | CLAUDE.md levels, @import, folder CLAUDE.md, /memory | 2, 3, 4 |
| 3.2 | Commands and skills: plugin skills, argument-hint, context: fork, allowed-tools | 5, 8 |
| 3.3 | Rules with paths: patterns | 6 |
| 3.4 | Plan mode, sending work to subagents | 14, 15 |
| 3.5 | Interview first, input/output examples, fixes in one message | 3, 4, 7 |
| 3.6 | Fresh-session review, -p, JSON schema, re-review | 7, 13 |
| 1.7 | Resume by name, fork, fresh start with a summary | 12 |
| 2.4 | .mcp.json, ${VAR} credentials, use what exists first | 1, 9 |
| 2.5 | Glob and Grep | 7 |
| 1.5 | Hooks: the exam names PostToolUse; PreToolUse is what blocks | 10, 14 |
| 5.4 | Big context: scratchpad, subagents, /compact | 15 |

Not practised here: MCP resources (catalogs of data), Edit's fallback when its anchor text isn't unique (Read, then Write), and tracing code through a wrapper module.

## Words you'll see

Session

One conversation with Claude Code. `/exit` ends it; running `claude` starts a new one.

Commit

A saved snapshot of your files in git. You can always go back to it.

Plugin

A package of skills, commands, hooks and connections that you install in one go.

Skill

Saved instructions Claude follows when you call it with `/name`, or when the task fits.

MCP server

A connection that gives Claude tools from another service, like Resend.

Hook

A small script Claude Code runs at a set moment, like just before a tool runs. It can block the action.

Aging

How long an invoice has been unpaid, grouped into buckets: 0–30, 31–60, 61–90 and 90+ days.

Statement email

One reminder per customer that lists every open invoice with a total, instead of one email per invoice.

Practice mode

Resend's tools connected to a pretend email server on your own computer.

Approval queue

The Send_Queue tab: every reminder waits there until you tick Approve and choose Send.

Verified domain

A domain you prove you own in Resend. Until it's verified, Resend only delivers to your own address.

Apps Script

Google's built-in scripting for Sheets. It runs on Google's servers, even when your computer is off.

Fresh session

A new conversation that doesn't remember the old one, which makes it a fair checker.

Invoice Chase Studio Lab · built on the FDE-102 Email Studio Lab format · practice data is anonymised