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

## Copy failure visibility fix — 2026-10-21

Validated the local fix on top of `5c0386885b1d40f676953f16e6a6633ba7289573` in installed headless Chrome. All 30 browser checks passed across light/dark themes and 320/390/1440px viewports: simulated permission denial and missing clipboard API show a visible, unclipped status message and error icon; error timeout restores the original row height; keyboard retry copies the full 64-character digest and clears the visible error; success timeout restores the copy icon. No runtime exceptions or page overflow occurred. Clipboard outcomes were controlled simulations and did not change the OS clipboard. Mobile and desktop screenshots were visually inspected.

The existing 31 Node regression tests, UI/docs type checks, 131 contrast checks, registry rebuild and docs production build passed. The build retains the existing large-chunk warning.

These are isolated library/demo checks. The external `onsite-console` application was not changed or tested. Hooks retain the shadcn registry convention; `aliases.hooks` configuration is documented rather than silently relocating consumer files.
