# File Pointers

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers
> Captured directly from rendered HTML: 2026-08-14

File pointers are used by flow steps that handle files to
        simplify data management.

App Xchange file pointers share
            the following attributes:

- Filename: The name of the file (for example,
                          `invoice.pdf`).
- Content Type: The MIME type (for example,
                          `text/csv` or `application/json`).

                  Note: If an appropriate file type cannot be determined, the
                      system defaults to `application/octet-stream`.
- Size: The file size in bytes.

                  Note: The max file size is 500
                      MB.
- Location: The URL where the actual data resides. This
                      could be a secure internal URL provided by an App Xchange output, a provided public URL, etc.

File pointers hosted in App Xchange's File API are temporary. They remain valid for 12 hours after creation, after which
            the reference expires. FIle pointers corresponding to public files do not expire.

You can retrieve a file pointer from a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step for whom a file pointer is the top-level result
            using the syntax `actionResponse.result`
            or return
                `flow.step('your-action-step').actionResponse.result.filePointer;`
            for the SFTP connector.

You can retrieve a file pointer from any previous flow step for whom a file
            pointer is the top-level result using the syntax `flow.step('id').output`. Some steps accept an entire file pointer object,
            while others require the properties broken down as such.

- filename:
                      `flow.step('step-name').output.filename;`
- contentType:
                      `flow.step('step-name').output.contentType;`
- size:
                  `flow.step('step-name').output.size;`
- location:
                      `flow.step('step-name').output.location;`

## Compatible Flow Steps

These flow steps can interact with file pointers, either by
                generating them as an output or using them as an input:

- [![Combine Delimited Files flow step icon flow step](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/cda872bb-a69a-4d0b-97e7-661f90ce70b5.svg) Combine Delimited Files flow
                                                  step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/combine-delimited-files-flow-step)
- [![Create Delimited File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7a89e0da-bfa7-4764-894f-fe6e20a12105.svg) Create Delimited File flow
                                          step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-delimited-file-flow-step)
- [![Create Text File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/f0a72cc0-2885-4ac1-8fa1-b4c652109a73.svg) Create Text File flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-text-file-flow-step)
- [![Email flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a19b793b-b771-4d25-8d0f-604e21735936.svg) Email flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/email-flow-step) (input only)
- [![Encrypt File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/be156e64-6980-43a0-9c11-41a936487bdf.svg) Encrypt File flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/encrypt-file-flow-step)
- [![Extract Zip V2 flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/28e96f85-0688-491d-9053-257308caa2ce.svg) Extract Zip V2 flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/extract-zip-v2-flow-step)
- [![Parse Excel File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/216e5723-e399-4e07-8abe-fb634955be23.svg) Parse Excel File to JSON flow
                                                  step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-excel-file-to-json-flow-step)
- [![Read a CSV File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5228f2db-96ce-426c-b187-522a59d05f08.svg) Read a CSV File flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/read-a-csv-file-flow-step) + [![Parse Delimited File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/36f2d728-c714-4742-a59b-05401613aa89.svg) Parse Delimited File to JSON flow
                                                  step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-delimited-file-to-json-flow-step) (The Read step takes the
                      file pointer as an input and outputs the raw string for the Parse step)
- [![Read a CSV File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5228f2db-96ce-426c-b187-522a59d05f08.svg) Read a CSV File flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/read-a-csv-file-flow-step) + [![Parse CSV File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5390df6d-2cfd-4105-9ba7-99e8329f6a2b.svg) Parse CSV File to JSON flow
                                                  step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/parse-csv-file-to-json-flow-step) (The Read step takes the
                      file pointer as an input and outputs the raw string for the Parse step)

## Example Use Case

There are many possible use cases for file pointers. For example,
                when using the S/FTP connector, you could use a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step to read a file. The step would output a
                file pointer, which you could then pass to a ![Read a CSV File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5228f2db-96ce-426c-b187-522a59d05f08.svg) Read a CSV File flow step. This would output the raw string for a
                    ![Parse CSV File to JSON flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5390df6d-2cfd-4105-9ba7-99e8329f6a2b.svg) Parse CSV File to JSON flow
                                                step to extract row data.
