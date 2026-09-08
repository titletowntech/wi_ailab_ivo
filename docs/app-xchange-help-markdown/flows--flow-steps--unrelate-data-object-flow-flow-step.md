# Unrelate Data Object Flow Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/unrelate-data-object-flow-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Unrelate Data Objects flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/f86298aa-ea6a-4a1d-9575-aaf43d3462e4.svg) Unrelate Data Objects flow
                                        step to disconnect records currently linked between connectors by a Relate Data Objects flow
        step.

This flow step typically follows a Relate Data Objects flow step. For more information,
            see [Relate Data Objects Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/relate-data-objects-flow-step).

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Step Detail

Object 1

- Connector: Choose the connector containing the first data
                          object you want to unrelate.
- Object: Choose the first data object you want to
                          unrelate.
- Unique Identifier: This field is automatically populated
                          based on your Object 1 choice. Additional fields will display below for each
                          foreign key or reference field in Object 1. Enter an identifier in the
                          appropriate fields to establish the unwanted relationship to Object 2.

Object 2

- Connector: Choose the connector containing the second data
                          object you want to unrelate.
- Object: Choose the second data object you want to
                          unrelate.
- Unique Identifier: This field is automatically populated
                          based on your Object 2 choice. Additional fields will display below for each
                          foreign key or reference field in Object 2. Enter an identifier in the
                          appropriate fields to establish the unwanted relationship to Object 1.

## Step Outputs

When the Unrelate Data Objects flow step runs, the link between the
                specified data objects is disconnected.

The following step statuses may result after running this flow step:

- Success: The relationship between the data objects is
                          removed.
- Exception: An error occurred in one of the steps. The
                          relationship was not removed.
