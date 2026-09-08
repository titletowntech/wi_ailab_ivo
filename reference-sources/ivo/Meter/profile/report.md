# Profile — IVO Meter reference sample

- Source: `reference-sources\ivo\Meter\equipment meters.csv`
- Schema: `reference-sources\ivo\Meter\meter.json`
- Rows: 20203
- Columns: 12
- Generated: 2026-08-19T12:59:37.901Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 1 | 8.3% |
| **Carrying information** | **11** | **91.7%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`source`** — [PLACEHOLDER_NULL] 10 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`note`** — [SPARSE] Only 1.2% populated (233 of 20203 rows) — destination default/null handling required.
- **`equipmentCode`** — [MIXED_FORMAT] Mixed observed formats: integer 90.9%, string 9.1%.

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`note`** — [PADDED] 2 value(s) carry leading/trailing whitespace — needs .trim().
- **`equipmentCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `uuid` (uuid)
- `meterId` (integer)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentId` | 100.0% | 547 | integer | 5–5 | `52195` 1.8% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `uuid` | 100.0% | 20203 | uuid | 36–36 | `561f44e8-0905-4cca-a364-98c0d1` 0.0% |
| `meterId` | 100.0% | 20203 | integer | 7–8 | `9958396` 0.0% |
| `totalMeter` | 100.0% | 13349 | decimal | 4–9 | `1539.00` 0.5% |
| `timestamp` | 100.0% | 17871 | date | 19–19 | `2026-08-15 12:00:00` 0.6% |
| `createdTimestampUtc` | 100.0% | 9571 | date | 19–19 | `2026-08-17 15:08:33` 0.0% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 100.0% |
| `source` | 100.0% | 11 | string | 4–30 | `Samsara Odometer Stats API` 56.2% |
| `note` | 1.2% | 17 | string | 4–53 | `Initialized from last telemati` 65.2% |
| `meterType` | 100.0% | 2 | string | 4–8 | `ODOMETER` 57.3% |
| `equipmentCode` | 100.0% | 547 | integer | 6–8 | `568800` 1.8% |
