# Implementation Plan

This plan contains only current status and remaining work, ordered by dependency.

## Current Status

| Capability | Status | Output |
| --- | --- | --- |
| Profile customer ERP data | Complete | `fields.csv`, `report.md`, `questions.md` |
| Propose mappings from ERP data and shared IVO schema | Complete | `suggestions.csv`, `report.md`, `questions.md` |
| Compare paired ERP and IVO exports | Complete; optional | `output/comparison/mapping.csv`, `lookups.csv` |
| Bootstrap IVO Equipment reference | Complete; provisional | five files under `reference/ivo/equipment/` |
| Approve a canonical customer mapping | Complete in the local workbench | `output/approved-mapping/mapping.csv` |
| Validate before deployment | Not started | Planned `results.csv`, `report.md` |
| Generate App Xchange transforms | Not started | Format to be defined |

## Next Steps

### 1. Complete the IVO Equipment Contract

IVO must review `reference/ivo/equipment/` and provide:

- business descriptions and examples for all 45 fields;
- ownership for each field: IVO, integration, or customer;
- generated/read-only/write behavior;
- universal defaults and uniqueness rules;
- organization and company scoping behavior;
- enum, range, and format constraints missing from the schema;
- reference object, key, resolver, scope, and missing-value behavior for lookup IDs;
- relationship and load-order requirements.

Update `field-catalog.csv`, `lookup-rules.csv`, `validation-rules.json`, and `example-payload.json`. Change `status` to `usable` only when enough information exists for automation.

Complete when every required or integration-owned Equipment field is `usable` and all required lookups are resolvable.

### 2. Extend Approved Mapping Management

The local workbench initializes `output/approved-mapping/mapping.csv` from the proposal when the first review is saved and preserves subsequent decisions. Extend it with:

- source and destination fields;
- mapping kind and transform;
- lookup reference;
- constant or default source;
- confidence and review decision;
- reviewer notes and unresolved status.

Add explicit revision history and a bulk initialization command without overwriting human edits.

Complete when revisions can be compared and every destination-field decision can be exported as one versioned approval set.

### 3. Validate Across ERP Variants

- Collect a second KNA object.
- Collect Equipment inputs from at least one additional ERP/customer.
- Run profiling and reference-based proposal generation without IVO data.
- Score proposals against completed mappings or withheld existing-integration evidence.
- Track confident errors, missed mappings, custom-field questions, and unsupported ERP formats.

Complete when the process works across at least two objects and two customers with zero confident incorrect proposals.

### 4. Build `mapping-validator`

Validate the approved mapping and representative ERP rows against the shared IVO contract:

- required destination coverage;
- source field existence;
- prohibited generated/read-only assignments;
- type, nullability, length, pattern, enum, and format rules;
- lookup resolvability and missing-value behavior;
- duplicate/conflicting destination assignments;
- transformed payload shape.

Write `results.csv` and `report.md` to `output/validation/` and return a nonzero exit code for blocking failures.

Complete when an onboarding mapping can be checked locally without existing IVO records.

### 5. Generate and Test Transforms

- Define a supported transform vocabulary.
- Generate App Xchange-compatible JavaScript from approved mappings.
- Run transforms locally against representative ERP rows.
- Validate generated payloads with the reference contract.
- Where optional IVO evidence exists, compare post-deployment values.

Complete when IVO can test mapping behavior locally before configuring the production flow.

### 6. Add Prior-Mapping Reuse

Store approved mappings by ERP product, version, and object. Use compatible prior mappings as a proposal signal while keeping customer decisions isolated.

Complete when the tool can show how the same ERP field was approved previously, with provenance and compatibility checks.

## Operating Requirements

- Keep tools dependency-light and runnable with Node.js on a developer laptop.
- Treat the IVO reference as the reusable destination source of truth.
- Keep original IVO reference inputs under `reference-sources/` and publish references independently of customer mapping runs.
- Treat a published IVO reference as static until IVO supplies a reviewed contract change.
- Preserve machine-readable artifacts between stages; never scrape Markdown reports.
- Never overwrite approved mappings or customer answers.
- Never turn one customer's observed constant or empty field into a universal IVO rule.
- Report evidence and uncertainty with every inferred mapping.
- Keep customer data out of source control and reference files free of customer records.
