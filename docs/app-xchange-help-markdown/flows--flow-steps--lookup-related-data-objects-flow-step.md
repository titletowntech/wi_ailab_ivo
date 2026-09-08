# Lookup Related Data Objects Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-related-data-objects-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step to fetch records from a related data object.

To use this flow step, you must define a relationship between one data object and the
            current data object being processed. You can specify which properties of the related
            records to include in the output, ensuring that only relevant data is retrieved.

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

From

- Connector: Choose the connector containing the data object
                          you want to use as the starting point for the lookup.
- Object: Choose the data object that contains the data you
                          want to use to find related data.
- Unique Identifier: This field is automatically populated
                          based on your From Object choice. Additional fields will display below for
                          each foreign key or reference field in the From Object. Enter an identifier
                          in the appropriate fields to establish the relationship to the To
                          Object.

To

- Connector: Choose the connector containing the data object
                          you want to retrieve related information from.
- Object: Choose the data object that contains the data you
                          are looking up. This object should have a primary key or unique identifier
                          that matches the Unique Identifier fields from the From Object.

Depending on the specific configuration and the context in which you are setting up
                this flow step, you may also have the option to toggle Include Metadata or fill out
                the Fail the Step If and Filter Expressions fields.

## Step Outputs

This flow step outputs a combination of the primary object's data,
                the related object's data, any included metadata, and the status of the lookup
                operation.
