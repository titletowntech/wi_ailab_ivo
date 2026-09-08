# Convert an SFTP Private Key to a Base64 Encoded String

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/connect-sftp-with-app-xchange/convert-an-sftp-private-key-to-a-base64-encoded-string
> Captured directly from rendered HTML: 2026-08-14

Follow these steps to convert an SFTP private key to a base64
        encoded string for use with the S/FTP connector.

1. Locate the exact file path of your private key.

                      Tip: It typically ends in `.pem` or `.key`.
2. Run the appropriate command depending on your operating system,  replacing
                          `/path/to/yourkey.pem` with the full file path of your
                      private key.

  - To convert a private key using Windows, open PowerShell and
                            run:

    ```javascript
    [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\yourkey.pem"))
    ```
  - To convert a private key using Linux, open Terminal and
                            run:

    ```javascript
    base64 -w 0 /path/to/yourkey.pem
    ```
  - To convert a private key using macOS, open Terminal and
                            run:

    ```javascript
    base64 -b 0 -i /path/to/yourkey.pem
    ```
Your private key is converted to a base64 encoded
            string.
        You can now copy it into the connector configuration for
            the S/FTP connector.
