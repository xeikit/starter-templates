---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Start Specification-Driven Development (SDD) workflow for the given task
---

## Context

- Task requirements: $ARGUMENTS

## Your task

Execute the complete Specification-Driven Development (SDD) workflow:

### 1. Setup

- Create `.tmp` directory if it doesn't exist.
- Create a new feature branch based on the task.

### 2. Stage 1: Requirements

Execute the `/requirements` command to create a detailed requirements specification.

Note: Present the requirements to the user for approval before proceeding.

### 3. Stage 2: Design

Execute the `/design` command to create a technical design based on the requirements.

Note: Present the design to the user for approval before proceeding.

### 4. Stage 3: Test Design

Execute the `/test-design` command to create a comprehensive test specification based on the design.

Note: Present the test design to the user for approval before proceeding.

### 5. Stage 4: Task List

Execute the `/tasks` command to break down the design and test cases into implementable tasks.

Note: Present the task list to the user for approval before proceeding.

### 6. Report completion

Summarize what was created and inform the user that they can now proceed with implementation using the generated specification documents.

## Important notes

- Each stage output should be detailed and actionable.
- Wait for user confirmation between stages.
- Focus on clarity and completeness in documentation.
- Consider edge cases and error scenarios in each stage.

think hard.
