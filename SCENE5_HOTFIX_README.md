# Tinitiate Dashboard Tutor — Scene 5 capture hotfix (V3.1)

## What this fixes

The V3 recorder can reject the first Python slide-player scene (`#py-first`) because nested panels exceed one of their `overflow:hidden` ancestors, even while their reported screen coordinates are inside 1920×1080. This is a capture layout / geometry issue, **not an ElevenLabs failure**.

This patch:
- Stabilizes layout before measuring: waits two rendered frames and for slide-entry animations to complete.
- Expands the recording-only centered player frame slightly, keeping a safe region for subtitles and 1920×1080 output.
- Makes the code editor, slide grid and panel columns respect the available width.
- If a scene still clips, attempts a small recording-only reflow (more height and reduced padding/sidebar width). It does **not** zoom the lesson, disable clipping detection, hide learning content, or change your production dashboard CSS.
- Keeps the fitted player layout stable across subsequent scenes.
- Emits the **clipping ancestor, side and geometry** when an element remains clipped, so the next fix can target the actual cause.
- Writes a per-scene diagnostic screenshot **and JSON file** for any unresolved clipping failure.

## Install

1. Stop the local authoring server with Ctrl+C.
2. Make a backup of the two files under `dashboard-tutor/lib/`, if desired.
3. Extract **this ZIP** over the repository root `C:\Code\interactive-training-center` (not into `dashboard-tutor` itself). The ZIP contains `dashboard-tutor/lib/stage.js` and `dashboard-tutor/lib/recorder.js`, plus the optional regression test `dashboard-tutor/test/layout-browser.test.js`.
4. Do **not** replace `.env` or any existing video. Neither is in the patch.

PowerShell:

```powershell
cd C:\Code\interactive-training-center
Expand-Archive -Path "$HOME\Downloads\Tinitiate-Dashboard-Tutor-Scene5-Hotfix-V3.1.zip" -DestinationPath . -Force
cd dashboard-tutor
npm test
```

**Terminal 1** (leave it running):

```powershell
node --env-file=.env cli.js serve
```

**Terminal 2** (silent Scene 5 regression; no ElevenLabs charge):

```powershell
cd C:\Code\interactive-training-center\dashboard-tutor
node --env-file=.env cli.js record foundational/python/variables.html --silent --limit 5
```

If that succeeds, use the browser **Re-record Tutorial** to generate a new voiced video, or run:

```powershell
node --env-file=.env cli.js record foundational/python/variables.html
```

## Validation performed

- Twelve existing unit tests passed.
- One *real Chromium* synthetic layout regression passed: the progress dashboard and player fit, while an intentionally clipped output panel was rejected correctly.
- A full local Windows recording of your actual Variables dashboard has **not** been run in this environment; use the silent command above before paying for narration.

## If the failure persists

Use `dashboard-tutor/work/<newest-job>/layout-failure-scene-5.json` and `layout-failure-scene-5.png`. The JSON now identifies the clipping ancestor (`clip.element`), which side (`clip.sides`) and its bounds. Those files let us target the exact issue rather than weakening the safety check.
