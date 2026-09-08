# Profile — IVO Job_Item_Code reference sample

- Source: `reference-sources\ivo\Job_Item_Code\job item codes.csv`
- Schema: `reference-sources\ivo\Job_Item_Code\job_item_code.json`
- Rows: 172
- Columns: 12
- Generated: 2026-08-19T12:59:36.381Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 4 | 33.3% |
| **Carrying information** | **8** | **66.7%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`quantity`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`createdTimestampUtc`** — [PLACEHOLDER_NULL] 172 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`itemCode`** — [MIXED_FORMAT] Mixed observed formats: integer 95.3%, string 4.1%, phone 0.6%.
- **`quantity`** — [PLACEHOLDER_NULL] 110 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`quantity`** — [MIXED_FORMAT] Mixed observed formats: string 64.0%, integer 36.0%.
- **`note`** — [PLACEHOLDER_NULL] 172 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`accountingCode`** — [MIXED_FORMAT] Mixed observed formats: integer 95.3%, string 4.1%, phone 0.6%.
- **`estimatingCode`** — [PLACEHOLDER_NULL] 172 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`itemCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.
- **`accountingCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `itemCodeId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `itemCodeId` | 100.0% | 172 | integer | 5–5 | `20490` 0.6% |
| `jobId` | 100.0% | 156 | integer | 5–5 | `25006` 1.2% |
| `createdTimestampUtc` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `itemCode` | 100.0% | 14 | integer | 1–15 | `9999000` 82.6% |
| `quantity` | 100.0% | 3 | string | 1–4 | `NULL` 64.0% |
| `unitOfMeasure` | 100.0% | 2 | string | 2–2 | `LS` 82.0% |
| `description` | 100.0% | 20 | string | 4–31 | `Indirect Items` 82.6% |
| `note` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `accountingCode` | 100.0% | 14 | integer | 1–15 | `9999000` 82.6% |
| `estimatingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isActive` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `uuid` | 100.0% | 172 | uuid | 36–36 | `49785eed-31b8-4608-9ad4-20e462` 0.6% |
