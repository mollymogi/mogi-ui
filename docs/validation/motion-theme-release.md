# Motion and glass PR validation

This consolidates the final accepted preview on top of main (PR #34 is already merged).

- 61 browser checks passed with no runtime exceptions: 21 motion-trio, 24 controls, 16 ambient/glass. JSON evidence is alongside this document. A separate check passed for the explicit dark-preview URL and the system reduced-transparency fallback.
- 31 Node regression tests passed.
- 243 contrast checks passed, including gradient stops, conservative per-channel bounds and glass alpha compositing.
- UI/docs TypeScript, registry rebuild and docs production build passed. The existing Vite chunk-size warning remains.

The browser suites are preserved in `scripts/browser/`. With installed Google Chrome, start the docs dev server and install Playwright into a temporary tools directory (no repository dependency changes needed):

```sh
npm install --prefix /tmp/mogi-browser-tools playwright
export MOGI_PLAYWRIGHT_PATH=/tmp/mogi-browser-tools/node_modules/playwright
export MOGI_PREVIEW_URL=http://127.0.0.1:5187
node scripts/browser/motion-trio.cjs
node scripts/browser/motion-controls.cjs
node scripts/browser/ambient-glass.cjs
node scripts/browser/glass-preferences.cjs
```

Suites write screenshots and JSON results to `/tmp`. They cover rapid and keyboard tab selection, changed digits and initial real values, real clipboard success/denial, async action retry and duplicate protection, mixed/disabled checkbox state, collapse height/draft retention/inert keyboard skipping, portal dismissal/focus restoration and motion-preference changes during exit, independent theme switches, and 320/390/768/1440px light/dark layouts.

The final dark surface is a neutral 4%-white tint with 40px backdrop blur; nested metric/code backgrounds are transparent. Inputs retain their control fill. Glass is opt-in and falls back to opaque card fills with reduced transparency or unsupported blur. An older browser lacking backdrop-filter was not run. Contrast evidence applies to the controlled gradients, not arbitrary imagery.

All save/data examples are explicitly local demos. No external consumer application or daily-use service was changed.
