# Read a CSV File Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/read-a-csv-file-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Read a CSV File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5228f2db-96ce-426c-b187-522a59d05f08.svg) Read a CSV File flow step to read the contents of any text file, not just
        .csv files.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- File API: Choose one of the following from the dropdown.
  - Legacy File
                                        API: Select this option to input a legacy file
                                    pointer object.
  - File Pointer: Recommended. Select this option
                                    to input a [file
                                    pointer](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- File IDs/File
                              Pointers: Required. Depending on the File
                              API you selected, enter an expression that evaluates to the
                          file ID or file pointer of the .csv file you want to read.

## Step Outputs

The output of this flow
                                step depends on how you configured the flow step.

- If File Pointer was
                                          selected, the flow step outputs a file pointer. For more
                                          information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Legacy File
                                                  API was selected, the flow step outputs
                                          an AppNetwork URL and file ID.
