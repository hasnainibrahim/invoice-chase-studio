# Studio setup check – 15 November 2026

We tested the studio setup by running commands. We did not only read the files. No files were changed during the check.

## Results

| Check | OK or Problem | What we saw |
|---|---|---|
| 1. Small Business plugin is on for this project only | OK | `.claude/settings.json` turns on `small-business@knowledge-work-plugins`. `claude plugin list` shows it as **Scope: project, enabled**. The user settings do not turn it on. |
| 2. The plugin can be used here now | OK | These plugin skills are visible: `small-business:invoice-chase`, `small-business:cash-flow-snapshot`, `small-business:pay-the-bills`. |
| 3. A classmate who clones the repo gets the same plugin | OK | `.claude/settings.json` is committed (`git ls-files .claude`). It names the marketplace (`anthropics/knowledge-work-plugins` on GitHub) and turns on the plugin. Claude Code reads it when the folder is opened and offers to install the plugin. |
| 4. Private files are ignored by git | OK | `git check-ignore -v .claude/settings.local.json data/real/test.xlsx` matched both: `.gitignore:2` and `.gitignore:8`. |

## Things to know

- `claude plugin list` also shows `marketing@knowledge-work-plugins` with project scope, **disabled**. It is not in the committed `settings.json`, so it does not affect classmates.
- There is also a copy called `small-business@synced` from claude.ai. It is not loaded, because the project's copy has the same name and takes priority.

## Shared files and personal files

- **Shared with the team (committed):** `.claude/settings.json`, `.gitignore`, `CLAUDE.md`. Whatever is in them applies to everyone who clones the repo.
- **Only mine (ignored by git):** `.claude/settings.local.json` and the real sheets in `data/real/`. They stay on this laptop.
- If the same setting is in both files, `settings.local.json` wins on this laptop.
- `git add .` skips ignored files. A real sheet can still get into a commit by mistake if:
  1. someone force-adds it with `git add -f`, or
  2. it is saved outside `data/real/`, for example in `data/` or `chase/`. This is the most likely mistake.
- Habit: run `git status` before every commit and check that no real sheet is listed.
