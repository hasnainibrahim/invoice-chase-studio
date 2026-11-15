# Guard check after a session reset, 15 Nov 2026

We started a new Claude Code session and checked that both send guards still work.

## The setup

- `.claude/settings.json` runs two hooks before every Resend tool call:
  - `scripts/guard-resend.mjs` checks every recipient.
  - `.claude/hooks/send-guard.mjs` checks recipients, list-wide tools and threat wording.
- Both hooks block the call if the hook itself fails.
- `CHASE_OWNER_EMAIL` loaded in the new session from `.claude/settings.local.json`.

## Tests run straight through both guard scripts

| Test | `guard-resend.mjs` | `send-guard.mjs` |
|---|---|---|
| Send to `delivered@resend.dev` | Allowed | Allowed |
| Send to a made-up customer address | Blocked | Blocked |
| A batch with one bad address among good ones | Blocked | Blocked |
| `send-broadcast` | Blocked | Blocked |
| Email to a test address with "legal action" in it | Allowed (it checks addresses only) | Blocked (threat wording) |
| A read-only call (`list-emails`) | Allowed | Allowed |

## Live tests through Resend

| Test | Result |
|---|---|
| Send to `guard-test@customer.example` | Blocked by the hook before it reached Resend. Nothing was sent. |
| Send a practice email to the owner's address (`CHASE_OWNER_EMAIL`) | Allowed. Resend accepted it, and the owner confirmed it arrived. |

## Second round: the Crescent reminder

We sent the practice draft `chase/2026-11-09/emails/crescent-health-services.md` through Resend. No files were changed during the tests.

| Test | Pass or Fail | What happened |
|---|---|---|
| 1. Send the reminder to the address on its To: line | Pass | Blocked by `send-guard.mjs`: "Send guard: imran.qureshi@crescenthealth.example is not allowed. Send only to @resend.dev test addresses or the owner's own address (CHASE_OWNER_EMAIL)." Nothing was sent. |
| 2. Send the reminder to `delivered@resend.dev` | Pass | Resend accepted it. |
| 3. Send a one-line email to `delivered@resend.dev` with the subject "Final notice: legal action" | Pass | Blocked by `send-guard.mjs`: "Send guard: the email contains "legal action". brand/voice.md forbids threats." Nothing was sent. |
| 4. Send the reminder to the owner's address (`CHASE_OWNER_EMAIL`) | Pass | Resend accepted it. The owner confirmed it arrived. |
| 5. Run `git check-ignore -v .claude/settings.local.json` | Pass | Ignored by `.gitignore` line 2. The file is not in git, so the owner's address is not committed. |

Notes on this round:

- The Resend tool takes plain text only, so the invoice table was sent as one line of text. The amounts were copied exactly from the draft.
- The owner's address is stored as `CHASE_OWNER_EMAIL`. There is no `MY_EMAIL` setting.

## Rule and guard

- The rule in `CLAUDE.md` is advice. Claude reads it, but can skip it or get it wrong.
- The guard is code. Claude Code runs it before every Resend call, so it blocks a wrong send whatever Claude does.
- When a hook exits with code 2, Claude Code blocks the tool call and gives the hook's stderr message to Claude. `send-guard.mjs` blocks this way. `guard-resend.mjs` blocks another way: it exits with code 0 and prints a JSON "deny" answer.
- Both hooks have `onFailure: "block"`, so a hook that crashes also blocks the send.

## Result

The guards work in a fresh session. Only `@resend.dev` test addresses and the owner's own address can receive email. Wrong recipients, list-wide sends and threat wording are blocked.
