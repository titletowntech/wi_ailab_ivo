# Profile — IVO Job_Link_Code reference sample

- Source: `reference-sources\ivo\Job_Link_Code\job cost code assignments.csv`
- Schema: `reference-sources\ivo\Job_Link_Code\job_cost_code_assignment.json`
- Rows: 722
- Columns: 11
- Generated: 2026-08-19T12:59:36.673Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 11 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 5 | 45.5% |
| **Carrying information** | **6** | **54.5%** |

## Schema reconciliation

- Columns declared in schema: 11
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`equipmentCostBudgetTotal`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`laborCostBudgetTotal`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`laborHoursBudgetTotal`** — [TYPE_MISMATCH] Schema declares number; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`createdTimestampUtc`** — [PLACEHOLDER_NULL] 722 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`equipmentCostBudgetTotal`** — [PLACEHOLDER_NULL] 722 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`laborCostBudgetTotal`** — [PLACEHOLDER_NULL] 722 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`laborHoursBudgetTotal`** — [PLACEHOLDER_NULL] 722 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `costCodeAssignmentId` (integer)
- `costCodeId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `costCodeAssignmentId` | 100.0% | 722 | integer | 5–5 | `72090` 0.1% |
| `itemCodeId` | 100.0% | 167 | integer | 5–5 | `20488` 0.7% |
| `costCodeId` | 100.0% | 722 | integer | 5–5 | `73940` 0.1% |
| `jobId` | 100.0% | 156 | integer | 5–5 | `24987` 0.8% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdTimestampUtc` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `quantity` | 100.0% | 19 | decimal | 4–8 | `0.00` 88.0% |
| `equipmentCostBudgetTotal` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `laborCostBudgetTotal` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `laborHoursBudgetTotal` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 722 | uuid | 36–36 | `39319a42-0ce1-4042-9287-cff612` 0.1% |
