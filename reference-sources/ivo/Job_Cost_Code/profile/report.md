# Profile — IVO Job_Cost_Code reference sample

- Source: `reference-sources\ivo\Job_Cost_Code\job cost codes.csv`
- Schema: `reference-sources\ivo\Job_Cost_Code\job_cost_code.json`
- Rows: 773
- Columns: 14
- Generated: 2026-08-19T12:59:35.978Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 14 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 4 | 28.6% |
| **Carrying information** | **10** | **71.4%** |

## Schema reconciliation

- Columns declared in schema: 14
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`quantity`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`costCodeTemplateId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`costCode`** — [MIXED_FORMAT] Mixed observed formats: decimal 93.5%, integer 6.5%.
- **`quantity`** — [PLACEHOLDER_NULL] 772 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`note`** — [PLACEHOLDER_NULL] 758 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`createdTimestampUtc`** — [PLACEHOLDER_NULL] 723 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`createdTimestampUtc`** — [MIXED_FORMAT] Mixed observed formats: string 93.5%, date 6.5%.
- **`accountingCode`** — [MIXED_FORMAT] Mixed observed formats: decimal 93.5%, integer 6.5%.
- **`estimatingCode`** — [PLACEHOLDER_NULL] 773 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`costCodeTemplateId`** — [PLACEHOLDER_NULL] 773 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`costCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.
- **`quantityUnitType`** — [WHITESPACE_NULL] 122 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`accountingCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `costCodeId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `costCodeId` | 100.0% | 773 | integer | 5–5 | `73930` 0.1% |
| `costCode` | 100.0% | 56 | decimal | 4–8 | `00.10805` 19.9% |
| `description` | 100.0% | 63 | string | 8–30 | `Mechanic` 19.9% |
| `jobId` | 100.0% | 157 | integer | 5–5 | `25142` 6.5% |
| `quantity` | 100.0% | 2 | string | 4–4 | `NULL` 99.9% |
| `quantityUnitType` | 84.2% | 7 | string | 2–2 | `EA` 88.6% |
| `note` | 100.0% | 16 | string | 4–98 | `NULL` 98.1% |
| `createdTimestampUtc` | 100.0% | 12 | string | 4–19 | `NULL` 93.5% |
| `isActive` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `accountingCode` | 100.0% | 56 | decimal | 4–8 | `00.10805` 19.9% |
| `estimatingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `costCodeTemplateId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 773 | uuid | 36–36 | `da0da1a8-ed0d-4148-a69e-f76b7c` 0.1% |
