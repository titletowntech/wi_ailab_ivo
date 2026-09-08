# Running a Customer Mapping

This is the repeatable customer onboarding process. It consumes a published, static IVO contract from `reference/ivo/<object>/`; it never creates or updates that contract.

## Prerequisites

- IVO has published the object reference using [loading-ivo-references.md](loading-ivo-references.md).
- The customer ERP schema is saved as `input/erp/schema.json`.
- A representative ERP export is saved as `input/erp/data.csv`.
- Any object-specific supporting documents or chat transcripts are saved under `input/context/`.

See [collecting-inputs.md](collecting-inputs.md) for collection and data-safety requirements.

## 1. Profile the ERP

```powershell
$customer = "customer-name"
$object = "equipment"
$customerObject = "customers/$customer/$object"

node tools/csv-profiler.js `
  --data "$customerObject/input/erp/data.csv" `
  --schema "$customerObject/input/erp/schema.json" `
  --out "$customerObject/output/erp-profile" `
  --label "$customer ERP $object"
```

Resolve the questions in `output/erp-profile/questions.md` before approving mappings.

## 2. Generate the Proposal

```powershell
node tools/mapping-suggester.js `
  --erp-schema "$customerObject/input/erp/schema.json" `
  --erp-profile "$customerObject/output/erp-profile/fields.csv" `
  --ivo-reference "reference/ivo/$object" `
  --out "$customerObject/output/mapping-proposal" `
  --label "$customer $object"
```

When an App Xchange execution JSON is available, extract its mappings and use its authored value handling as higher-confidence evidence:

```powershell
node tools/app-xchange-run-mapper.js `
  --run "$customerObject/input/context/app-xchange-run.json" `
  --out "$customerObject/output/execution-evidence"

node tools/mapping-suggester.js `
  --erp-schema "$customerObject/input/erp/schema.json" `
  --erp-profile "$customerObject/output/erp-profile/fields.csv" `
  --ivo-reference "reference/ivo/$object" `
  --execution-run "$customerObject/input/context/app-xchange-run.json" `
  --out "$customerObject/output/mapping-proposal" `
  --label "$customer $object"
```

The extractor writes `mappings.csv` with source and destination objects, fields, lookup steps, and exact value-handling expressions. It also writes `lookups.csv` with each cache lookup's table, filters, selected fields, and inferred trigger source. The suggester scopes ancillary actions out by selecting the action object with the strongest field overlap with the IVO schema.

After extraction, the workbench automatically reuses `output/execution-evidence/mappings.csv` during later analyses. The raw execution can therefore remain protected customer input while the concise mapping evidence stays with the onboarding artifacts.

Review every row in `suggestions.csv`, resolve lookup candidates, and save accepted decisions under `output/approved-mapping/`. A proposal is evidence for review, not an approved mapping.

## 3. Review Supplemental Context

After generating the proposal, place additional object-specific evidence in `input/context/`. Supported source material can include Word documents (`.docx`) and chat or meeting transcripts (`.txt` or `.md`). Use clear filenames that identify the source or topic; add an ISO date when chronology matters.

Review the context against `output/mapping-proposal/suggestions.csv` and `questions.md`. For each mapping affected by the new evidence:

1. Record the source filename and the relevant business rule or decision in `output/mapping-proposal/context-review.md`.
2. Confirm, reject, or replace the proposed source-to-destination mapping.
3. Resolve any constants, defaults, lookup translations, and previously unanswered questions supported by the evidence.
4. Save accepted decisions under `output/approved-mapping/`; do not overwrite the generated proposal artifacts.

Keep context specific to one object under `customers/<customer>/<object>/input/context/`. When one source applies to multiple objects, keep it under `customers/<customer>/input/context/` and cite that shared path in each object's `context-review.md`.

## 4. Optional Existing-Integration Comparison

When matching ERP and IVO exports exist, save the IVO export under `input/ivo/data.csv` and run `tools/data-comparer.js`. Keep its results under `output/comparison/`; they are diagnostic evidence and do not replace the proposal or approved mapping.

## Boundary

Customer-specific constants, custom fields, lookup translations, and mapping decisions stay under the customer folder. If onboarding reveals a possible gap in the IVO contract, record it for IVO review; do not edit `reference/ivo/` during the mapping run.
