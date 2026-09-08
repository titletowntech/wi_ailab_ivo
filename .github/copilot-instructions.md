# Project Guidelines

## Product Goal

- Build a maintainable way to generate mappings between source systems and IVO using Trimble App Xchange.
- Use this goal to guide every change. Favor work that improves mapping generation, review, validation, or execution through App Xchange.
- Preserve the distinction between generated mapping evidence and reviewer-approved mappings.
- Ask focused questions when requirements, mapping semantics, or App Xchange behavior are unclear and the answer could affect correctness or maintainability.

## App Xchange Documentation

- Consult `docs/app-xchange-help-markdown/` first for App Xchange behavior, configuration, and terminology.
- If the needed information is not available there, search authoritative internet sources.

## Node.js

- This project uses Node.js and CommonJS. Follow the patterns in `tools/` and `ui/`.
- Prefer built-in Node.js and browser APIs. The project currently has no package dependencies; add one only when it provides clear value that would be difficult to implement and maintain locally.

## Simplicity

- Always choose the simplest solution that fully satisfies the requirement.
- Make small, focused changes and reuse existing code before introducing new abstractions.
- Avoid speculative flexibility, unnecessary layers, new frameworks, and premature generalization.
- Add an abstraction only when it removes demonstrated duplication or complexity.
- Keep behavior explicit and easy to trace. When two approaches are equally correct, choose the one with fewer concepts and less code.
- Keep the user interface simple, task-focused, and consistent with the existing mapping workflow. Do not add controls, screens, or visual decoration without a clear user need.

## Maintainability

- Prefer clear names, small functions, and established repository patterns.
- Keep mapping rules and domain decisions explicit so reviewers can understand and verify them.
- Add concise comments only when intent, a business rule, or non-obvious behavior cannot be understood from the code itself. Do not narrate straightforward code.
- Update relevant documentation when behavior or workflows change.

## Validation

- Run the narrowest relevant Node.js command or existing workflow after changing code.
- Do not change generated customer or reference data unless the task explicitly requires it.