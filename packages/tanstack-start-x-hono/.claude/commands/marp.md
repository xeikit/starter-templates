---
allowed-tools: Read, Write, Bash(marp:*, rm:*)
description: Simplify markdown and convert to PDF with Marp
---

## Context

- Input file: $ARGUMENTS
- Guidelines: @~/.claude/templates/slide-guidelines.md
- Template: @~/.claude/templates/design-template.md

## Your task

1. Read the input markdown file
1. Read the slide guidelines
1. Simplify the markdown content according to the guidelines:
   - Shorten titles to max 30 full-width characters
   - Simplify bullet points to 1-2 lines each
   - Remove redundant phrases
   - Keep max 5-7 bullet points per slide
   - Break long paragraphs

1. Read the design template
1. Apply the template to the simplified content
1. Save to a temporary file
1. Convert to PDF using Marp CLI
1. Clean up the temporary file

The output PDF should be in the same directory as the input file, using the same base filename with a .pdf extension (e.g., `slides.md` → `slides.pdf`).

think hard.
