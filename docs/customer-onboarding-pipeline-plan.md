# Plan: Customer Onboarding Pipeline — Detailed Implementation (Python Analysis Engine)

**Status: proposal, awaiting review. No code has been changed.**

## Context

The prior round approved the shape of a full pipeline — onboarding intake → folder scaffolding/connector-lock/integration-link → CSV profiling → correlation scoring → reviewer approval — with Python scoped narrowly (two small sidecar scripts). This round goes further at your direction: **Python becomes the whole analysis engine.** `tools/csv-profiler.js`, `tools/data-comparer.js`, `tools/mapping-suggester.js`, and `tools/stats.js` are retired and reimplemented as a Python package using `polars`/`numpy`/`scipy`/`scikit-learn`. Node is reduced to the HTTP server, the UI, the new onboarding mechanics, and orchestration — it calls into Python via `spawnSync`, the exact pattern it already uses to call its own tools today, so the file-based contract (`fields.csv`, `suggestions.csv`, `report.md`, `questions.md`, etc.) that `workbench-server.js` and the UI already read doesn't change shape, only which interpreter produces it.

**Dataframe library: Polars, not pandas** — per your call. Today's fixtures are small (largest is 1.35 MB), but real onboarding exports and the eventual 128-tenant IVO corpus won't stay that size, and Polars is purpose-built for that range: multi-threaded, lazy-evaluation query engine, meaningfully lower memory overhead than pandas at scale, while remaining just as usable on small files — there's no small-file penalty that would justify a dual-library split. One library across the whole size range is simpler than a pandas/Polars fork keyed on file size, so this plan standardizes on Polars everywhere a dataframe is touched, rather than pandas for small files and Polars for large ones.

Weight-fitting (`scikit-learn`) stays gated/dormant behind real labeled data, per your call — building it now with no usable data would just demonstrate overfitting.

This plan does not redraft the docs yet — per your instruction, doc updates happen together once this is implemented. It does list exactly which docs need updating, at the end.

## Architecture split

