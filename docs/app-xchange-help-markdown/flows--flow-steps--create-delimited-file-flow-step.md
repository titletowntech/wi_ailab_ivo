# Create Delimited File Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-delimited-file-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Create Delimited File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7a89e0da-bfa7-4764-894f-fe6e20a12105.svg) Create Delimited File flow
                                        step to create a file from tabular data.

This step is commonly preceded by a [Lookup
                step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-flow-step) or [Parse
                step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-delimited-file-to-json-flow-step) to get the data and followed by a [Connector Action step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step) to send the
            file to its destination.

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Step Detail

- Filename: Required. Enter the name of the file you are
                          creating. This can be static or dynamic, based on available data (e.g. date,
                          flow data, or step data).
- Produce App Xchange
                                                  File Pointer: Enabled by default. This
                                          setting controls whether the flow step outputs a standard
                                          file pointer or an AppNetwork URL and file ID.
- Include Header Row: Enable this to include a header row of
                          your column names.
- Column Separator: Choose the character used to separate your
                          values into columns (Comma, Hyphen, Pipe, or Tab).
- Line Ending: Enter your preferred line ending format: Unix
                          (LF) or Windows (CRLF). If you are unsure or have no preference, you can
                          leave the value as Unspecified.

Row Map

In the List field, enter an expression that evaluates to a
                list of JSON objects that define the data for your rows. This could be data from a
                previous Lookup or parse step.

Column Names

Specify the columns for your data. Entries can be added
                by selecting Add Item and
                removed by selecting the trash icon button. Note that the
                order of the entries will be the order the columns appear in your file. Each entry
                consists of these fields.

- Column Name: Enter the name of the column. This can be
                          static or dynamic, based on available data (e.g. date, flow/step data,
                          etc.). This will only be visible if you have Include Header Row turned
                          on.
- Value: This is a pointer to the property name in the JSON.
                          It will be mapped to the column name.

## Step Outputs

The output of this flow
                                step depends on how you configured the flow step.

- If Produce App Xchange
                                                  File Pointer is enabled, the flow step
                                          outputs a file pointer. For more information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Produce App Xchange
                                                  File Pointer is disabled, the flow step
                                          outputs a legacy  AppNetwork URL and file ID.
