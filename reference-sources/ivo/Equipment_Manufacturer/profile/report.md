# Profile — IVO Equipment_Manufacturer reference sample

- Source: `reference-sources\ivo\Equipment_Manufacturer\equipment manufacturer.csv`
- Schema: `reference-sources\ivo\Equipment_Manufacturer\equipment_manufacturer.json`
- Rows: 153
- Columns: 9
- Generated: 2026-08-19T12:59:33.296Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 9 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 2 | 22.2% |
| **Carrying information** | **7** | **77.8%** |

## Schema reconciliation

- Columns declared in schema: 9
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`manufacturerShortName`** — [REQUIRED_BUT_EMPTY] Schema marks this required, but 0.7% of rows are empty.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`manufacturerDescription`** — [SPARSE] Only 10.5% populated (16 of 153 rows) — destination default/null handling required.

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`manufacturerShortName`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`manufacturerLongName`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.

## Candidate keys

- `equipmentManufacturerId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentManufacturerId` | 100.0% | 153 | integer | 5–5 | `10286` 0.7% |
| `manufacturerShortName` | 99.3% | 152 | string | 2–20 | `LIXER` 0.7% |
| `manufacturerLongName` | 99.3% | 152 | string | 2–20 | `LIXER` 0.7% |
| `manufacturerDescription` | 10.5% | 16 | string | 3–19 | `Honda V-Twin` 6.3% |
| `createdTimestampUtc` | 100.0% | 38 | date | 19–19 | `2026-07-15 21:33:45` 5.2% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `createdByUserId` | 100.0% | 2 | integer | 1–2 | `0` 89.5% |
| `uuid` | 100.0% | 153 | uuid | 36–36 | `43fc1af8-5fea-467e-b7cc-5bb50a` 0.7% |
