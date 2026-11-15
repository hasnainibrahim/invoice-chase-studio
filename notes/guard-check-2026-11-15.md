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

## Result

The guards work in a fresh session. Only `@resend.dev` test addresses and the owner's own address can receive email. Wrong recipients, list-wide sends and threat wording are blocked.
