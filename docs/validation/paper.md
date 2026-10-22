# Cream paper theme validation

- 18 real Chrome checks passed with no page exceptions: explicit light URL under dark system preference; actual yellow/ink primary colors and outline; idle/hover/pressed shadows and displacement; successful action feedback; disabled hover; major/nested shadow hierarchy; pink note; checked switch boundary and thumb; portal appearance; switching to dark/monochrome/warm without stale paper effects; reduced-motion translation suppression; visible keyboard focus; and 320/390/768/1440px layouts without overflow.
- 447 contrast checks across the four palettes pass, including gradient/composited fills. A negative regression verifies yellow primary text contrast is enforced even when the registry matches.
- 33 Node regression tests, UI/docs TypeScript and production build pass; existing Vite chunk warning remains. Registry rebuilt including independent mogi-theme-paper.

Browser report: paper-browser.json. Re-run `scripts/browser/paper.cjs` with the same MOGI_PLAYWRIGHT_PATH and MOGI_PREVIEW_URL setup used by other browser suites. Desktop/mobile screenshots in docs/images/paper-* were inspected. User-provided visual reference informed color/shadow direction; its branding, illustrations and content were not copied.

Theme uses html data-palette="paper" and excludes dark. Source CSS and registry include both palette variables and scoped shape/interaction rules. Paper primary actions keep a separate focus-visible outline so hard shadows do not mask the keyboard focus indicator. Data/save examples remain local demos. Online installation of mogi-theme-paper requires publication of this branch.
