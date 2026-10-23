# Monochrome light validation

- 15 real Chrome checks passed, no runtime exceptions: explicit light URL under dark system preference; actual neutral background/card/input/button colors; retained success semantics; dialog/popover portal inheritance; switching monochrome ↔ dark ↔ warm without stale tokens; working dynamic metrics; 320/390/768/1440px no overflow.
- 345 text/control contrast checks across warm light, dark and monochrome pass. A negative regression confirms monochrome text violations fail even if registry matches.
- 32 Node regression tests, UI/docs TypeScript and Vite production build pass (existing large-chunk warning remains).
- Registry rebuilt successfully, including the independent mogi-theme-monochrome entry. Source/registry parity is enforced by contrast:check. Online installation requires publication; this validation uses the generated local registry.

Browser evidence: monochrome-browser.json. Re-run with MOGI_PLAYWRIGHT_PATH and MOGI_PREVIEW_URL as described in motion-theme-release.md, then `node scripts/browser/monochrome.cjs`. Screenshots in docs/images/monochrome-* were inspected at desktop/mobile sizes. Colors remain semantic for success/warning/error; this is not a full-page grayscale filter.
