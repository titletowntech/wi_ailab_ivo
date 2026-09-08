# Profile — IVO Company_Equipment_Status reference sample

- Source: `reference-sources\ivo\Company_Equipment_Status\company equipment status.csv`
- Schema: `reference-sources\ivo\Company_Equipment_Status\company_equipment_status.json`
- Rows: 5
- Columns: 9
- Generated: 2026-08-19T12:59:31.443Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 9 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 5 | 55.6% |
| **Carrying information** | **4** | **44.4%** |

## Schema reconciliation

- Columns declared in schema: 9
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`statusName`** — [PLACEHOLDER_NULL] 1 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `companyEquipmentStatusId` (integer)
- `statusName` (string)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `companyEquipmentStatusId` | 100.0% | 5 | integer | 4–4 | `1308` 20.0% |
| `statusName` | 100.0% | 5 | string | 4–9 | `Available` 20.0% |
| `statusColor` | 80.0% | 4 | string | 7–7 | `#50C878` 25.0% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdTimestampUtc` | 100.0% | 1 | date | 19–19 | `2026-04-21 13:22:36` 100.0% |
| `createdByUserId` | 100.0% | 1 | integer | 2–2 | `45` 100.0% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `icon` | 100.0% | 1 | string | 25–25 | `fas fa-exclamation-circle` 100.0% |
| `uuid` | 100.0% | 5 | uuid | 36–36 | `55c91307-3dc0-4d44-bba5-b2e10f` 20.0% |
