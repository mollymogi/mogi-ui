# Motion controls validation

Real installed Chrome: 24 new browser checks passed, 0 page exceptions. Machine-readable evidence: [motion-controls-browser.json](motion-controls-browser.json).

Checks cover partial-selection icon/semantics, select-all/clear-all, Space-key selection, disabled state and preserved preferences, intermediate measured collapse height, closed inert content and keyboard skipping, preserved input draft, rapid expand/collapse, actual clipboard text and visible permission failure, popover density effects and Escape/focus restoration, dialog editing/Escape/focus restoration, small viewport bounds, manual/system reduced motion, and changing reduced motion during exit without stranding a portal. Layout checks cover 320/390/768/1440px in both themes. Desktop light/mobile dark screenshots in docs/images were visually inspected.

The original motion trio was rerun: 21 browser checks passed. Existing Node regressions: 31 passed. Semantic contrast: 131 checks, 0 failures. UI/docs TypeScript checks, registry generation and Vite production build passed; existing large-chunk warning remains.

Save, preference edits and metric snapshots are local demos. Clipboard checks exercise actual browser clipboard APIs with granted permissions plus an explicit denial case. No external consumer application or daily-use service was modified. Dialog and Popover retain animation names with an effectively instant 1ms duration when motion is disabled so Radix Presence can complete exit cleanup. Collapsible keeps content mounted and uses inert/aria-hidden when closed; it is not a mechanism for removing sensitive data from the DOM.
