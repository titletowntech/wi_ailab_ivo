# Profile — IVO Company_Equipment_Specification reference sample

- Source: `reference-sources\ivo\Company_Equipment_Specification\company equipment specification.csv`
- Schema: `reference-sources\ivo\Company_Equipment_Specification\company_equipment_specification.json`
- Rows: 29
- Columns: 9
- Generated: 2026-08-19T12:59:31.132Z

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

- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`specificationDescription`** — [PLACEHOLDER_NULL] 29 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `companyEquipmentSpecificationId` (integer)
- `specificationName` (string)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `companyEquipmentSpecificationId` | 100.0% | 29 | integer | 3–3 | `498` 3.4% |
| `specificationName` | 100.0% | 29 | string | 5–23 | `Crane Expiration` 3.4% |
| `specificationDescription` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isActive` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdTimestampUtc` | 100.0% | 14 | date | 19–19 | `2026-07-24 17:00:18` 10.3% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `createdByUserId` | 100.0% | 1 | integer | 2–2 | `45` 100.0% |
| `uuid` | 100.0% | 29 | uuid | 36–36 | `1a654e1d-2cb4-4204-9235-6f7208` 3.4% |
