# Extract Zip v2 Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/extract-zip-v2-flow-step
> Captured directly from rendered HTML: 2026-08-14

The ![Extract Zip V2 flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/28e96f85-0688-491d-9053-257308caa2ce.svg) Extract Zip V2 flow step is used to extract every file compressed in a .zip file and then upload it to the file
        API.

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
                          you selected, enter the file ID or file pointer of the .zip file you want to
                          extract. This can be the output of a previously executed step.

## Step Outputs

The contents of the .zip file are extracted.

The output of this flow
                                step depends on how you configured the flow step.

- If File Pointer was
                                          selected, the flow step outputs a file pointer. For more
                                          information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Legacy File
                                                  API was selected, the flow step outputs
                                          an AppNetwork URL and file ID.

## Example Use Case

A common use case is that you are given a .zip file pointer and need to
                operate on every file in the .zip file. You can use this flow step to extract each
                file, then follow it with a For Each flow step to iterate over every file
                pointer.
