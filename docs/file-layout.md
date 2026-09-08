# File Layout

IVO-owned reference contracts are shared across customers. Each customer object has one `input/` tree for externally supplied files and one `output/` tree for generated or reviewed artifacts.

```text
reference-sources/
  ivo/
    <object>/
      schema.json                  # original IVO input
      sample.csv                   # optional original IVO sample
      profile/                     # generated evidence
        fields.csv
        report.md
        questions.md

reference/
  ivo/
    README.md
    <object>/
      schema.json
      field-catalog.csv
      lookup-rules.csv
      validation-rules.json
      example-payload.json

customers/
  <customer>/
    <object>/
      table.json                    # selected IVO reference for this customer table
      input/
        erp/
          data.csv
          schema.json
        ivo/                      # optional existing/post-deployment export
          data.csv
        context/                  # optional supporting documents and transcripts
          source-or-topic.docx
      output/
        erp-profile/
          fields.csv
          report.md
          questions.md
        ivo-profile/              # optional
          fields.csv
          report.md
          questions.md
        mapping-proposal/
          suggestions.csv
          report.md
          questions.md
          context-review.md       # optional evidence and decisions from context review
        comparison/               # optional
          mapping.csv
          lookups.csv
          report.md
        approved-mapping/
          mapping.csv
          lookups.csv
        validation/
          results.csv
          report.md
```

## Pipeline

```text
IVO schema + optional sample -> review -> published static IVO reference

published IVO reference ──────────────┐
customer ERP schema + CSV -> profile ─┼-> proposal -> context review -> approved mapping -> validation
supplemental customer context ────────┤
prior approved mappings (future) ─────┘

optional paired ERP/IVO data -> comparison evidence and regression scoring
```

| Output | Required inputs | Machine-readable result |
| --- | --- | --- |
| `erp-profile` | Customer ERP CSV and schema | `fields.csv` |
| `mapping-proposal` | ERP profile/schema and shared IVO contract | `suggestions.csv` |
| `approved-mapping` | Reviewed proposal and answered questions | `mapping.csv`, `lookups.csv` |
| `validation` | Approved mapping, ERP rows, and IVO contract | `results.csv` |
| `ivo-profile` | Optional IVO export and shared IVO schema | `fields.csv` |
| `comparison` | Matching ERP and IVO exports | `mapping.csv`, `lookups.csv` |

## Rules

- Use lowercase kebab-case for customer and object folders.
- Record the matching IVO object in `table.json`; customer and reference folder names may differ.
- Preserve original IVO inputs under `reference-sources/`; do not edit them during generation.
- Publish reviewed IVO contracts under `reference/`; customer runs consume but do not modify them.
- Put the object name in the path once: `customers/<customer>/<object>/`.
- Do not copy the IVO reference into customer folders.
- Put every externally supplied file under `input/`, including optional IVO exports.
- Put object-specific supporting documents and transcripts under `input/context/`; use `customers/<customer>/input/context/` only for evidence shared by multiple objects.
- Put every tool-generated or human-reviewed artifact under `output/`.
- Treat customer `input/` files as immutable for a run.
- Never edit generated profile, proposal, or comparison artifacts.
- Save human decisions only in `output/approved-mapping/`.
- A comparison `mapping.csv` is diagnostic output; `approved-mapping/mapping.csv` is the customer contract.
- Reference files must not contain customer records or customer-specific lookup translations.
- When snapshots are needed, suffix data files with an ISO date and keep the undated filename as the current working export.

See [../reference/ivo/README.md](../reference/ivo/README.md) for the exact reference file specifications.
