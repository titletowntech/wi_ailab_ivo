# Collecting Customer Inputs

Normal onboarding requires two customer-specific files for each business object:

```text
customers/<customer>/<object>/input/erp/
  data.csv
  schema.json
```

The destination contract comes from `reference/ivo/<object>/`; do not collect or copy it per customer.

This document covers customer mapping inputs only. IVO-owned source files used to publish the destination reference follow [loading-ivo-references.md](loading-ivo-references.md).

## 1. ERP Connector Schema

Export the complete schema from the customer ERP connector. Preserve at least:

- exact API field name;
- type and nullability;
- required status;
- description;
- maximum length, format, pattern, and enum;
- object relationships.

Prefer raw JSON from the connector, API, SDK, or browser network response. Display-label tables are a last resort because names may not match CSV headers.

Save it as:

```text
customers/<customer>/<object>/input/erp/schema.json
```

## 2. ERP Data Export

Export a representative full table from the ERP cache using a reusable on-demand export flow.

Save it as:

```text
customers/<customer>/<object>/input/erp/data.csv
```

Rules:

- Export the full table, not a UI page.
- Preserve API field names as headers.
- Preserve leading zeros and surrounding whitespace.
- Preserve raw date strings.
- Preserve the distinction between null, empty, and whitespace-only values where the exporter allows it.
- Do not open and resave the file in Excel before profiling.
- Record the ERP product, version, object name, export date, and row count in the onboarding record.
- Include representative custom fields and unusual records.

## 3. Customer Answers

Collect these alongside technical inputs:

- meaning of custom ERP fields;
- customer-specific constants and defaults;
- company or organization scope;
- which ERP value identifies the record;
- expected handling for missing required values;
- lookup business keys and missing-value behavior;
- fields intentionally excluded from IVO;
- initial-load versus ongoing-sync behavior.

These decisions belong in the approved mapping, not the shared IVO reference.

## Optional Existing or Post-Deployment IVO Input

If an integration already exists or has been deployed, export matching IVO rows for comparison:

```text
customers/<customer>/<object>/input/ivo/data.csv
```

This is still an input because it came from an external system. Generated profiles and comparisons belong under `output/`. The IVO export is not required to create the initial proposal.

For meaningful comparison:

- ERP and IVO exports must cover the same customer, object, and approximate point in time;
- enough records must overlap to identify a join key;
- raw values must be preserved;
- compare immediately after a successful synchronization when possible.

## Data Safety

Customer exports may contain sensitive data. Keep them under `customers/`, which is excluded from source control. Use masked data for external sharing while preserving formats, cardinality, and null patterns.
