---
allowed-tools: Bash(textlint:*), MultiEdit, Read, TodoWrite
description: Execute textlint on specified files, apply automatic fixes, manually fix remaining errors, and repeat until all errors are resolved
---

## Textlint Review

Execute textlint on the specified file, apply automatic and manual fixes, and repeat until all errors are resolved.

Usage: `/textlint <FILE_PATH>`
Example: `/textlint README.md`

The file path will be available as `$ARGUMENTS`.

Execution process:

1. **Initial lint execution**: Run `textlint -c ~/.claude/.textlintrc.json <FILE_PATH>` to detect issues.
2. **Apply automatic fixes**: Run `textlint -c ~/.claude/.textlintrc.json --fix <FILE_PATH>` to fix auto-fixable issues.
   - If you maintain a repo-local config, replace the path with your project's config (e.g., `-c ./frontend/.claude/.textlintrc.json`)
3. **Execute manual fixes**: Apply manual fixes for remaining issues:
   - Fix sentence-ending punctuation (change colons to periods).
   - Improve mechanical expressions (`**Item**: Description` → `**Item** (Description)`).
   - Clarify ambiguous expressions ("appropriate" → "specified", etc.).
   - Remove exclamation marks ("!" → ".").
   - Change bold attention prefixes to natural expressions.
4. **Iterate**: Repeat until no errors remain or no improvement is observed.

**Processing details:**

- Use TodoWrite to track progress.
- Verify results at each step and apply fixes incrementally.
- Confirm file content before and after fixes.
- Monitor error count changes to prevent infinite loops.

**Important notes:**

- Original files will be edited directly.
- Large files may take time to process.
- textlint must be installed and configured with the config file located at `~/.claude/.textlintrc.json`
- If you prefer a project-local configuration, point `-c` to that file instead (e.g., `./frontend/.claude/.textlintrc.json`)

**Pre-execution checks:**

Before running textlint, verify the following prerequisites:

1. **Check textlint installation:**

   ```bash
   textlint -v
   ```

   If not installed, install textlint:

   ```bash
   npm install -g textlint
   ```

2. **Verify configuration file exists:**

   ```bash
   ls -la ~/.claude/.textlintrc.json
   ```

   If the config file doesn't exist, create it or copy from the project:

   ```bash
   cp frontend/.claude/.textlintrc.json ~/.claude/.textlintrc.json
   ```

3. **Install required textlint plugins:**

   ```bash
   npm install -g @textlint/markdown preset-ja-technical-writing @textlint-ja/preset-ai-writing
   ```

4. **Test textlint configuration:**
   ```bash
   textlint -c ~/.claude/.textlintrc.json --help
   ```

If any of these checks fail, resolve the issues before proceeding with textlint execution.

think hard.
