# IVO Mapping Tools

Local Node.js tools that help IVO map a customer ERP into IVO before configuring Trimble App Xchange. There are no package dependencies.

There are two separate workflows:

- [Load or update an IVO reference](docs/loading-ivo-references.md) when IVO publishes an object contract. The approved result under `reference/ivo/` is static between IVO contract changes.
- [Run a customer mapping](docs/running-customer-mapping.md) for each onboarding. It consumes the reference and never regenerates it.

Once a customer's mappings are approved, flows are authored into the customer workspace. See [Object relationships](docs/object-relationships.md) for how IVO objects relate and which flows can share a cache trigger, [Service composition](docs/service-composition.md) for how App Xchange services are split and sequenced per customer, and the `appxchange-flow-design` skill under `.claude/skills/` for the flow authoring procedure and canonical flow JSON contract.

The shared structure those flows sync into — features, job schedules, and integration configurations — is recorded per ERP connector under [Integration definitions](docs/integration-definitions.md).

IVO is connected to five ERPs through App Xchange — Vista, Spectrum, Foundation, Sage 100 Contractor, and Sage 300 CRE. Only Vista and Spectrum have captured reference material under `reference/`; documentation for the others is still being gathered.

The normal onboarding process requires:

- the shared IVO object contract under `reference/ivo/`;
- the customer's ERP connector schema;
- a representative full ERP CSV export.

Supporting Word documents and chat or meeting transcripts are optional inputs used to refine a generated proposal. An IVO data export is also optional; when one exists, it can reconstruct an existing integration, support regression testing, or verify a deployment.

## Customer Workspace

Start the local workbench from the repository root:

```powershell
node tools/workbench-server.js
```

Then open `http://127.0.0.1:43129`. The main page lists discovered customers and provides access to shared IVO references and integration definitions. Selecting a customer opens its flow workspace at `/workspace?customer=<customer-key>`. Source profiling and mapping tools remain available from the main page and at `/mapping`.

The customer workspace stores an immutable generated baseline, editable draft, approved contract, and version history under `customers/<customer>/workspace/`. Flow approval is required before workspace approval. Blocking structural validation findings prevent approval.

Each workspace also keeps a [discovery log and flow version history](docs/discovery-and-versions.md): imported call transcripts and typed notes, with the customer's concrete asks tagged as decisions, and a version of the workspace per editing session that any flow can be restored from.

The mapping workbench discovers customers from `customers/` and IVO references from `reference/ivo/`. It can upload and analyze customer tables, create IVO references from source files, preview stored files, and save reviewed matches to `customers/<customer>/<object>/output/approved-mapping/mapping.csv`.

The local workbench uses the repository folders as its data store; no database is required for a single reviewer. A hosted or multi-user version will need authentication, concurrency control, and a shared audit store before it can safely accept simultaneous reviews.

## Structure

```text
integrations/
  <connector>/
    definition.json       # features, job schedules, integration configurations

reference-sources/ivo/
  <object>/
    schema.json
    sample.csv              # optional original IVO sample
    profile/                # generated source evidence

reference/ivo/
  modules.json            # groups IVO objects into modules for cache-writer services
  <object>/
    schema.json
    field-catalog.csv
    validation-rules.json

customers/
  <customer>/
    workspace/
      generated.json        # immutable AI-generated evidence
      draft.json            # current reviewer-edited canonical workspace
      approved.json         # latest approved workspace contract
      discovery.json        # transcripts, notes, and tagged customer decisions
      versions/             # session, checkpoint, and approval snapshots
    input/
      context/              # imported transcripts and shared supporting documents
    <object>/
      input/
        erp/
          data.csv
          schema.json
        ivo/                  # optional existing/post-deployment export
          data.csv
        context/              # optional supporting documents and transcripts
          source-or-topic.docx
      output/
        erp-profile/
          fields.csv
          report.md
          questions.md
        ivo-profile/          # optional generated analysis
          fields.csv
          report.md
          questions.md
        mapping-proposal/
          suggestions.csv
          report.md
          questions.md
          context-review.md   # optional context-derived decisions
        comparison/           # optional generated analysis
          mapping.csv
          lookups.csv
          report.md
        approved-mapping/     # reviewed customer decisions
          mapping.csv
          lookups.csv
        validation/           # planned
          results.csv
          report.md
```

The organization rule is simple:

- `integrations/` holds one App Xchange integration definition per ERP connector, shared across every customer on that connector.
- `reference-sources/` preserves original IVO inputs and generated profiling evidence separately from the published contract.
- `reference/` contains reusable, customer-independent IVO contracts.
- `customers/<customer>/<object>/input/` contains files exported from external systems.
- `customers/<customer>/<object>/output/` contains generated analyses and reviewed decisions.
- The object name appears once in the customer path; files use contextual names such as `data.csv` and `schema.json`.
- Output folders use descriptive names rather than numbered stages because optional analyses do not run in a fixed sequence.

See [reference/ivo/README.md](reference/ivo/README.md) for the reference file specifications and [docs/file-layout.md](docs/file-layout.md) for path rules.

## Step 1: Profile the ERP

Tool: `tools/csv-profiler.js`

```powershell
$object = "equipment"
$customerObject = "customers/customer-name/$object"

node tools/csv-profiler.js `
  --data "$customerObject/input/erp/data.csv" `
  --schema "$customerObject/input/erp/schema.json" `
  --out "$customerObject/output/erp-profile" `
  --label "Customer ERP Equipment"
```

