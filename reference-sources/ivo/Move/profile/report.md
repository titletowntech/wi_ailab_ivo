# Profile — IVO Move reference sample

- Source: `reference-sources\ivo\Move\equipment moves.csv`
- Schema: `reference-sources\ivo\Move\equipment_move.json`
- Rows: 253
- Columns: 10
- Generated: 2026-08-19T12:59:38.151Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 10 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 2 | 20.0% |
| **Carrying information** | **8** | **80.0%** |

## Schema reconciliation

- Columns declared in schema: 10
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`scheduledMoveId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`scheduledMoveId`** — [PLACEHOLDER_NULL] 253 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `equipmentMoveId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentMoveId` | 100.0% | 253 | integer | 6–6 | `419038` 0.4% |
| `equipmentId` | 100.0% | 125 | integer | 5–5 | `52083` 5.5% |
| `createdByUserId` | 100.0% | 3 | integer | 2–5 | `45` 98.4% |
| `createdTimestampUtc` | 100.0% | 251 | date | 19–19 | `2026-08-07 15:29:54` 0.8% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `fromLocationId` | 100.0% | 35 | integer | 5–5 | `24981` 12.3% |
| `toLocationId` | 100.0% | 27 | integer | 5–5 | `24981` 22.9% |
| `moveNote` | 99.6% | 8 | string | 4–26 | `Samsara Vehicle Location` 37.7% |
| `scheduledMoveId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 253 | uuid | 36–36 | `03badca8-8e3d-49df-b7de-ec4c2f` 0.4% |
