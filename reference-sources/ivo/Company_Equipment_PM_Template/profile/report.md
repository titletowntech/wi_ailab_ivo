# Profile — IVO Company_Equipment_PM_Template reference sample

- Source: `reference-sources\ivo\Company_Equipment_PM_Template\company equipment pm template.csv`
- Schema: `reference-sources\ivo\Company_Equipment_PM_Template\company_equipment_pm_template.json`
- Rows: 217
- Columns: 20
- Generated: 2026-08-19T12:59:30.828Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 20 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 4 | 20.0% |
| **Carrying information** | **16** | **80.0%** |

## Schema reconciliation

- Columns declared in schema: 20
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`intervalDays`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`intervalOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`fixedHours`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`fixedOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`triggerDays`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`triggerOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`applyChangesToChildren`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`intervalHours`** — [PLACEHOLDER_NULL] 44 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalHours`** — [MIXED_FORMAT] Mixed observed formats: integer 79.7%, string 20.3%.
- **`intervalDays`** — [PLACEHOLDER_NULL] 201 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalDays`** — [MIXED_FORMAT] Mixed observed formats: string 92.6%, integer 7.4%.
- **`intervalOdometer`** — [PLACEHOLDER_NULL] 195 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalOdometer`** — [MIXED_FORMAT] Mixed observed formats: string 89.9%, integer 10.1%.
- **`fixedDate`** — [PLACEHOLDER_NULL] 217 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`fixedHours`** — [PLACEHOLDER_NULL] 206 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`fixedHours`** — [MIXED_FORMAT] Mixed observed formats: string 94.9%, integer 5.1%.
- **`fixedOdometer`** — [PLACEHOLDER_NULL] 217 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerDays`** — [PLACEHOLDER_NULL] 201 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerDays`** — [MIXED_FORMAT] Mixed observed formats: string 92.6%, integer 7.4%.
- **`triggerHours`** — [PLACEHOLDER_NULL] 35 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerHours`** — [MIXED_FORMAT] Mixed observed formats: integer 83.9%, string 16.1%.
- **`triggerOdometer`** — [PLACEHOLDER_NULL] 195 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerOdometer`** — [MIXED_FORMAT] Mixed observed formats: string 89.9%, integer 10.1%.

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`partsNote`** — [PADDED] 162 value(s) carry leading/trailing whitespace — needs .trim().
- **`partsNote`** — [WHITESPACE_NULL] 1 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`workNote`** — [PADDED] 110 value(s) carry leading/trailing whitespace — needs .trim().

## Candidate keys

- `companyEquipmentPmTemplateId` (integer)
- `pmName` (string)
- `createdTimestampUtc` (date)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `companyEquipmentPmTemplateId` | 100.0% | 217 | integer | 4–4 | `2566` 0.5% |
| `pmTypeId` | 100.0% | 4 | integer | 1–1 | `1` 78.3% |
| `pmName` | 100.0% | 217 | string | 6–60 | `1 YEAR SERVICE (BEAM LAUNCHER)` 0.5% |
| `intervalHours` | 100.0% | 10 | integer | 3–5 | `500` 28.6% |
| `intervalDays` | 100.0% | 5 | string | 1–4 | `NULL` 92.6% |
| `intervalOdometer` | 100.0% | 9 | string | 3–5 | `NULL` 89.9% |
| `fixedDate` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `fixedHours` | 100.0% | 9 | string | 2–4 | `NULL` 94.9% |
| `fixedOdometer` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `partsNote` | 93.1% | 3 | string | 33–59 | `SEE EQUIPMENT DETAILS - PARTS ` 98.5% |
| `workNote` | 99.1% | 132 | string | 24–1394 | `COMPLETE ALL 500 HR ITEMS
MAI` 3.3% |
| `triggerDays` | 100.0% | 5 | string | 1–4 | `NULL` 92.6% |
| `triggerHours` | 100.0% | 8 | integer | 1–4 | `40` 76.0% |
| `triggerOdometer` | 100.0% | 4 | string | 2–4 | `NULL` 89.9% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 99.1% |
| `createdTimestampUtc` | 100.0% | 217 | date | 19–19 | `2026-07-22 01:54:54` 0.5% |
| `createdByUserId` | 100.0% | 2 | integer | 4–5 | `1288` 92.2% |
| `applyChangesToChildren` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `uuid` | 100.0% | 217 | uuid | 36–36 | `73d975b0-cc74-4a74-8b9b-5da529` 0.5% |
