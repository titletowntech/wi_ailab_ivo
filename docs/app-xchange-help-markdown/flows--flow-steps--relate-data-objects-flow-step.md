# Relate Data Objects Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/relate-data-objects-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Relate Data Objects flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/60a2c8d4-b3d7-4f78-9e53-832959e90e2d.svg) Relate Data Objects flow
                                        step to relate two data objects between connectors.

App Xchange connectors populate the cache with external system data. When integrating
            multiple systems, the Relate Data Objects flow step establishes necessary relationships
            between disparate cached datasets.

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Object 1

- Connector: Choose the connector containing the first data
                          object you want to relate.
- Object: Choose the first data object you want to relate.
- Unique Identifier: This field is automatically populated
                          based on your Object 1 choice. Additional fields will display below for each
                          foreign key or reference field in Object 1. Enter an identifier in the
                          appropriate fields to establish the relationship to Object 2.
- Embedded Target?: Enable this to include the child data
                          objects in the flow step. For example, a comment on an RFI is a child
                          object.

Object 2

- Connector: Choose the connector containing the second data
                          object you want to relate.
- Object: Choose the second data object you want to
                          relate.
- Unique Identifier: This field is automatically populated
                          based on your Object 2 choice. Additional fields will display below for each
                          foreign key or reference field in Object 2. Enter an identifier in the
                          appropriate fields to establish the relationship to Object 1.
- Embedded Target?: Enable this to include the child data
                          objects in the flow step. For example, a comment on an RFI is a child
                          object.

## Step Outputs

This flow step outputs a JSON object containing the data from both
                related objects, with nested objects for child data if embedded targets are
                included. The relationship also displays in the data object's Object Record Detail
                page. For more information, see [Object Record Detail](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail). If you need to unrelate
                these data objects later, use the [Unrelate
                    Data Object flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/unrelate-data-object-flow-flow-step).

## Example Use Case

For an example of how to
                use the Relate Data Objects flow step, assume you need to relate some Procore RFIs
                to their respective replies. For Object 1, you would specify the connector as
                    Procore v2, the data
                object type as RFIs v1.
                The ID is automatically assigned as the unique identifier, as it is the only field
                within the data object's definition. To relate a Procore RFI with an ID of 14791841,
                you would input 14791841
                as the value for the ID.
                The key locator pattern, crucial for locating the key within the data object's JSON
                structure, is assumed to be pre-configured for the ID field.

Object 2 follows the same
                structure as the first object but represents the other side of the relationship.
                Object 2 is defined as an RFI reply from Procore with a unique identifier of
                    ID, which has a value
                of 1.

Optionally, if comments on
                the RFI were embedded as child data objects, you could enable Embedded Target?, to include them
                in the relationship for referenced purposes. To do so, select the location rfi_id
                and define the key, 1.

In this case, the child data
                object is considered for the purpose of finding a relationship between a RFI and an
                RFI Reply. However, this is possible.

(Child
                data objects in this case are not considered data objects for the purpose of finding
                a relationship between a RFI and an RFI Reply.)

When run, this flow step
                establishes a relationship between a specific Procore RFI and its reply. If
                configured to so, it also incorporates related comment data.
