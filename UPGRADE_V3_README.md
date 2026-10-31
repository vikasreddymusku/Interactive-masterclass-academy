# Tinitiate AI Dashboard Tutor — V3 Quality Upgrade

**Patch for your existing** `C:\Code\interactive-training-center`. This is NOT a replacement repository.

## Fixes included

1. **Centered stage**: Recording-only dashboard sits in the center of the 1920×1080 output with a unified dark backdrop. Removes unpainted white/grey areas behind the stage. Full-screen player, sidebar, controls and teaching examples are kept inside the capture-safe area; a clipping check still aborts invalid recordings.
2. **Professional teaching pointer**: Replaces large yellow triangular pointer with a small white/cyan vector cursor, soft spotlight on the target, and cyan expanding ripple for actual clicks. The highlighted region moves smoothly with the cursor. No camera zoom.
3. **Concept teaching**: The Python adapter now reads each slide's `idea`, `analogy`, `explain`, static `code`, `out`, and `tip` from the existing `PyCourse.DECKS` data. It narrates the concept and a brief example for every slide (10 Variables slides, 17 Print slides). Generic dashboards use the actual visible headings for an overview; specialized topics still require semantic review for production.
4. **Consistent, prominent voice**: Applies FFmpeg EBU R128 loudness normalization to each ElevenLabs segment (target -16 LUFS, max true peak -1.5 dBTP), **before** mixing; changes `amix` to `normalize=0`, preventing the progressive volume increase when input clips finish; uses a limiter to protect against peaks. Captions show bite-sized text chunks during longer narration.
5. **Safe preview recording**: `--silent` and `--limit N` save results under `dashboard-tutor/work/` without replacing the previously published MP4. Full narrated recordings from the Record button still publish into the existing video placeholder.

## Install without losing your `.env` / video / site changes

1. **Stop the server** (`Ctrl+C` in its terminal).
2. **Backup the current folder** (recommended):

   ```powershell
   Copy-Item "C:\Code\interactive-training-center\dashboard-tutor" "C:\Code\dashboard-tutor-backup" -Recurse -Force
   ```

3. Extract `Tinitiate-Dashboard-Tutor-Quality-Upgrade-V3.zip` **into** `C:\Code\interactive-training-center` and allow files to overwrite. This ZIP contains only changed `dashboard-tutor/lib/` and `dashboard-tutor/test/` files plus this guide. It **does not contain `.env`, `.gitignore`, `package.json`, lesson HTML, previous MP4s, or API keys**.
4. From `C:\Code\interactive-training-center\dashboard-tutor` run:

   ```powershell
   node --env-file=.env cli.js check
   npm test
   node --env-file=.env cli.js serve
   ```

5. Open http://127.0.0.1:4173/foundational/python/variables.html and click **Re-record Tutorial**. After the narration is generated and the capture completes, the MP4 appears in the original video placeholder above the dashboard.

## Safe smoke test without ElevenLabs charges or publishing

In a second terminal while the authoring server runs:

```powershell
cd C:\Code\interactive-training-center\dashboard-tutor
node --env-file=.env cli.js record foundational/python/variables.html --silent --limit 5
```

The program prints `previewOutput` with the **local MP4 path**. Inspect that file. It does not replace the published lesson video.

## Verification performed for this patch

- JavaScript syntax checks, **12 unit tests passed**.
- FFmpeg two-pass clip normalization tested with quiet and loud synthetic audio clips; outputs measured **−16.1 LUFS** and **−16.0 LUFS**.
- Mixed audio segments separately measured **−16.1 LUFS** and **−16.0 LUFS** (no progressive gain ramp).
- The previous Python Variables upload was reviewed to locate framing and pointer issues.
- **Not yet verified:** fresh full-length recording of the actual Academy pages on your Windows PC, and ElevenLabs output using your private credentials. Test locally and share a new MP4 if an adapter needs a page-specific fix.

## Notes

- V3 changes the isolated recording browser only. It does not rewrite learner-facing course content.
- All 17 Print lessons and 10 Variables lessons are planned when they are discovered at runtime; use `--limit` only for smoke tests.
- A static GitHub site cannot execute the authoring recorder directly; keep the local server running while recording.
- ElevenLabs remains metered. Full re-recording generates new voice clips for the scenes.
- No credentials are included in this patch. Do not commit your `.env` file.
