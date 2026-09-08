# Mapping Suggestions — Reset behavior test

- ERP profile: `customers\KNA\equipment\output\erp-profile\fields.csv`
- IVO profile: `IVO reference schema only`
- Comparison: _not supplied_
- Generated: 2026-08-14T19:15:58.894Z

## Summary

| Status | Fields |
| --- | ---: |
| Recovered from comparison | 0 |
| Classified from IVO reference | 0 |
| Classified from profile | 0 |
| New suggestions | 7 |
| Questions | 38 |

## New Suggestions

| Destination | Source | Confidence | Score | Rationale |
| --- | --- | --- | ---: | --- |
| `equipmentYear` | `ModelYr` | medium | 67% | name overlap 67%; string conversion may be required |
| `equipmentManufacturerId` | `Manufacturer` | high | 90% | name overlap 100%; string conversion may be required; destination identifier likely requires a lookup |
| `equipmentModel` | `Model` | high | 100% | name overlap 100%; declared types match |
| `equipmentDescription` | `Description` | high | 100% | name overlap 100%; declared types match |
| `vinNumber` | `VINNumber` | high | 100% | normalized names match; declared types match |
| `plateNumber` | `LicensePlateNo` | high | 86% | name overlap 80%; declared types match |
| `licenseNumber` | `LicensePlateNo` | high | 86% | name overlap 80%; declared types match |

Review `suggestions.csv`; generated evidence is not an approved mapping.
