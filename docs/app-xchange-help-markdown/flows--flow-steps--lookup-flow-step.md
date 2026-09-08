# Lookup Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step to get data from an app cache on the AppNetwork.

This is useful when additional data is required before performing the next flow steps.
            This could be because related data is required for the flow or to validate source data
            before making a change in the target system.

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Lookup Flow
                Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56340/lookup-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details
                about the step configuration as needed for your flow.

Step Details

- Connector: Select the app (the third-party system) you want
                          to retrieve data from. The list of apps populates with all of the
                          third-party systems involved in the integration.

Configuration

- Object: Use the dropdown list to select the data being
                          looked up, as defined in the service.
- Fail the Step if: Choose the condition for step failure
                          based on lookup results.

  - N/A: Default. The
                                    number of results is irrelevant to the failure of the operation.
  - Exactly one result isn’t
                                        found: The step fails if it does not return
                                    precisely one matching record. Only lookups containing one matching
                                    record pass.
  - More than one result is
                                        found: The step fails if multiple results are
                                    returned. Lookups containing zero or one matching records pass.

                      Note: If something other than N/A is
                          selected and the step fails, there is no way to evaluate or make additional
                          decisions based on the step result. To troubleshoot while maintaining step
                          failure criteria, select N/A, and follow the Lookup step with a Conditional
                          step to inspect the output for the number of results and stop the flow if
                          the Conditional step fails.

- Include Metadata: Enable this option to include
                          supplementary information about the lookup results, such as record IDs,
                          timestamps, and other system-generated details. If you include metadata, you
                          must adjust your expressions to access values from the lookup result, as
                          metadata nests the data. For example, `flow.step('MyLookupStepNameHere').output[0].MyProperty;`
                          becomes fl`ow.step('MyLookupStepNameHere').output[0].Data.MyProperty;`.

Filter
                    Expressions

Select Add Item to add a filter
                expression to limit the records displayed during a lookup operation. If you add
                multiple properties, the Lookup step includes all of them in the flow. In the image
                below, the Lookup step evaluates both the ID and the cache ID in the filter
                expression.

- Property Name: Choose which available cached data will be
                          used for the flow.
- Operator: Choose the operator to use to compare the
                          property and the value.
- Value: Enter the result to compare to the property
                          name.

Properties

Select Add Item to define which
                properties to select from the records found during the lookup. If no properties are
                selected, the flow will return all properties.

- Properties to Select: Enter the exact fields to retrieve.
                          This is used to narrow down the data.

## Step Outputs

This step returns an array containing only the data
                objects that matched the specified criteria. If no objects matched, the array will
                be empty. To access a property within a matched object, use its index (e.g.,
                    [0] for the first matching object,
                    [1] for the second matching object, and so on).

You may see one of the following step statuses after running the Lookup
                step:

- Successful: Occurs in the following scenarios.

  - Data is successfully returned from the service (even if
                                    empty).
  - The specified Expected Results conditions are met.
- Failed: Occurs in the following scenarios.

  - You expect exactly one result and zero or more than one
                                    result is returned.
  - You expect exactly zero or one result and more than one
                                    result is returned.

If your flow step failed and you didn’t choose
                    N/A, there is no way to evaluate or make additional
                decisions based on the step result.

## Example Use Cases

A common use case for the
                Lookup step is to acquire additional data before performing the next flow steps. For
                example, you can use this step if you need to retrieve required vendor data before
                posting an invoice.

The Lookup step can also be
                used to validate source data before attempting to make changes in the target system.
                For example, you can use this step to ensure that a particular job isn’t locked or
                doesn’t have inactive phases in the source system before making budget updates in
                the target system.

These images show a Lookup
                step being used to look up a company’s headquarters information. This is useful if
                you want to confirm that an employee has the same address in each of two systems.
                This flow step would be followed by a Conditional flow step to confirm its results
                or stop the flow.