Outputs:

| File | Purpose |
| --- | --- |
| `fields.csv` | Machine-readable fill, cardinality, type, length, and quality evidence |
| `report.md` | Human-readable ERP profile and schema conflicts |
| `questions.md` | Customer-specific fields and conflicts requiring answers |

## Step 2: Generate a Mapping Proposal

Tool: `tools/mapping-suggester.js`

The suggester combines the ERP schema/profile with the shared IVO schema. It uses normalized names, descriptions, types, lengths, and candidate ambiguity. Destination IDs proposed from business values are labeled `lookup-candidate` rather than direct assignments.

```powershell
node tools/mapping-suggester.js `
  --erp-schema "$customerObject/input/erp/schema.json" `
  --erp-profile "$customerObject/output/erp-profile/fields.csv" `
  --ivo-reference "reference/ivo/$object" `
  --out "$customerObject/output/mapping-proposal" `
  --label "Customer Equipment"
```

Outputs:

| File | Purpose |
| --- | --- |
| `suggestions.csv` | Proposed source/destination mappings, confidence, alternatives, rationale, and review columns |
| `questions.md` | Low-confidence and unresolved destination fields |
| `report.md` | Proposal coverage summary |

A proposal is not an approved mapping.

## Step 3: Review Additional Context

After generating the proposal, place object-specific supporting material under `$customerObject/input/context/`. Word documents (`.docx`) and chat or meeting transcripts (`.txt` or `.md`) can clarify business rules that are not evident from schemas and sample data.

Review that context against `output/mapping-proposal/suggestions.csv` and `questions.md`. Record the source filename, relevant business rule, confirmed or rejected mappings, and remaining questions in `output/mapping-proposal/context-review.md`. Use the proposal's review columns for context-backed decisions without changing its generated evidence columns.

Keep shared customer context that applies to multiple objects under `customers/<customer>/input/context/` and cite that path in each object's context review. Accepted decisions move to `output/approved-mapping/` during approval.

## Step 4: Review and Approve

Reviewers must:

1. Resolve ERP profile questions.
2. Confirm or reject every proposed mapping.
3. Supply mappings for required unresolved IVO fields.
4. Resolve all lookup candidates and record the decision with the approved mapping.
5. Decide customer-specific constants and defaults.
6. Save the approved result under `output/approved-mapping/`.

`$customerObject/output/approved-mapping/mapping.csv` will be the canonical customer mapping. Initialization and approval tooling is not yet built.

## Step 5: Validate

The planned validator will check the approved mapping against:

- `reference/ivo/<object>/schema.json`;
- `field-catalog.csv` ownership and behavior;
- `validation-rules.json`;
- representative ERP rows.

It will not require existing IVO records. Validation tooling is not yet built.

## Optional: Compare an Existing Integration

Tool: `tools/data-comparer.js`

Use this only when matching ERP and IVO exports exist. It reconstructs observed mappings for backfill, calibration, regression testing, or post-deployment verification.

```powershell
node tools/data-comparer.js `
  --source "$customerObject/input/erp/data.csv" `
  --dest "$customerObject/input/ivo/data.csv" `
  --out "$customerObject/output/comparison" `
  --source-label "Customer ERP" `
  --dest-label "IVO"
```

Its `mapping.csv` is diagnostic output, not the customer mapping proposal or approved mapping. The external IVO CSV stays under `input/ivo/`; its generated profile and comparison belong under `output/`.

## Current KNA Example

The validated Equipment example follows the same structure:

```text
customers/KNA/equipment/
  input/
    context/
    erp/data.csv
    erp/schema.json
    ivo/data.csv
  output/
    erp-profile/
    ivo-profile/
    mapping-proposal/
      context-review.md
    comparison/
```

KNA profiling reads 3,423 ERP rows across 160 source fields. The current reference-based proposal evaluates all 45 IVO Equipment fields without using the optional IVO export. The comparison output is retained separately to validate proposal quality against the existing integration.

## Reference Maintenance

Reference loading is independent of customer mapping. Preserve IVO's original schema and optional sample first:

```powershell
$object = "equipment"
node tools/build-ivo-reference.js `
  --source "reference-sources/ivo/$object" `
  --object $object `
  --out "reference/ivo/$object"
```

The builder profiles `sample.csv` when supplied and creates the remaining contract files. It refuses to replace an existing reference without `--force yes`. Generated observations remain provisional until IVO confirms them. Follow [docs/loading-ivo-references.md](docs/loading-ivo-references.md) before replacing a curated contract.

## Current Status

| Capability | Status |
| --- | --- |
| ERP CSV profiling | Built and tested |
| Reference-based mapping proposal without IVO data | Built and tested on KNA Equipment |
| Existing integration comparison | Built and tested; optional |
| IVO Equipment reference bootstrap | Generated; business semantics need IVO confirmation |
| Approved mapping workflow | Built in the local Mapping Workbench |
| Integration definitions per ERP connector | Built in the local Mapping Workbench |
| Discovery log and flow version history | Built in the local Mapping Workbench |
| Pre-deployment validation and transform generation | Not built |

See [docs/plan.md](docs/plan.md) for next steps.

## Data Safety

Customer CSV exports may contain sensitive data. `customers/` is excluded from source control. Mask data before sharing it outside the approved environment. Reference files must contain contracts and synthetic examples, never customer records.
