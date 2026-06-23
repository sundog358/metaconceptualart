---
name: ship
description: >-
  Ship the current work on the main branch in one safe, ordered pass: preflight,
  stage, verify, commit, prune worktrees, sync, and push to origin. Use this
  whenever the user says "ship", "ship now", "ship it", "ship this", "ship my
  work", "push my changes", "commit and push", "get this onto main", "land this",
  or otherwise wants their current local work committed and pushed to the remote.
  Trigger it even when the user doesn't say the word "ship" but clearly wants the
  current changes committed and pushed in one go. Do NOT use it to push a feature
  branch, open a pull request, or force-push — this skill only ships the main
  branch to origin/main, and it pauses for the user to confirm before the push.
  Note: this is a Next.js site on Vercel, so pushing origin/main triggers a
  production deploy.
---

# Ship

A single, ordered pipeline that takes whatever is on the local `main` branch and
gets it safely to `origin/main`. The whole point is **safety through order**:
nothing broken reaches the remote, nothing committed is lost, and the history
stays linear.

## The contract

This skill ships `main` to `origin/main`. It will:

- never push anything other than `main`,
- never force-push, never skip hooks, never bypass signing,
- abort the entire ship if verification fails (nothing is committed or pushed),
- never auto-resolve a rebase conflict or delete in-progress work,
- treat the push to `origin/main` as the one irreversible step and **confirm it
  with the user before doing it** (step 7). The skill does not grant itself
  permission to push; it follows the session's normal approval rules.
- remember that this repo auto-deploys: a push to `origin/main` triggers a
  **Vercel production deploy** of the Next.js static export, so "ship" is also
  "publish". That is exactly why the verify gate (step 3) builds the site, and why
  the push is confirmed.

These rules are non-negotiable because a bad push to a shared `main` is expensive
to undo.

## The locked order — do not reorder

The sequence exists for concrete reasons. Verification runs **before** the commit
so a failure costs nothing. The rebase sync runs **after** the commit but
**before** the push so the push is always a fast-forward and never rejected.

1. Preflight → 2. Stage → 3. Verify → 4. Commit → 5. Worktree cleanup →
6. Sync → 7. Push (confirm first) → 8. Report

---

### 1. Preflight — figure out what we're shipping

Establish the ground truth before changing anything:

```bash
git rev-parse --is-inside-work-tree   # must be a repo
git branch --show-current             # must be "main"
git fetch origin                      # so ahead/behind is accurate
git status -sb
git rev-list --left-right --count origin/main...HEAD   # "<behind>\t<ahead>"
```

