# GitHub Copilot Instructions

## Project Coding Guidelines
- Use Tailwind CSS utility classes for all styling; avoid custom CSS unless absolutely necessary.
- Use Vue 3 `<script setup>` syntax for all components.
- Keep all configuration in `src/config/config.json` and wire up UI dynamically from config.
- Use TypeScript for all new code and prefer type safety.
- Maintain accessibility: use semantic HTML, aria attributes, and keyboard navigation where possible.
- Keep code clean: run ESLint and Prettier before committing.
- Remove unused code, comments, and imports regularly.
- Use descriptive commit messages.

## Pull Request Checklist
- [ ] All UI is responsive and works in both light and dark mode.
- [ ] No custom CSS classes; all styles are Tailwind utility classes.
- [ ] All config-driven fields are dynamic and match `config.json`.
- [ ] No ESLint or Prettier errors/warnings.
- [ ] No console errors in browser or terminal.
- [ ] All new code is covered by basic tests or manual QA.

## Copilot Usage
- Use Copilot for code suggestions, but always review and refactor for clarity and project standards.
- If Copilot suggests custom CSS, refactor to Tailwind.
- If Copilot suggests options not matching config-driven UI, prefer config-driven approach.

## Communication
- Ask for clarification if requirements are ambiguous.
- Document any major architectural or design decisions in the README.

---

_This file is for Copilot and contributors. Please keep it up to date with any new project conventions or requirements._
