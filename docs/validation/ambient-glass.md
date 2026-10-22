# Ambient / glass validation

16 Chrome checks passed, no page errors; details in ambient-glass-browser.json. Checks cover light opaque panels, actual computed dark 4%-white translucent fill and backdrop blur, transparent nested metrics, independent gradient/glass opt-outs, portal dialog/popover styling and dismissal, and no page overflow at 320/390/768/1440px in both themes. Screenshots were inspected in light and dark modes.

A separate Chrome CDP media-emulation check confirmed prefers-reduced-transparency: reduce produces an opaque card fill and removes blur. The explicit theme=dark URL was also verified. Unsupported backdrop-filter uses the opaque base declaration; an older browser without support was not run.

243 contrast checks pass, including gradient stops, conservative channel bounds and alpha-composited glass; 31 existing regression tests pass. UI/docs TypeScript, registry generation and production build pass (existing large-chunk warning remains). These checks apply to the controlled theme backgrounds, not arbitrary images or videos.

Preview: ?preview=motion-trio&theme=dark. Base theme defaults remain opaque; AmbientBackground and GlassSurface are opt-in components. No changes to external consumer repositories or daily-use services.

Clear-panel refinement: removed the 72% brown tint, made nested metric/code fills transparent, and verified actual computed fill/blur plus all 16 browser checks again. Updated desktop screenshot was inspected. TypeScript, production build, registry generation and 243 contrast checks pass for this revision.
