# Review lessons, 15 November 2026

What we learned from reviewing and fixing the 2026-11-09 reminders.

## Why the review happened in a new session

A fresh session reviews the work without the writer's bias.

The session that wrote the drafts remembers what it meant to write. So it reads its own work kindly and misses its own mistakes. A new session only sees what is in the files. It checks them the way a stranger would.

## Why all the fixes went in one message

1. **The fixes were connected.** Moving the date to 15 November changed the days outstanding. That changed which reminder some customers get: Oceanic Consolidators moved to the standard reminder, and Bytecraft now offers an invoice copy. The 30-day payment terms rule decides where those lines fall. City Care's address change meant importing the CSV again. One at a time, a later fix could undo or clash with an earlier one.
2. **Each file was edited once, not three times.** Every extra pass over a file is another chance to break something already fixed.
3. **There was one check at the end.** We checked every draft against the CSV once, after all the fixes. Separate fixes would leave half-fixed files in between, and each step would need its own check.
4. **It made one clean commit.** The history shows one change, and it can be undone in one step.
5. **It costs less.** Claude reads the files and the review once, not once for each fix.

**The exception:** batch fixes only when they are clear and agreed. If a fix needs a decision first, like confirming the payment terms, settle that before sending the batch.

## Check after the fixes

- No triple backticks, no "legal" and no words from the "avoid" list in any of the 40 reminder files.
- Every Total row matches `data/weekly/2026-11-09.csv`.
