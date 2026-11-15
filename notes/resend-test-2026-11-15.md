# Resend test send, 15 Nov 2026

We checked that Resend works in practice mode, end to end.

## What we did

| Step | Result |
|---|---|
| 1. Ask Resend for the list of domains (a read-only call) | Refused by Resend: "This API key is restricted to only send emails". This shows the connection and key work. The guard let the call through, because it only checks sends. |
| 2. Send the City Care Hospital practice reminder to `delivered@resend.dev` | Accepted by Resend. |
| 3. Send the same reminder to the owner's address (`CHASE_OWNER_EMAIL`) | Accepted by Resend. The owner confirmed it arrived and looked right. |

Both test emails had "[TEST]" at the start of the subject. The draft used was `chase/2026-11-09/html/city-care-hospital.html`, with practice data only.

## Things to know

- The API key can only send. Claude cannot list sent emails or check delivery. Check delivery on the **Emails** page of the Resend dashboard.
- There is no verified domain, so emails come from Resend's shared test sender. Hotmail may put them in Junk.
- The guard in `scripts/guard-resend.mjs` checks every send. Only `@resend.dev` addresses and the owner's address are allowed.
