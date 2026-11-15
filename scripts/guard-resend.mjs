// Guard for the Resend email tools.
// Claude Code runs this before every Resend tool call (see .claude/settings.json).
// It allows a send only when every recipient is a Resend test address
// (ending in @resend.dev) or the owner's own address.
// The owner's address is read from the CHASE_OWNER_EMAIL setting, so it never
// has to be written into the repo. If that setting is empty, only
// @resend.dev addresses are allowed.

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

const event = JSON.parse(raw);
const toolName = event.tool_name ?? "";
const input = event.tool_input ?? {};

const owner = (process.env.CHASE_OWNER_EMAIL ?? "").trim().toLowerCase();
const RECIPIENT_FIELDS = new Set(["to", "cc", "bcc"]);

// Pull a bare address out of forms like "Name <a@b.com>".
function addressOf(value) {
  const text = String(value).trim();
  const match = text.match(/<([^>]+)>/);
  return (match ? match[1] : text).trim().toLowerCase();
}

// Walk the whole input and collect every to / cc / bcc value,
// including those inside a list of emails sent in one batch.
function collectRecipients(node, found) {
  if (Array.isArray(node)) {
    for (const item of node) collectRecipients(item, found);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (RECIPIENT_FIELDS.has(key.toLowerCase())) {
        const list = Array.isArray(value) ? value : String(value).split(/[,;]/);
        for (const item of list) if (String(item).trim()) found.push(addressOf(item));
      } else {
        collectRecipients(value, found);
      }
    }
  }
  return found;
}

function isAllowed(address) {
  return address.endsWith("@resend.dev") || (owner !== "" && address === owner);
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

// A broadcast goes to a whole audience, so we cannot check each address. Block it.
if (/broadcast/i.test(toolName) && /send/i.test(toolName)) {
  deny("Blocked by the studio guard: broadcasts go to a whole audience and are not allowed. Send to @resend.dev test addresses or the owner's own address only.");
}

const blocked = collectRecipients(input, []).filter((a) => !isAllowed(a));
if (blocked.length > 0) {
  deny(
    `Blocked by the studio guard: ${blocked.join(", ")} is not allowed. ` +
      "Resend may only send to @resend.dev test addresses or the owner's own address (CHASE_OWNER_EMAIL).",
  );
}

// Nothing to block: let the normal permission flow decide.
process.exit(0);
