# Parse CSV File to JSON Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-csv-file-to-json-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Parse CSV File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5390df6d-2cfd-4105-9ba7-99e8329f6a2b.svg) Parse CSV File to JSON flow
                                                step to output JSON from a supplied .csv file.

This step is commonly preceded by a [Lookup
                step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-flow-step) step to get a .csv file.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- File Contents: Required. Enter an expression pointing to the
                          location of your .csv file data.
- Has Header Row: Enable this if your .csv data includes data
                          for a header row.
- Starting Row Number: Enter the row number on which your data
                          starts. It will default to starting from row 1 if no value is entered.
- Columns To Include: Enter a comma-separated list of columns
                          to include from your .csv data. If left blank, all columns will be included.
                          If your data doesn’t have a header row, you can use numbers to indicate
                          which columns to include. When doing so, the JSON will be output with
                          property names like column1, column2, etc.

## Step Outputs

The output of the step is a JSON object representing the data from
                the .csv file.
