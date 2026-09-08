# Parse Delimited File to JSON Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-delimited-file-to-json-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Parse Delimited File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/36f2d728-c714-4742-a59b-05401613aa89.svg) Parse Delimited File to JSON flow
                                                step to output JSON from supplied delimited data.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- File
                                                    API: Choose one of the following from
                                                  the dropdown.
  - File API: Select this option to input
                                                      a direct File ID string.
  - Legacy File API: Only select this
                                                      option if your specific needs are not met by the
                                                      other options.
  - File Pointer:
                                                      Recommended. Select this option to input a [file
                                                      pointer](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- File IDs/File
                              Pointers: Depending on the File API
                          you selected, enter the file ID or file pointer of the delimited file you
                          want to parse. For example, you might get the ID from a prior ![Create Delimited File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7a89e0da-bfa7-4764-894f-fe6e20a12105.svg) Create Delimited File flow
                                          step.
- Has Header Row: Enable this if your delimited data includes
                          data for a header row.
- Starting Row Number: Enter the row number where your data
                          starts. It will default to starting from row 1 if no value is entered.
- Columns to Include: Enter a comma-separated list of columns
                          to include from your delimited data. If left blank, all columns will be
                          included. If your data doesn’t have a header row, you can use numbers to
                          indicate which columns to include. When doing so, the JSON will be output
                          with property names like column1, column2, etc.

## Step Outputs

The output of this flow
                                step depends on how you configured the flow step.

- If File Pointer was
                                          selected, the flow step outputs a file pointer. For more
                                          information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Legacy File
                                                  API was selected, the flow step outputs
                                          an AppNetwork URL and file ID.
