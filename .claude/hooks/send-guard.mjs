// Send guard for the Resend tools. Runs as a PreToolUse hook before every
// mcp__resend__* call (see .claude/settings.json).
//
// - send-email / send-batch-emails: every to, cc and bcc address must end in
//   @resend.dev or match MY_EMAIL. The subject and body must not contain
//   words that brand/voice.md forbids ("legal action", "late fee", "suspend").
// - send-broadcast, create-automation, send-inbox-draft, send-new-inbox-email:
//   always blocked, because they can reach whole lists of people.
// - Anything else: allowed.
//
// Blocking means: print a short reason and exit with code 2.

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

function block(reason) {
  process.stderr.write(`Send guard: ${reason}\n`);
  process.exit(2);
}

let event;
try {
  event = JSON.parse(raw);
} catch {
  block("could not read the tool call, so it was blocked to be safe.");
}

const toolName = String(event.tool_name ?? "");
const action = toolName.replace(/^mcp__resend__/, "");
const input = event.tool_input ?? {};

const ALWAYS_BLOCKED = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
]);
const CHECKED_SENDS = new Set(["send-email", "send-batch-emails"]);
const FORBIDDEN_PHRASES = ["legal action", "late fee", "suspend"];

if (ALWAYS_BLOCKED.has(action)) {
  block(`${action} is not allowed, because it can reach whole lists of people.`);
}

if (!CHECKED_SENDS.has(action)) {
  process.exit(0);
}

const myEmail = (process.env.MY_EMAIL ?? "").trim().toLowerCase();

// Pull a bare address out of forms like "Name <a@b.com>".
function addressOf(value) {
  const text = String(value).trim();
  const match = text.match(/<([^>]+)>/);
  return (match ? match[1] : text).trim().toLowerCase();
}

// Walk the whole input, including each email in a batch, and collect
// the recipients and the subject and body text.
function collect(node, recipients, texts) {
  if (Array.isArray(node)) {
    for (const item of node) collect(item, recipients, texts);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      const k = key.toLowerCase();
      if (k === "to" || k === "cc" || k === "bcc") {
        const list = Array.isArray(value) ? value : String(value).split(/[,;]/);
        for (const item of list) if (String(item).trim()) recipients.push(addressOf(item));
      } else if (k === "subject" || k === "text" || k === "html") {
        texts.push(String(value));
      } else {
        collect(value, recipients, texts);
      }
    }
  }
}

const recipients = [];
const texts = [];
collect(input, recipients, texts);

const notAllowed = recipients.filter(
  (a) => !a.endsWith("@resend.dev") && !(myEmail !== "" && a === myEmail),
);
if (notAllowed.length > 0) {
  block(
    `${notAllowed.join(", ")} is not allowed. Send only to @resend.dev test addresses or MY_EMAIL.`,
  );
}

const content = texts.join("\n").toLowerCase();
const found = FORBIDDEN_PHRASES.filter((p) => content.includes(p));
if (found.length > 0) {
  block(`the email contains "${found.join('", "')}". brand/voice.md forbids threats.`);
}

process.exit(0);
