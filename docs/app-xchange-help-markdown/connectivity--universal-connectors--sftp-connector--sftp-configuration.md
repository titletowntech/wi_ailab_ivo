# S/FTP Configuration

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/sftp-configuration
> Captured directly from rendered HTML: 2026-08-14

The connector registration configuration
                                        properties customize the connector behavior for this
                                        workspace. Which ones are necessary depends on the use
                                        case.

- Real-time Action Processing: This feature should always
                      be enabled for optimal performance. Only disable it if you are advised to do so
                      by support.
- Root
                          Directory: Optionally specify a root directory to determine
                      connector behavior in this workspace. For example, /uploads
- PGP Private
                          Key (Base64 Encoded): If your files are PGP-encrypted and your
                      integration needs to decrypt those files, provide the key here base64 encoded.
                      For instructions, see [Convert an SFTP Private Key to a Base64 Encoded String](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/connect-sftp-with-app-xchange/convert-an-sftp-private-key-to-a-base64-encoded-string).
- PGP Private
                          Key Passphrase: If your files are PGP-encrypted and your
                      integration needs to decrypt those files, enter the passphrase associated with
                      your PGP private key to enable App Xchange to decrypt your files.