If not inside a repo, or not on `main`, **stop and tell the user** — don't switch
branches for them (that's surprising and can hide their work). If `main` has no
upstream yet, treat ahead/behind as "unknown" and proceed; the first push will
set it.

Then classify the state — this decides which steps run:

| State | Working tree | Ahead | Behind | What to do |
| --- | --- | --- | --- | --- |
| **Local changes** | dirty | any | any | Full pipeline (steps 2–8) |
| **Unpushed commits** | clean | > 0 | 0 | Skip 2–4; go to 5 (Example C) |
| **Behind only** | clean | 0 | > 0 | Sync (step 6), then report |
| **Diverged** | clean | > 0 | > 0 | Sync (rebase) then push |
| **Nothing to do** | clean | 0 | 0 | Report "nothing to ship" and stop |

Announce the detected state in one line before proceeding, so the user can catch
a wrong read early.

### 2. Stage

```bash
git add -A
```

Stage everything first so the verify gate runs against **exactly** what will be
committed — verifying a partial stage would be a false signal. Only runs when the
tree is dirty.

### 3. Verify — the gate

This repo is a **Next.js static-export** site with a Linked Art data layer, so
the gate has to prove three things: the site still builds, the exported output is
valid, and the Linked Art records are still authentic. Run all of it from the
repo root:

```bash
npm ci                                                   # only if node_modules is missing or package-lock changed
npm run build                                             # next build → static export in out/ (fails on TS/build errors)
npm test                                                  # node --test: works-data, linked-art id↔file, route smoke over out/
python "$SKILL_DIR/scripts/verify_static.py" out
python "$SKILL_DIR/scripts/validate_linked_art.py" .     # advisory: official LA JSON Schemas (cromulent is the gating one)
python "$SKILL_DIR/scripts/build_activity_stream.py" --check .
```

Why each step, so a failure is easy to read:

- **`npm run build`** runs `prebuild` (mirrors `images/` and `data/` into
  `public/` via `scripts/prepublic.mjs`) then `next build`. It fails on
  TypeScript errors or a broken page, and it regenerates `out/` so the next check
  sees the real shipped artifact. A green local build is what Vercel will also do
  on the push, so this is the single most important guard before publishing.
- **`verify_static.py out`** validates the *exported* HTML and JSON: structure,
  every local `href`/`src` (including the extensionless Linked Art URIs), and the
  records against the Getty `cromulent` reference library — gating when cromulent
  is installed (`pip install pyld cromulent` once), advisory if not.
- **`build_activity_stream.py --check .`** confirms the discovery stream is still
  derived from real git history (no fabricated activities, every record has a
  Create). It reads `data/linked-art/` at the repo root, which stays canonical.

`$SKILL_DIR` is this skill's directory (`.claude/skills/ship`).

Note: `out/`, `public/`, and `node_modules/` are git-ignored, so building never
adds anything to the commit — the gate validates the source you staged in step 2.

**If any step fails, abort the whole ship.** Do not commit, do not push. Leave the
changes staged so the user can inspect and fix. Report exactly what failed. This
gate is the reason the skill is trustworthy — honor it even when the failure
looks unrelated to the user's change.

### 4. Commit

Draft a [Conventional Commits](https://www.conventionalcommits.org) message from
the staged diff — don't ask the user to write it:

```bash
git diff --cached --stat
git diff --cached
```

Infer the `type(scope): subject` from what actually changed (see the message
examples below), then commit with the required trailer using a heredoc so
multi-line bodies and literal characters survive:

```bash
git commit -m "$(cat <<'EOF'
feat(systems): ground knowledge graph nodes in Wikidata

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

Skip this step for the **Unpushed commits** state — the commit already exists and
was verified when it was made.

### 5. Worktree cleanup

Keep the repo tidy, but never at the cost of someone's work:

```bash
git worktree prune
git worktree list
```

Remove a worktree **only if it is both clean and fully merged into `main`** —
check that it has no uncommitted changes and that its branch appears in
`git branch --merged main`. Never remove a worktree that is dirty or whose branch
isn't merged; that work may be irreplaceable. If in doubt, leave it and say so in
the report.

### 6. Sync

```bash
git pull --rebase origin main
```

Rebase (not merge) keeps history linear and guarantees the push is a
fast-forward. **Re-run the verify gate (step 3) only if the rebase actually
brought in new commits** — remote code combined with yours can break things, but
if the remote didn't move there's nothing new to check, so don't waste the time.

If the rebase hits a conflict, **stop**. Report the conflicted files and tell the
user to resolve them; do not guess at a resolution. The commit is already safe
locally — nothing is lost by pausing here.

### 7. Push — confirm, then push

The push is the only step that changes shared state, so surface what is about to
happen and let the user confirm it before running the command:

- the commit(s) that will land (`git log --oneline origin/main..HEAD`),
- that this updates `origin/main` **and triggers a Vercel production deploy** —
  say this explicitly so the user knows the push publishes the live site.

Then push:

```bash
git push origin main
```

A plain fast-forward push — no flags, no force. If the environment asks the user
to approve the command, let that approval happen; do not try to route around it.
If the push is rejected as non-fast-forward, do **not** force — re-run the sync
(step 6) and try once more, or report the rejection and stop.

### 8. Report

A concise summary, e.g.:

```
Shipped main → origin/main
  state:     local changes
  verify:    next build OK · export validated (10 html, cromulent 7/7) · activity stream authentic
  commit:    a1b2c3d  feat(systems): ground knowledge graph nodes in Wikidata
  worktrees: pruned 1 stale ref, removed none (all in use)
  sync:      already up to date, no re-verify needed
  push:      a1b2c3d..e4f5g6h
  deploy:    Vercel will build origin/main → production
```

Adapt the lines to what actually happened. If you stopped early (nothing to ship,
verify failed, conflict, or the user declined the push), say so plainly and state
what the user should do next.

---

## Commit message examples

The subject is imperative and lowercase; the scope names the area that changed.

**Example 1**
Input: Added a live Wikidata SPARQL query and grounded concept nodes on the Systems page.
Output: `feat(systems): add live Wikidata related-concepts query`

**Example 2**
Input: Fixed broken relative image paths in the artworks gallery.
Output: `fix(artworks): correct relative image paths`

**Example 3**
Input: Reworded the colophon and tightened the README; no behavior change.
Output: `docs: tighten colophon and readme copy`

**Example 4**
Input: Reorganized styles.css and renamed graph classes, output unchanged.
Output: `refactor(styles): reorganize graph diagram classes`

When a change spans several areas, pick the dominant one for the scope (or omit
the scope) rather than inventing a compound scope.

## Worked states

**Example A — local changes (the common case).** Dirty tree on `main`. Run the
full pipeline: stage → verify → commit → prune worktrees → rebase sync → confirm
→ push → report.

**Example B — nothing to ship.** Clean tree, level with origin. Report "nothing
to ship — working tree clean and up to date with origin/main" and stop. Don't
create an empty commit.

**Example C — clean tree, ahead 1.** A commit was made earlier but never pushed.
Skip staging, verifying, and committing — the work is already a verified commit.
Go straight to worktree cleanup, then `git pull --rebase origin main` (re-verify
only if it pulled anything), then confirm and `git push origin main`, then report
the single commit that shipped.

## Why these guardrails

The model running this skill is capable of judgment, so the rules here mark the
few places where judgment should yield to discipline: a shared `main` is the one
branch where a hasty force-push, a skipped test, or an auto-resolved conflict can
ruin someone else's day and is painful to reverse. Everywhere else — reading
state, drafting the message, deciding which worktrees are safe to remove — use
your judgment freely.
