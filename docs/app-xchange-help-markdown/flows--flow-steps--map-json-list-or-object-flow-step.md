# Map JSON List or Object Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Map JSON List or Object flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/9749a832-2992-447b-947c-edd7bfd5481d.svg) Map JSON List or Object flow
                                                step (Map step, for short) to align data between connectors.

Before you can send data back and forth, you may need to map fields so that
            both connectors will be able to properly sync, send, and receive data. The Map step
            helps you do this.

Select MiniMap at the top right Edit Step window to view a high-level
            outline of all the properties and arrays you enter in the Map step. Hover over a
            property name to see the value. Or select any item in the MiniMap to jump directly to it
            in the step editor.

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Map JSON List or Object
                    Flow Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56343/map-json-list-or-object-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as needed for
                your flow.

Step Detail

- List or Object: Define the collection of data you want to
                          map. This value is typically an expression that either identifies a previous
                          step’s output or the trigger event information that triggered the flow. For
                          example,
                              `flow.step('get-all-employees-from-payroll').output;`.

Select Add Item and enter values in the appropriate fields to add a
                new mapping rule. Select the trash can icon to delete a mapping rule.

- Array Map: Enable this option to create a nested array or object. Nested maps work
                          exactly like standard maps: identify a List or Object, name the output
                          properties, and set their values.
- Property Name: Enter a name for the property you want to
                          create or write to as an output of this step.
- Value: Define how this property gets its data. Enter an
                          expression, string, integer, or true/false statement in this field. Use
                              `mapItem` to refer to the
                          data provided in the list or object field, see below for an example.

                      Tip: Enrich before mapping to avoid repeat
                          lookups.

## Step
                Outputs

The output of the Map step is the
                mapped fields between systems — the properties and associated values that you named
                in the Step Details section.

This step returns an
                array containing the mapped fields. If no objects matched, the array will be empty.
                To access a property within a matched object, use its index (e.g., [0] for the first matching
                object, [1] for the second
                matching object, and so on).

For some Map steps,
                the output is straight mapping, pointing one property to its equivalent in the other
                system. For other Map steps, the output includes new properties and values you
                defined in the Step Details section.

The
                following step statuses may result after running the Map step.

- SUCCESSFUL: Occurs when data successfully maps from one
                          system to another.
- EXCEPTION: Occurs when there is an exception that causes
                          the step to fail. Because the step has failed, the flow cannot be completed.
                          Check the flow run details to see the exception error message, as seen in
                          Figure 1. It lists the failed step, property names causing issues, and
                          reasons for the exception.
- FAILED: Occurs when data cannot map from one system to
                          another and the flow fails.

## Example Use Case

For an example use case of
                the map step, assume you need to move employee age and birth date data from a
                payroll system into an HR system. The payroll system has a birth date field but no
                age field, while the HR system has both birth date and age fields. You can use the
                Map step to add an Age property for every employee based on the birth date
                property.

Assuming you have a previous step in
                the flow that retrieves the necessary employee data from the payroll system. You can
                reference it in the List or
                    Object field using the expression, `flow.step('get-all-employees-from-payroll').output;`.

You can then define the new Age property you want to map data
                to. In this case, you can use JavaScript libraries and flow helpers to base this new
                value on the existing birthday field. Note the use of `flow.mapItem()` to access the iteration
                data since it is inside a map step.

To map the birth
                    date property to the Emp_birth date property, enter the Property Name and Value as follows.

Your map step is now configured to move your employee age and
                birth date data from your payroll system to your HR system.
