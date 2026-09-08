# Combine Delimited Files Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/combine-delimited-files-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Combine Delimited Files flow step icon flow step](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/cda872bb-a69a-4d0b-97e7-661f90ce70b5.svg) Combine Delimited Files flow
                                                step to combine two or more delimited files into a
        single delimited file.

This step is commonly preceded by at least one [![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-flow-step) to fetch the data. It is commonly
            followed by a [![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step) to send the combined file to its
            destination.

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
- File IDs/File Pointers: Depending
                          on the File API
                          you selected, enter either the files IDs or file pointers you want to
                          combine, as an array [] separated by commas (no space), and in the order you
                          want the data to be merged. For example: `[file1,file2,file3]`. You can
                          find the ID of a specific file using the Workspace Cache
                      Explorer.

  Example: `return [
                          flow.step('create-delimited-file---produce-file-pointer').output,
                          flow.step('create-another-delimited-file-').output, ];`
                      Note: Your fileId and/or fileLocation must be
                          unique.
- File Name: Enter the name of the combined file you want to
                          create. This can be static or dynamic, based on available data (e.g. date,
                          flow/step data, etc.)

                      Note: Although this field is not required, you are highly
                          encouraged to specify a name. Failing to do so could lead to unexpected
                          behavior.
- Has Header Row: Enable this if the files you are combining
                          have header rows. The header rows will be preserved in the combined
                          file.
- Line Ending: Enter your preferred line ending format: Unix
                          (LF) or Windows (CRLF). If you are unsure or have no preference, leave the
                          value as Unspecified.

## Step Outputs

The output of this flow
                                step depends on how you configured the flow step.

- If File Pointer was
                                          selected, the flow step outputs a file pointer. For more
                                          information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Legacy File
                                                  API was selected, the flow step outputs
                                          an AppNetwork URL and file ID.

The output exists in your Workspace Cache and has the name you
                entered in the File Name field. It includes the data from all the source files
                combined in the specified order. The header rows will be preserved if you configured
                the step to include headers.
