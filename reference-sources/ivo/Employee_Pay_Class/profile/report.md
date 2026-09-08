# Profile — IVO Employee_Pay_Class reference sample

- Source: `reference-sources\ivo\Employee_Pay_Class\job labor codes.csv`
- Schema: `reference-sources\ivo\Employee_Pay_Class\labor_code.json`
- Rows: 761
- Columns: 13
- Generated: 2026-08-19T12:59:32.267Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 13 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 7 | 53.8% |
| **Carrying information** | **6** | **46.2%** |

## Schema reconciliation

- Columns declared in schema: 13
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`jobId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`description`** — [REQUIRED_BUT_EMPTY] Schema marks this required, but 0.5% of rows are empty.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`jobRegularChargeRatePerHour`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`jobOvertimeChargeRatePerHour`** — [TYPE_MISMATCH] Schema declares number; data looks like string.
- **`jobDoubleTimeChargeRatePerHour`** — [TYPE_MISMATCH] Schema declares number; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`jobId`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`createdTimestampUtc`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`note`** — [PLACEHOLDER_NULL] 757 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`estimatingCode`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobRegularChargeRatePerHour`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobOvertimeChargeRatePerHour`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobDoubleTimeChargeRatePerHour`** — [PLACEHOLDER_NULL] 761 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `laborCodeId` (integer)
- `laborCode` (string)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `laborCodeId` | 100.0% | 761 | integer | 4–4 | `1237` 0.1% |
| `jobId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `createdTimestampUtc` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `laborCode` | 100.0% | 761 | string | 6–13 | `001.CR` 0.1% |
| `description` | 99.5% | 404 | string | 7–30 | `Laborer Special Rate` 5.2% |
| `note` | 100.0% | 5 | string | 4–5 | `NULL` 99.5% |
| `accountingCode` | 100.0% | 125 | string | 2–6 | `FM` 4.7% |
| `estimatingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isActive` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `jobRegularChargeRatePerHour` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobOvertimeChargeRatePerHour` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobDoubleTimeChargeRatePerHour` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 761 | uuid | 36–36 | `1a8e542d-4ce7-42a9-a4b5-359fa2` 0.1% |
