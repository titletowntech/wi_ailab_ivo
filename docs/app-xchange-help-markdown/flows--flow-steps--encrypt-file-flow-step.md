# Encrypt File Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/encrypt-file-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Encrypt File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/be156e64-6980-43a0-9c11-41a936487bdf.svg) Encrypt File flow step to encrypt the contents of a created or uploaded
        file.

## Step Inputs

In the Edit Step menu, you can add details about
                the step configuration as needed for your flow.

- Encryption Method: Choose which type of encryption method
                          you want. Currently, PGP is the only supported encryption method.
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
                          you selected, enter either the files ID or file pointer you want to encrypt.
                          This can be the output of a previously executed step.
- Encrypted File Name: Enter a name for the encrypted file you
                          want to create.
- Use Existing Public Key: Only enable this setting if the
                          workspace has a Concur integration and FTP credentials filled out.
- Public Key: Enter the public encryption key.

## Step Outputs

When an Encrypt File flow step runs, the file is encrypted.

The output of this flow
                                step depends on how you configured the flow step.

- If File Pointer was
                                          selected, the flow step outputs a file pointer. For more
                                          information, see [File Pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers).
- If Legacy File
                                                  API was selected, the flow step outputs
                                          an AppNetwork URL and file ID.
