# Group By Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/group-by-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Group By flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5fba7cb3-5f92-4b56-ad8f-b5348b20a938.svg) Group By flow step to aggregate data based on specified criteria.

This step allows you to group records by one or more fields and then perform aggregate
            functions such as sum, count, average, min, or max on other fields within these
            groups.

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Step Detail

- List: Enter the list of records that you want to group. This
                          is typically an expression that identifies the data output of a previous
                          step. You might use the template of
                              `flow.step(‘step-id-goes-here’).output` to name the step
                          with the data output that you want to filter. For example,
                              `flow.step('invoice-lines').output;`.

Group by Properties

Use the List field to specify This becomes the input dataset for the Group
                By operation.

In the Group by Properties section, use the Property Name field to indicate
                the property you want to group your records by. If needed, you can select Custom
                    Property to define a custom value for the property. Select Add Item
                to add additional properties.

## Step Outputs

The Group By step outputs a new list of records where the original
                records have been grouped according to the specified criteria. Each record in this
                new list represents a unique group.

Example grouped by
                `"name"`:

```javascript
[
  {
    "Keys": {
      "name": "Vista Integration Sync Events Test Acct"
    },
    "Items": [
      {
        "id": 598134325520975,
        "name": "Vista Integration Sync Events Test Acct"
      }
    ]
  },
  {
    "Keys": {
      "name": "TESTMD2"
    },
    "Items": [
      {
        "id": 598134325703092,
        "name": "TESTMD2"
      }
    ]
  }
]
```

## Example Use Case

For an example of how you would use the Group By flow
                step, assume you have a list of sales records that you want to group by sales region
                and calculate the total sales for each region. In this scenario, you would use the
                Group By step to group the records by the Region field and then sum the Sales Amount
                field for each group in a subsequent step.
