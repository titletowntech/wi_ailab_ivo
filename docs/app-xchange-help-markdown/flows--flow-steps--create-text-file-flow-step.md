# Create Text File Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-text-file-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Create Text File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/f0a72cc0-2885-4ac1-8fa1-b4c652109a73.svg) Create Text File flow step to store text values in a file.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- File Name: Required. Enter the name of the file you want to
                          create. This can either be static or dynamically based on available data
                          like date, flow data, or step data. For example,  `return
                              `MyCompany_${dayjs().format('YYYYMMDD')}.txt`;`
- Produce App Xchange
                                                  File Pointer: Enabled by default. This
                                          setting controls whether the flow step outputs a standard
                                          file pointer or an AppNetwork URL and file ID.
- Line Ending: Enter Unix (LF),
                              Windows (CRLF), or
                              Unspecified based on your preferred line ending
                          format. If you are unsure or have no preference, leave the value as
                              Unspecified.
- File Content: Enter the text content of the file. This can
                          be a static string or generated dynamically from available data. This field accepts both [file
                                                  pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers) and file IDs. Example, `return
                              flow.step('build-edi-data-for-file').output;or`

## Step Outputs

The output of this flow
                                step depends on how you configured the flow step.

- If Produce App Xchange
                                                  File Pointer is enabled, the flow step
                                          outputs a file pointer. For more information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Produce App Xchange
                                                  File Pointer is disabled, the flow step
                                          outputs a legacy  AppNetwork URL and file ID.
