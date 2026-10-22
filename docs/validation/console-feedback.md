# Issue #33 validation

Source: https://github.com/mollymogi/mogi-ui/issues/33

- UI and docs TypeScript checks pass; UI enables `noUncheckedIndexedAccess` for future CI runs.
- `node --test scripts/console-feedback.test.mjs scripts/code-block-diff.test.mjs scripts/check-contrast.test.mjs`: 31 passed, 0 failed.
- Registry rebuilt successfully, including the four new components and their dependencies.
- `node scripts/check-contrast.mjs`: 131 checks, 0 failures; no theme token changes.
- Docs Vite production build passes. The existing bundle-size warning remains.
- Headless installed Chrome 156: 22 checks passed, no runtime exceptions. Machine-readable results: [console-feedback-browser.json](console-feedback-browser.json).

Browser checks cover real label focus for explicit/generated IDs, description/error ARIA linkage, RHF submission, password reveal by mouse and keyboard without submitting or resetting the value, disabled reveal, status fallback, full digest clipboard writes, copy failure feedback, full description text, measured compact row height (40.5px default → 32.5px compact), and page overflow at 320/390/768/1440px in both themes. Screenshots in `docs/images/console-feedback-*` were reviewed at desktop and mobile sizes.

The copy test checks that a click does not escape React's event boundary; it does not guarantee suppression of native DOM listeners already executed before React's delegated handler. Browser clipboard permission is required. `maxChars` is a CSS ch width, not a string slice. Opaque custom form wrappers need `FormItem.itemId`; the library does not evaluate arbitrary component functions to discover internal IDs.

These are isolated library/demo checks. The external `onsite-console` application was not changed or tested. Hooks retain the shadcn registry convention; `aliases.hooks` configuration is documented rather than silently relocating consumer files.
