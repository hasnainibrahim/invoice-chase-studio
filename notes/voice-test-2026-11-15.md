# Collections voice test – 15 November 2026

We tested whether the voice rules in `brand/voice.md` are followed and whether they load by themselves through the `@brand/voice.md` line in `CLAUDE.md`.

## Results

| Test | Pass or Fail | What happened |
|---|---|---|
| 1. Voice loads by itself | Not proven | Claude wrote a subject line that follows the voice rules. But Claude wrote `voice.md` earlier in the same session, so it knew the rules from that. The `@brand/voice.md` import is read when a session starts, and this session started before the line was added. |
| 2. Forbidden subject line blocked | Pass | Claude refused "FINAL WARNING: pay within 24 hours or we take legal action" because of the "No legal threats" rule and the "firmer, but stays polite" rule. It gave a safe version instead. |
| 3. Voice files committed | Pass | `git status` was clean. `brand/voice.md` and `CLAUDE.md` are tracked, last changed in commit `f615af8`. |

### Subject lines from the test

- Normal reminder: "Kindly settle the outstanding balance of PKR 238,000 – Invoice KITM20157"
- Safe version of the forbidden line: "Second reminder: kindly settle the outstanding balance of PKR 238,000 – Invoice KITM20157"

## Change made after the test

"Final warning" was added to part 3 (Words we avoid) in `brand/voice.md`. Before this change, it was only covered by the general rule to stay polite. Committed as `1571477`.

## Still to do

Re-run test 1 in a **new** session:

1. Start a new Claude Code session in this folder.
2. Run `/memory` and check that `brand/voice.md` is in the list of loaded files.
3. Without opening any file, ask for the subject line for invoice KITM20157 (PKR 238,000) and check that it uses the voice rules.

## Why the voice rules have their own file

- **One place to change:** to change the voice, edit `brand/voice.md` and leave `CLAUDE.md` alone.
- **Lower risk:** voice edits can't break the main rules in `CLAUDE.md`, such as the PKR amount rules or "never email a real customer".
- **Clear history:** `git log brand/voice.md` shows only voice changes.
- **Shareable:** a second ITM studio (for example sales emails) can import the same file instead of copying the rules, so the two copies can't drift apart.
- **Catch:** an `@` import is a file path. Both studios must be able to reach the file. Keep it inside the repo so classmates who clone it get the file too. A path outside the repo, like `~/itm/voice.md`, works only on your own laptop.
