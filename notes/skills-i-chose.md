# Skills I chose for the invoice-chase studio

Researched 11 Nov 2026. I searched skills.sh (`npx skills find`) for "invoice reminder", "accounts receivable", "google apps script" and "resend". Then I checked who publishes each promising skill on GitHub and how many stars it has, and looked through Anthropic's `knowledge-work-plugins` marketplace. Nothing has been installed.

## Use these

**1. Anthropic's `invoice-chase` skill: for chasing invoices**
Source: `anthropics/knowledge-work-plugins`, in the `small-business` plugin (`small-business/skills/invoice-chase`).
- Anthropic publishes it. The repo has about 35,400 GitHub stars and was updated today. Another skill from the same repo, `plan-payroll`, is the most installed result for "invoice reminder" (1.9K installs).
- It is the only skill in Anthropic's marketplace built for unpaid invoices, and it does what we need. It finds overdue invoices and checks for recent payments, so nobody who has just paid gets a reminder. It sorts customers into good payers, occasionally late and repeat late, then drafts a gentle or firm reminder to match. It includes sample gentle and firm emails. **Nothing is sent until you say "send these".**
- The `small-business` plugin is already turned on in this Claude setup, so we can try the skill without installing anything.
- One gap: it reads unpaid invoices from accounting software (QuickBooks, Xero, Zoho Books, MYOB or NetSuite) or from PayPal, Stripe or Airwallex. It does not read a Google Sheet. To use our weekly sheet, we would connect the sheet to it or copy its approach. For the sheet side, the safest option is Google's own `googleworkspace/cli` skills (about 32,300 stars; `gws-script` has 27.4K installs).

**2. Resend's `resend` skill: for drafting and sending the emails**
Source: `resend/resend-skills@resend`, plus `resend/email-best-practices` for advice on getting emails delivered.
- Resend publishes it, and Resend is the email service itself. The repo has 211 stars and was updated two days ago.
- It is the most installed result across all four searches (24.5K installs).
- It covers sending, templates and email good practice. A polite reminder needs all three to land in the inbox and not in spam.

## Avoid these

**1. `bxwebb-cyber/dunn-skill@get-paid-on-time`**
- The repo was created on 8 Nov 2026 by a personal account. It has 0 stars and 1 install, so nobody else has tested it.
- Its description says it works "with Dunn's free tools". It looks built to steer you toward one company's product, not to give neutral help.

**2. `skills.volces.com@doctorclaw-invoice-tracker` (and the other `skills.volces.com` results)**
- These come from a third-party mirror, not a GitHub repo. You can't see who wrote them, check their history or count their stars.
- Each has only a handful of installs. A skill can tell Claude to run commands and send email. For a tool that writes to our customers, an author we can't trace is too big a risk.

(A close third: `devinosolutions/mcp-servers@chasing-unpaid-invoices`. It has 0 stars, and the repo mainly promotes the company's own paid hosted services.)

## How I decided

Check these three things before installing any skill:

1. **Who publishes it?** Prefer the company that makes the product, such as Anthropic, Google (`googleworkspace`) or Resend. Be wary of brand-new personal accounts and of mirrors with no GitHub repo.
2. **Do other people use it, and is it kept up to date?** Look at the GitHub stars, the skills.sh install count and the date of the last update. Thousands of users and recent updates are good signs. A repo created this week with 0 stars is not.
3. **What does it actually do?** Read its `SKILL.md` before installing. Check which tools it asks for, whether it can send email or move money without asking you, and whether it pushes a paid service. For invoice reminders it should always draft first and wait for your approval.
