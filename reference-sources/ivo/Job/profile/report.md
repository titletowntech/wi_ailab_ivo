# Profile — IVO Job reference sample

- Source: `reference-sources\ivo\Job\jobs.csv`
- Schema: `reference-sources\ivo\Job\job.json`
- Rows: 169
- Columns: 20
- Generated: 2026-08-19T12:59:35.649Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 20 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 11 | 55.0% |
| **Carrying information** | **9** | **45.0%** |

## Schema reconciliation

- Columns declared in schema: 20
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`jobTypeId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`organizations`** — [TYPE_MISMATCH] Schema declares array; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`jobNumber`** — [MIXED_FORMAT] Mixed observed formats: integer 98.8%, string 1.2%.
- **`divisionDisplayName`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobTypeId`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobTypeDisplayName`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobDisplayNameWithJobNumber`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobDisplayName`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`emergencyHospitalName`** — [PLACEHOLDER_NULL] 2 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`emergencyHospitalName`** — [SPARSE] Only 1.2% populated (2 of 169 rows) — destination default/null handling required.
- **`emergencyHospitalAddress`** — [PLACEHOLDER_NULL] 2 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`emergencyHospitalAddress`** — [SPARSE] Only 1.2% populated (2 of 169 rows) — destination default/null handling required.
- **`emergencyHospitalPhone`** — [PLACEHOLDER_NULL] 2 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`emergencyHospitalPhone`** — [SPARSE] Only 1.2% populated (2 of 169 rows) — destination default/null handling required.
- **`accountingCode`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`estimatingCode`** — [PLACEHOLDER_NULL] 169 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`jobNumber`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.
- **`jobLongName`** — [WHITESPACE_NULL] 5 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.

## Candidate keys

- `jobId` (integer)
- `jobNumber` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `jobId` | 100.0% | 169 | integer | 5–5 | `24976` 0.6% |
| `jobNumber` | 100.0% | 169 | integer | 3–6 | `482304` 0.6% |
| `jobShortName` | 100.0% | 167 | string | 3–57 | `E-470 MM 1 Sign Bridge Replace` 1.2% |
| `jobLongName` | 95.9% | 157 | string | 5–59 | `Harry S Truman Parkway` 2.5% |
| `jobDescription` | 98.8% | 165 | string | 10–60 | `E-470 MM 1 Sign Bridge Replace` 1.2% |
| `jobColor` | 100.0% | 7 | string | 4–9 | `#000000` 34.3% |
| `divisionId` | 100.0% | 6 | integer | 3–3 | `634` 33.7% |
| `divisionDisplayName` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobTypeId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobTypeDisplayName` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobDisplayNameWithJobNumber` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobDisplayName` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 56.2% |
| `emergencyHospitalName` | 1.2% | 1 | string | 4–4 | `NULL` 100.0% |
| `emergencyHospitalAddress` | 1.2% | 1 | string | 4–4 | `NULL` 100.0% |
| `emergencyHospitalPhone` | 1.2% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 169 | uuid | 36–36 | `bc5a105f-b1fb-49fa-acbe-d6f262` 0.6% |
| `accountingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `estimatingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `organizations` | 100.0% | 1 | string | 2–2 | `[]` 100.0% |