| Stays Node | Moves to Python |
| --- | --- |
| `tools/workbench-server.js` — HTTP server, all routes | CSV profiling (was `csv-profiler.js`) |
| `ui/*` — workbench, integrations, onboarding UI | ERP↔IVO comparison (was `data-comparer.js`) |
| Onboarding mechanics — intake, scaffolding, connector lock, integration link (new, this round) | Correlation scoring + confidence gating (was `mapping-suggester.js`'s scoring half) |
| Flow authoring — draft/generated/approved/versions/discovery (untouched) | Column statistics primitives — `mask()`, `classify()`, histograms (was `stats.js`) |
| `tools/app-xchange-run-mapper.js` — execution-evidence extraction (unrelated to statistical analysis) | Cross-tenant reference aggregation (`aggregateAcrossSources()`) |
| `tools/csv.js` — still used to read Python-produced CSV artifacts back into JS for API responses | Weight fitting (`scikit-learn`, gated/dormant) |

## The Python package

`tools/ivo_analysis/` — one package, one CLI entrypoint, subcommands mirroring the pipeline stages. Every subcommand's flags mirror the existing Node CLI flags where a 1:1 mapping exists, so `workbench-server.js`'s call sites barely change shape — only the interpreter and script name do.

```text
tools/
  ivo_analysis/
    __init__.py
    cli.py          # argparse dispatch: profile | compare | score | score-one | aggregate | fit
    csv_io.py       # polars.read_csv wrapper: infer_schema_length=0 (all-string read),
                     #   keep original whitespace, distinguish empty string from null via
                     #   null_values=[] — preserves leading zeros/whitespace/blank-vs-null
                     #   exactly as docs/collecting-inputs.md already requires of the Node
                     #   reader. Uses scan_csv (lazy) for the corpus/aggregate path so a
                     #   128-tenant pull doesn't require materializing every file at once.
    schema.py       # flattenSchema() port — JSON Schema -> flat {field: {types, nullable,
                     #   maxLength, pattern, format, enum, description, required}}
    masking.py      # mask()/classify() port — vectorized via Polars' `.str` namespace and
                     #   `pl.when/then/otherwise` regex chains where straightforward;
                     #   `.map_elements()` for the run-length mask shape (not easily
                     #   expressible as a single vectorized expression) — fine at this scale
    profiling.py     # profile_column() port: fill/empty/placeholder/padded, distinct,
                     #   type histogram, mask histogram, length histogram, numeric min/max,
                     #   top_value (kept — retention makes this fine; still useful to a reviewer)
    comparing.py     # data-comparer.js port: join-key ranking, 4-level normalization
                     #   (raw/trim/upper/loose) via Polars `.cast(pl.Categorical).to_physical()`
                     #   integer codes instead of hand-rolled Int32Array dictionaries,
                     #   column-pair comparison via `.join()`, transform inference, lookup
                     #   detection
    scoring.py       # mapping-suggester.js's scoring half: score_candidate(), confidence()
                     #   with the evidence=max(semantic,value) gate fix, new value_signals()
                     #   (mask Jaccard, length-histogram distance, cardinality ratio, fill
                     #   similarity, numeric range overlap)
    aggregate.py     # aggregateAcrossSources() — cross-tenant, tenant-equal-weighted,
                     #   agreement-tracked, source-count-gated; scans the corpus lazily
                     #   (`pl.scan_csv`) since this is the one path where the input set
                     #   (up to 128 tenants) is the largest by far
    fit.py           # scikit-learn LogisticRegression + leave-one-customer-out grid search
                     #   (feature vectors converted to numpy via `.to_numpy()` at the
                     #   scikit-learn boundary); refuses to run below the labeled-data
                     #   threshold; never auto-writes
    writers.py       # every output artifact: fields.csv/report.md/questions.md (profile),
                     #   suggestions.csv/report.md/questions.md (score), mapping.csv/
                     #   lookups.csv/report.md (compare), correlation/<Object>.json (new)
  pyproject.toml     # deps: polars, numpy, scipy, scikit-learn; requires-python >=3.11
  uv.lock            # committed, reproducible across Mac/Windows/Linux
```

### Port map — old Node behavior → new Python home, nothing silently dropped

| Node today | Python equivalent | Notes |
| --- | --- | --- |
| `stats.js: profileColumn()` | `profiling.py: profile_column()` | Same fields; `topMasks` becomes a full histogram (still needed — it's now also a scoring input, not just a display value) |
| `stats.js: mask()`, `classify()` | `masking.py` | Direct port; regex table unchanged |
| `csv-profiler.js: analyse()` findings (`CONSTANT`, `OVER_MAXLENGTH`, `ENUM_VIOLATION`, `PATTERN_VIOLATION`, `NUMERIC_AS_STRING`, `TYPE_MISMATCH`) | `profiling.py` | Direct port; retention means these can keep quoting real example values, same as today |
| `csv-profiler.js: writeFieldsCsv/writeReport/writeQuestions` | `writers.py` | Same file shapes, same headers |
| `data-comparer.js: encoder/encodeColumns` (Int32Array dictionaries) | `comparing.py` via `pl.col(...).cast(pl.Categorical).to_physical()` | Same 4 normalization levels; Polars' categorical-to-physical codes are the vectorized equivalent of the hand-rolled integer dictionary — a genuine ergonomic and correctness win, not just style, and scale comfortably past today's file sizes |
| `data-comparer.js: rankJoinKeys/compare/describe/findLookup/confidenceOf` | `comparing.py` | Direct port of thresholds (fill ≥90%/≥50%, distinct ≥20, agreement ≥0.90 etc.) |
| `data-comparer.js: writeLookupsCsv` | `writers.py` | **Restored, not dropped.** The earlier decision to drop this was privacy-motivated (a complete value→value table); with local retention approved, that reason no longer applies, and the original README behavior ("`mapping.csv` is diagnostic output") is the right default again. Confirm this reading before I build it — see open questions. |
| `mapping-suggester.js: overlap()/normalizedName()` (Dice coefficient) | `scoring.py: name_score()` | Ported as-is by default. Optional upgrade: since this compares **field names**, not row values, it was never covered by the earlier "no value-level matching" restriction — `rapidfuzz.fuzz.token_sort_ratio` on field names is a legitimate, well-tested upgrade over hand-rolled Dice. Flagged as an explicit enhancement, not a silent behavior change — see open questions. |
| `mapping-suggester.js: typeCompatibility/lengthCompatibility` | `scoring.py` | Direct port |
| `mapping-suggester.js: scoreCandidate()` | `scoring.py: score_candidate()` | Adds the `value_signals()` channel (mask Jaccard, length distance via `scipy.spatial.distance.jensenshannon`, cardinality ratio, fill similarity, numeric overlap) alongside semantic/type/length |
| `mapping-suggester.js: confidence()` | `scoring.py: confidence()` | **The actual accuracy fix, carried through unchanged in intent:** gate becomes `evidence = max(semantic, value)` instead of hard-requiring `semantic` alone |
| `mapping-suggester.js: valueHandling()` | `scoring.py` | Direct port — the App Xchange JS expression generator is untouched logic, just relocated |
| `mapping-suggester.js: suggestionRows()` merge precedence (execution-evidence > recovered > reference > profiled > suggested) | `scoring.py` | Direct port; still reads `output/execution-evidence/mappings.csv` (produced by the unchanged, still-Node `app-xchange-run-mapper.js`) as an input |
| `mapping-suggester.js: writeSuggestions` preserving `review_decision`/`review_notes` across reruns | `writers.py` | Direct port — read the existing file first, merge forward |
| `workbench-server.js: mappingScore()` (in-process `scoreCandidate` call for the UI's manual re-score) | New `score-one` subcommand | Node now shells into Python for this single-pair score too, so the interactive manual score can never silently diverge from the batch score in `suggestions.csv` (a risk flagged in the prior round) |
| New: cross-tenant `aggregateAcrossSources()` | `aggregate.py` | As designed previously — tenant-equal-weighted proportions, agreement tracking, ≥3-source confidence gate, no absolute numeric ranges in the shared file |

### CLI contract (mirrors existing Node flags)

```text
uv run python -m ivo_analysis profile   --data <csv> --schema <json> --out <dir> --label <str>
uv run python -m ivo_analysis compare   --source <csv> --dest <csv> --out <dir> --source-label <str> --dest-label <str>
uv run python -m ivo_analysis score     --erp-schema <json> --erp-profile <csv> --ivo-reference <dir>
                                         [--comparison <csv>] [--execution-evidence <csv>]
                                         [--approved <csv> | --reset yes] --out <dir> --label <str>
uv run python -m ivo_analysis score-one --erp-schema <json> --erp-profile <csv> --ivo-reference <dir>
                                         --source-field <str> --dest-field <str>
                                         --> prints {"score": int, "evidence": str} JSON to stdout
uv run python -m ivo_analysis aggregate --corpus <dir-of-per-tenant-csvs> --object <str> --out <dir>
uv run python -m ivo_analysis fit       --observations <csv> --out <dir>   # refuses below threshold
```

## Node-side changes

- **`tools/workbench-server.js`**: replace `runNode(script, args)` with `runPython(subcommand, args)`:
  ```js
  function runPython(subcommand, args) {
    const result = spawnSync('uv', ['run', 'python', '-m', 'ivo_analysis', subcommand, ...args], {
      cwd: ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
    });
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${subcommand} failed`).trim());
    return result.stdout.trim();
  }
  ```
  Delegating environment resolution to `uv run` (rather than Node manually locating `.venv/bin/python` vs. `.venv/Scripts/python.exe`) removes all cross-platform venv-path branching from Node — `uv` already solves that problem, no reason to re-solve it.
- **`processCustomerObject()`**: same three-stage shape (profile → compare if IVO export present → score), same output directories, just calling `runPython('profile', ...)` / `runPython('compare', ...)` / `runPython('score', ...)` instead of `runNode('csv-profiler.js', ...)` etc.
- **`mappingScore()`**: becomes a thin wrapper around `runPython('score-one', [...])`, parsing the JSON stdout. No more in-process `scoreCandidate`/`flattenSchema` calls in Node.
- **`tools/build-ivo-reference.js`**: stays Node (thin orchestrator, per your scoping), now calls `runPython('profile', ...)` for `sample.csv` and, once the multi-tenant corpus exists, `runPython('aggregate', ...)`.
- **Deleted from Node** (logic fully ported, nothing left depending on them): `tools/csv-profiler.js`, `tools/data-comparer.js`, `tools/mapping-suggester.js`, `tools/stats.js`, `tools/schema.js`. Before deleting each, grep the repo for other importers — `tools/schema.js`'s `flattenSchema` is currently only consumed by `mapping-suggester.js` and `workbench-server.js`'s `mappingScore()`, both of which move to Python; expect a clean removal, but verify at implementation time rather than assuming.
- **Kept in Node, unchanged**: `tools/csv.js` (the server still reads Python-produced CSV artifacts back into JS for API responses — `readCsvObjects()`'s job doesn't change), `tools/app-xchange-run-mapper.js`, `tools/transcript.js`, `tools/markdown-capture-server.js` and the other doc-scraping tools (unrelated).

## Onboarding intake pipeline (unchanged from the last round — stays Node)

Nothing here changes with the Python decision, since onboarding mechanics were explicitly scoped to stay Node. Recapping the approved design so this document is self-contained:

- **New file** `customers/<KEY>/workspace/onboarding.json`, same `readX`/`saveX`/`atomicWrite` pattern as `discovery.json`. Answered once by the analyst; edited (not re-walked) for updates.
- **Four question groups**: identity & tenancy (customer key, IVO `companyId` as the tenant reference key, optional `organizationId`s for multi-org customers), connector (declared upfront from the fixed 5-connector list, cross-checked later against the uploaded schema's `$id` rather than only inferred), services/objects (multi-select from the 28 `reference/ivo/` objects, deliberately decoupled from `integrations/<connector>/definition.json` features since those are confirmed empty today), context (freeform, feeds Discovery rather than replacing it).
- **Three triggers on submit**: scaffold `customers/<KEY>/<object>/{input/erp,input/context,output}` + `table.json` for each selected object; lock the declared connector into `onboarding.json`; write the connector key so `customerServiceCatalog()` can read that connector's `features[]` once populated (mechanism only, not the feature content).
- **`customers/<KEY>/tenant.json`** (gitignored): `{ "companyId": ..., "organizationIds": [...] }`, populated directly from the intake answers, consumed by `aggregate.py`'s leave-one-out exclusion.
- **Gap to fix**: `catalog()` only discovers a customer via `input/erp/`'s presence — needs to also recognize `workspace/onboarding.json` so a freshly-onboarded, zero-CSV customer still appears on the landing page. New route: `POST /api/customers`.
- **Update model**: adding an object scaffolds just that folder; editing context/connector/org-id is a direct `onboarding.json` edit; a new CSV for an already-scaffolded object is the ordinary re-analyze path, not an onboarding update.

## Packaging & setup

- `uv` is the one new tool an employee installs once (standalone binary, no Python prerequisite, works identically on Mac/Windows/Linux — all three confirmed in use).
- `tools/pyproject.toml`: `requires-python = ">=3.11"` — `uv` bootstraps its own managed Python if the system one (3.9.6, confirmed) is too old, rather than depending on it.
- Dependencies: `polars`, `numpy`, `scipy`, `scikit-learn`. `uv.lock` committed for reproducibility across all three OSes.
- README setup step becomes: `uv sync` (once, from `tools/`) alongside `node tools/workbench-server.js` — no manual venv activation, `uv run` resolves it per-invocation.

## Sequencing

1. **Immediate, unblocked, independent of everything else:** fix the public-repo exposure (gitignore + `git rm --cached` the 118 tracked files under `.tmp/` and `reference-sources/ivo/`).
2. **Python package scaffolding + profiling.py + scoring.py core** (including the `confidence()` gate fix) + their writers. Verify end-to-end against one existing customer object (IGE departments) before going further.
3. **comparing.py** + its writers, including the restored `lookups.csv`.
4. **Node rewiring**: `runPython()`, `processCustomerObject()`, `score-one`, deletion of the retired Node files.
5. **aggregate.py** + `build-ivo-reference.js` rewiring, once a multi-tenant corpus exists to test against.
6. **fit.py**, gated/dormant, built but not wired to run automatically.
7. **Onboarding intake pipeline** — independent of steps 2–6, can proceed in parallel since it doesn't touch CSV analysis at all.
8. **Docs** — README, `.claude/CLAUDE.md` (the Node/CommonJS-only language needs a real update now, not a "sidecar exception" footnote), `docs/file-layout.md`, `docs/running-customer-mapping.md`, `docs/collecting-inputs.md`. Per your instruction, this happens together once the above is implemented, not as part of this planning pass.

## Verification

1. **Baseline parity.** Before deleting any Node analysis file, capture its current output for the 6 existing customer objects (KNA/IGE/WDC × their objects). After the Python port, diff field-for-field (not necessarily byte-identical, since the `confidence()` gate and value signals are intentional changes) — confirm no previously-`suggested`/`high`-confidence row regresses to `question`.
2. **The actual accuracy target**: IGE departments → `Company_Division` — `divisionName` ← `Department` and `divisionId` ← `KeyID` should resolve above `question` once `value_signals()` and the gate fix are live.
3. **Comparator regression**: run `compare` against a customer with a paired IVO export and confirm join-key discovery, transform inference, and lookup detection match the documented thresholds (fill ≥90%/≥50%, agreement ≥0.90 etc.) exactly as before.
4. **Cross-platform smoke test**: `uv sync && uv run python -m ivo_analysis profile ...` on at least two of the three OSes in use, since that's the one place a Python-specific regression (wheel availability, path handling) would surface.
5. **End to end**: `node tools/workbench-server.js`, walk one customer from onboarding intake through CSV upload, profiling, scoring, and approval.

## Docs that will need updating (checklist, not drafted here)

- `.claude/CLAUDE.md` — the "Node.js and CommonJS... no package dependencies" section needs to honestly describe the two-runtime split.
- `README.md` — setup step (`uv sync`), Steps 1–2 now describe Python-produced artifacts.
- `docs/file-layout.md` — restored `comparison/lookups.csv`, new `output/correlation/<Object>.json`.
- `docs/running-customer-mapping.md` — CLI examples currently show `node tools/csv-profiler.js ...`; need the `uv run python -m ivo_analysis ...` equivalents.
- `docs/collecting-inputs.md` — unaffected in substance, may want a note on where CSV parsing rules (leading zeros, blank vs. null) are now enforced (`csv_io.py`).

## Open questions

1. **Restoring `comparison/lookups.csv`** — confirmed reading is that this reverses cleanly now that retention is approved; flag if you want it to stay dropped for a different reason I'm not accounting for.
2. **`rapidfuzz` for field-name similarity** (not values) — worth adopting as part of this port, or keep the Dice-coefficient port as-is for now and treat this as a separate, later enhancement?
3. **`score-one` latency** — shelling into `uv run python` per interactive "recalculate score" click in the UI costs roughly 50–300ms per call. Acceptable for a single-reviewer local tool, or worth a longer-lived Python process for just this path? Recommend accepting the latency; flagging in case there's a reason to feel otherwise.
4. Everything still open from the last round remains open: intake UI placement, S3 timing, GitHub repo visibility, and real `companyId`/`organizationId` values for KNA/IGE/WDC.
