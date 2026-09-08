# IVO Reference Contract

The IVO reference is the reusable destination contract for every customer onboarding. Maintain one folder per IVO object:

```text
reference/ivo/
  <object>/
    schema.json
    field-catalog.csv
    validation-rules.json
```

Customer folders contain ERP-specific inputs. They must not contain independent edited copies of the IVO contract.

## Authority and confidence

Facts in this reference have three possible sources:

1. **IVO-defined:** supplied by IVO code, API, database metadata, or connector schema. These can become authoritative.
2. **Observed:** inferred from an existing integration such as KNA. These are evidence, not universal rules.
3. **Confirm:** unknown or supported by insufficient evidence. These must not become blocking rules or automatic defaults until IVO confirms them.

Never promote an observed constant, empty field, lookup behavior, or generated field to a universal rule based on one customer alone.

## `schema.json`

JSON Schema for the IVO object. This is the machine-readable structural source of truth.

Required content:

- every accepted field name;
- JSON type and nullability;
- required fields;
- `maxLength`, `pattern`, `format`, and `enum` where enforced;
- `readOnly` or `writeOnly` behavior where applicable;
- descriptions for every field;
- nested object and array definitions where applicable.

Rules:

- Export it from the IVO-owned connector or generate it from IVO source metadata.
- Do not add customer-specific behavior.
- Update it whenever the IVO API or connector contract changes.
- Record generated fields as `readOnly: true` when confirmed by IVO.
- A missing constraint means unknown, not unlimited.

Current Equipment status: 45 fields are declared. Only `uuid` has a meaningful supplied description; the remaining business descriptions need IVO input.

## `field-catalog.csv`

Human-maintained business semantics layered over the structural schema.

| Column | Allowed content |
| --- | --- |
| `field` | Exact field path from `schema.json`; unique and case-sensitive |
| `type` | Declared non-null JSON type(s), separated by `|` |
| `nullable` | `yes` or `no` |
| `required` | `yes` or `no` |
| `write_only` | `yes` or `no` |
| `format` | Enforced format such as `uuid` or blank |
| `max_length` | Enforced maximum length or blank when unknown |
| `description` | IVO-owned business meaning, not a customer observation |
| `ownership` | `ivo`, `integration`, `customer`, or `confirm` |
| `mapping_behavior` | `direct`, `lookup`, `generated`, `default`, `computed`, `ignored`, or `unknown` |
| `reference_object` | IVO object referenced by an ID field; blank when not applicable or unknown |
| `default_value` | Confirmed universal IVO/integration default only |
| `observed_fill_pct` | Diagnostic evidence from the current baseline dataset |
| `observed_distinct` | Diagnostic distinct count from the current baseline dataset |
| `observed_classification` | `direct`, `lookup`, `identifier`, `constant`, `empty`, `unexplained`, or blank |
| `status` | `usable` when required semantics are confirmed; otherwise `confirm` |
| `notes` | Provenance, uncertainty, or operational guidance |

Rules:

- One row per schema field; no extra fields.
- Structural columns must match `schema.json` and should be regenerated, not manually changed.
- `default_value` must remain blank for a value observed as constant in only one customer.
- `ownership=ivo` means integrations must not assign the field unless IVO explicitly allows it.
- `ownership=integration` means onboarding must map, default, look up, or compute the value.
- `status=confirm` prevents high-confidence automation based on that row.
- Observed columns may be refreshed from a designated baseline but never override IVO-defined semantics.

## `validation-rules.json`

Machine-readable rules applied to a proposed or approved mapping before deployment.

Required sections:

- `version` and `object`;
- `sourceOfTruth` pointing to `schema.json`;
- `blockingRules` for required coverage, prohibited inputs, types, nullability, formats, lengths, and lookups;
- `warnings` for nonblocking review items;
- `unresolved` for rules that cannot yet be enforced.

Rules:

- Blocking rules must come from IVO-defined facts, not a single customer observation.
- Generated/read-only fields belong in `prohibitInputFields` only after confirmation or strong evidence with explicit review.
- Required generated fields are excluded from `requireMappedOrDefaulted`.
- Increment `version` when rule meaning or structure changes.

## Updating the reference

Keep the IVO-supplied schema and optional sample under `reference-sources/ivo/<object>/`, separate from this published contract. Use the builder to regenerate structural and observed portions:

```powershell
node tools/build-ivo-reference.js `
  --source reference-sources/ivo/<object> `
  --object <object> `
  --out reference/ivo/<object>
```

When `sample.csv` is present, the builder writes its generated profile under the source folder and uses that evidence to populate observed columns. The builder is a bootstrap and refresh aid. It deliberately marks uncertain fields `confirm` and refuses to replace existing managed files unless `--force yes` is supplied. Before replacing a curated reference:

1. Review the diff.
2. Preserve IVO-confirmed descriptions and rules.
3. Verify schema field additions, removals, and breaking type changes.
4. Increment rule versions when semantics change.
5. Run mapping regression tests against existing approved customer mappings.

See [../../docs/loading-ivo-references.md](../../docs/loading-ivo-references.md) for the publication runbook. Customer onboarding follows [../../docs/running-customer-mapping.md](../../docs/running-customer-mapping.md) and must not update this folder.

## Information still needed from IVO

For Equipment, IVO should provide:

- business descriptions and examples for all fields;
- confirmed field ownership and read-only/generated behavior;
- universal defaults, if any;
- business uniqueness rules;
- company and organization scoping behavior;
- reference object, key, endpoint, and missing-value behavior for every ID lookup;
- enum and range restrictions not present in the JSON Schema;
- relationship and object load order requirements;
- an API, sandbox endpoint, or local validator for payload validation.
