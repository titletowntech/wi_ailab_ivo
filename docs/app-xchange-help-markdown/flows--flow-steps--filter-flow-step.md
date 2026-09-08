# Filter Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/filter-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Filter flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/d7e66b05-114d-408f-ad43-529d7fe6ba5d.svg) Filter flow step to identify a subset of data you want to keep based on specified criteria.

The purpose of the Filter flow step is to refine the data that passes through to the next
            step. When creating this step, you define the filter criteria.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- List: Define the collection of data you want to filter.
                          This is typically an expression that identifies the data output of a
                          previous step. You might use the template of `flow.step(‘step-id-goes-here’).output` to name the step with
                          the data output that you want to filter.

  For example, `flow.step('invoice-lines').output;`.
- Test Expressions: Enter parameters that identify the
                          specific data you want to filter out. The Filter flow step keeps all data
                          objects where this expression evaluates to true.

  For example, you can address the rows of the
                          input collection using `flow.loopItem().propertyName`. This expression filters for a
                          line type of 6:

  ```javascript
  const lineType = flow.loopItem().type;
  return lineType == 6;
  ```

## Step Outputs

This step returns an array containing only the data
                objects that matched the specified criteria. If no objects matched, the array will
                be empty. To access a property within a matched object, use its index (e.g.,
                    [0] for the first matching object,
                    [1] for the second matching object, and so on).

You may see one of the following step statuses after running the Filter
                step:

- SUCCESSFUL: Occurs when the input was successfully
                          filtered.
- FAILED: Occurs in the following scenarios.

  - The List input is null.
  - A provided test expression does not evaluate to true/false
                                    or is invalid.

## Example Use Case

Use the Filter
                step in any scenario where you need to refine the data passing through your flow.
                You may need to sort data by particular characteristics to narrow down the dataset.

For example, assume you have a flow where you are working with
                invoice data. You only need to see the purchase order line types, which are line
                type 6. You could add a Filter step to keep only lines with lineType = 6 and then
                continue your flow with just this subset of data.
