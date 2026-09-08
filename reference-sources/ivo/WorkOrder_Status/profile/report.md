# Profile — IVO WorkOrder_Status reference sample

- Source: `reference-sources\ivo\WorkOrder_Status\equipment work order status change.csv`
- Schema: `reference-sources\ivo\WorkOrder_Status\workorder_status.json`
- Rows: 1947
- Columns: 7
- Generated: 2026-08-19T12:59:39.517Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 7 | 100% |
| Never populated | 1 | 14.3% |
| Constant (one value) | 0 | 0.0% |
| **Carrying information** | **6** | **85.7%** |

## Schema reconciliation

- Columns declared in schema: 7
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Candidate keys

- `statusChangeId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `statusChangeId` | 100.0% | 1947 | integer | 5–5 | `91050` 0.1% |
| `workOrderId` | 100.0% | 974 | integer | 5–5 | `96903` 0.3% |
| `workOrderStatus` | 100.0% | 4 | integer | 1–1 | `3` 48.9% |
| `changeNote` | 0.0% | 0 | — | 0–0 | — |
| `createdByUserId` | 100.0% | 15 | integer | 4–5 | `9236` 89.2% |
| `createdTimestampUtc` | 100.0% | 1944 | date | 19–19 | `2026-08-06 21:23:50` 0.1% |
| `uuid` | 100.0% | 1947 | uuid | 36–36 | `a535b573-c7f7-4b36-94ba-bcc7e5` 0.1% |
