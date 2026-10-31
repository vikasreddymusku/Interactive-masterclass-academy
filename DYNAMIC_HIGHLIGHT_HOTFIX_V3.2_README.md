# Tinitiate Dashboard Tutor — Dynamic Highlight + Interaction QA V3.2

This is a **small overlay patch on top of V3/V3.1**. It fixes the visual glitch shown in the Python Variables recording when the button changes from **Start learning** to **Continue at slide 3**, changes width, or moves during/after a click.

## Files replaced / added

- `dashboard-tutor/lib/stage.js` — recording-only live cursor/spotlight tracking and geometry audit
- `dashboard-tutor/lib/recorder.js` — click position synchronization, before/after/final-frame visual validation, diagnostics
- `dashboard-tutor/test/dynamic-highlight.test.js` — regression test for text/width/position changes and stage switching

This ZIP **does not include** `.env`, API keys, your original pages, recorded MP4 files, or a new website template.

## Improvements

1. The cursor and highlight now track the actual DOM element continuously via `ResizeObserver`, mutation observation, and animation frames. If the button label or size changes after a click, the outline follows immediately.
2. The Playwright click and teaching cursor use the same **center coordinate** rather than a slightly different point.
3. Effects are cleared between teaching scenes, preventing an old dashboard outline from flashing over the slide player.
4. The recorder audits spotlight dimensions, pointer position, and click hit target before/after each click, and again at the end of every teaching scene. It makes one bounded synchronization retry if misaligned. It does not disable the existing clipping checks.
5. Interaction audit metadata is included in the preview's `timeline.json`: `beforeLabel`, `afterLabel`, `beforeRect`, `afterRect`, `driftPx`, `pointerDriftPx`, and `hitTest`. Remaining visual drift produces `effect-failure-scene-N.png` and `.json` in the job folder instead of silently publishing.

## Install (Windows PowerShell)

Stop the local recorder service first (`Ctrl+C`). In your VS Code terminal:

```powershell
cd C:\Code\interactive-training-center
Expand-Archive -Path "$HOME\Downloads\Tinitiate-Dashboard-Tutor-Dynamic-Highlight-QA-V3.2.zip" -DestinationPath . -Force
cd dashboard-tutor
npm test
```

To run the **real browser regression** as well (Playwright/Chromium must be installed):

```powershell
$env:TUTOR_BROWSER_TEST = "1"
npm test
Remove-Item Env:\TUTOR_BROWSER_TEST
```

Start server in Terminal 1:

```powershell
node --env-file=.env cli.js serve
```

Keep server running. In Terminal 2, check the first five scenes without ElevenLabs credits:

```powershell
cd C:\Code\interactive-training-center\dashboard-tutor
node --env-file=.env cli.js record foundational/python/variables.html --silent --limit 5
```

Review the preview in `dashboard-tutor\work\foundational-python-variables-*\foundational-python-variables.mp4` and its `timeline.json`. In Scene 4, confirm the highlight follows the resized **Continue at slide 3** button. In Scene 5, confirm the previous outline is gone and focus has moved to **First slide**.

Then rerun the complete narrated tutorial:

```powershell
node --env-file=.env cli.js record foundational/python/variables.html
```

## Verification

- All **15** Node and actual Chromium tests passed in our test environment, including the synthetic button relabel/resize/move regression and the existing genuine clipping rejection test.
- Your exact Windows dashboard has **not** been re-recorded with this patch here. Validate a silent preview before consuming ElevenLabs credits.
- This adds automatic **geometric** visual checks; it does not yet detect all possible semantic narration mistakes, unrelated graphical artefacts, or browser-specific font differences.
