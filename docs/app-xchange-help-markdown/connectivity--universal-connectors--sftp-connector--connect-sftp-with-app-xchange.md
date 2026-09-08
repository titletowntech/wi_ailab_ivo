# Connect S/FTP with App Xchange

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/connect-sftp-with-app-xchange
> Captured directly from rendered HTML: 2026-08-14

Follow these steps to connect S/FTP with App Xchange.

If your S/FTP server
                        uses a firewall or IP restriction settings, you must add the appropriate
                                App Xchange source IP
                        addresses to your server's allowlist.Tip: United States-based
                        users must allowlist these App Xchange source IP addresses:
- 4.151.125.250
- 13.84.41.168

Australia-based users must allowlist this
                                        App Xchange
                                source IP address:

- 4.197.193.145

        Enter the connector details in App Xchange.

If you need to connect to more than one server or otherwise leverage multiple
                        connection details in a workspace, choose collection of server credential
                        sets and repeat these steps. When using a collection of credentials, you
                        will see the additional properties of identifier and alias on each set to
                        ensure uniqueness, as well as all property fields. Your files will also have
                        a composite key with the unique identifier from the credential set, so your
                        integration can distinguish between identically named files by the source
                        server reliably. Refer back to the single connection definition details to
                        determine the required properties.

1. Navigate to Workspace > Integrations, then select Add Connection next to this connector.
2. Select the appropriate connection
                  definition from the dropdown.
3. In the Name field, enter a meaningful name for this
                connection to help you identify it later.
4. Depending on your connection definition, populate the appropriate
                credentials.

  - FTP
    - Credential
                                                      Set Identifier: This will automatically
                                                  populate when saved. This value is used in record
                                                  details to associate credentials with records.
    - Credential
                                                      Set Name: Enter a unique identifier for
                                                  the credential set.Note: This is only needed for an
                                                      array of credentials.
    - FTP Server
                              Host Name: Enter the FTP server host name.
    - FTP Server
                              Port: Enter the port of the FTP server. The default is
                              21.
    - FTP
                              Username: Enter the username to log into the FTP server.
    - FTP
                              Password: Enter the password to log into the FTP server.
  - FTPS
    - Credential
                                                      Set Identifier: This will automatically
                                                  populate when saved. This value is used in record
                                                  details to associate credentials with records.
    - Credential
                                                      Set Name: Enter a unique identifier for
                                                  the credential set.Note: This is only needed for an
                                                      array of credentials.
    - FTP Server
                              Host Name: Enter the FTP server host name.
    - FTP Server
                              Port: Enter the port of the FTP server. Defaults are 21 (Explicit) or 990 (Implicit).
    - FTP
                              Username: Enter the username to log into the FTP server.
    - FTP
                              Password: Enter the password to log into the FTP server.
    - FTPS
                              Security Type: Select Explicit, Implicit, or Auto from the dropdown.
                            Explicit is the most commonly used method of FTPS encryption.
  - SFTP with
                        User/Password
    - Credential
                                                      Set Identifier: This will automatically
                                                  populate when saved. This value is used in record
                                                  details to associate credentials with records.
    - Credential
                                                      Set Name: Enter a unique identifier for
                                                  the credential set.Note: This is only needed for an
                                                      array of credentials.
    - SFTP
                              Server Host Name: Enter the SFTP server host name.
    - SFTP
                              Server Port: Enter the port of the FTP server. The default is
                              22.
    - SFTP
                              Username: Enter the username to log into the SFTP server.
    - SFTP
                              Password: Enter the password to log into the SFTP server.
    - SFTP
                              Enable Keyboard Interaction Method: Enable this to allow the
                            server to ask questions during login. This is required if you need to enter a
                            One-Time Password (OTP) or security code to connect.
  - SFTP with
                        User/Password and Private Key
    - Credential
                                                      Set Identifier: This will automatically
                                                  populate when saved. This value is used in record
                                                  details to associate credentials with records.
    - Credential
                                                      Set Name: Enter a unique identifier for
                                                  the credential set.Note: This is only needed for an
                                                      array of credentials.
    - SFTP
                              Server Host Name: Enter the SFTP server host name.
    - SFTP
                              Server Port: Enter the port of the FTP server. The default is
                              22.
    - SFTP
                              Username: Enter the username to log into the SFTP server.
    - SFTP
                              Password: Enter the password to log into the SFTP server.
    - SFTP
                              Private Key - Base 64 encoded: Enter the base 64 encoded SSH
                            private key for the SFTP server to be connected.

      For
                              instructions on encoding a private key, see [Convert an SFTP Private Key to a Base64 Encoded String](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/connect-sftp-with-app-xchange/convert-an-sftp-private-key-to-a-base64-encoded-string).
    - SFTP
                              Passphrase: If your SFTP private key is encrypted with a
                            passphrase for extra security, enter that passphrase.
    - SFTP
                              Enable Keyboard Interaction Method: Enable this to allow the
                            server to ask questions during login. This is required if you need to enter a
                            One-Time Password (OTP) or security code to connect.
5. Select Connect.

      The connector is
                                        connected.
    If required, you can further configure your connector. See
        [S/FTP Configuration](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector/sftp-configuration).
