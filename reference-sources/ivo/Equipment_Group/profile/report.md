# Profile — IVO Equipment_Group reference sample

- Source: `reference-sources\ivo\Equipment_Group\equipment group.csv`
- Schema: `reference-sources\ivo\Equipment_Group\equipment_group.json`
- Rows: 267
- Columns: 11
- **Rows quarantined**: 4 (field count never reached the header count — excluded from all statistics below)
- Generated: 2026-08-19T12:59:32.961Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 11 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 4 | 36.4% |
| **Carrying information** | **7** | **63.6%** |

## Schema reconciliation

- Columns declared in schema: 11
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`equipmentGroupShortName`** — [REQUIRED_BUT_EMPTY] Schema marks this required, but 0.4% of rows are empty.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`equipmentGroupColor`** — [PLACEHOLDER_NULL] 267 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`equipmentGroupShortName`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`equipmentGroupLongName`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`equipmentGroupDescription`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.

## Candidate keys

- `equipmentGroupId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentGroupId` | 100.0% | 267 | integer | 4–4 | `4285` 0.4% |
| `equipmentGroupShortName` | 99.6% | 266 | string | 9–36 | `Compactor CS56 84" SD - 273` 0.4% |
| `equipmentGroupLongName` | 99.6% | 235 | string | 4–30 | `OPEN` 11.7% |
| `equipmentGroupDescription` | 99.6% | 235 | string | 4–30 | `OPEN` 11.7% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `equipmentClassId` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdTimestampUtc` | 100.0% | 58 | date | 19–19 | `2026-07-15 20:18:14` 3.7% |
| `createdByUserId` | 100.0% | 2 | integer | 1–2 | `45` 99.6% |
| `equipmentGroupColor` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 267 | uuid | 36–36 | `b9f24b1c-d28f-4933-924c-64e8e3` 0.4% |
