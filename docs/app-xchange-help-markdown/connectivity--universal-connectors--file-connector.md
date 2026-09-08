# File Connector

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/file-connector
> Captured directly from rendered HTML: 2026-08-14

The universal file connector uses secure file transfer
        protocols to facilitate data transfers between an external application and the App Xchange
        platform.

Note: This connector is not publicly
            available. Instead, use the new [S/FTP Connector](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector).

Unlike most connectors, this connector is configured at both the
            Connector and Service level. When setting up the File connector, enter values in the
            following fields.

Additionally, if your FTP server uses a firewall or IP restriction
            settings, you must add the appropriate App Xchange source IP addresses to your IP allowlist.

Tip: United States-based
                        users must allowlist these App Xchange source IP addresses:
- 4.151.125.250
- 13.84.41.168

Australia-based users must allowlist this
                                        App Xchange
                                source IP address:

- 4.197.193.145

## Connector Configuration

- Real-time Action Processing: This feature should always
                      be enabled for optimal performance. Only disable it if you are advised to do so
                      by support.

-

## Service Configuration

- Description: Enter a brief description to be
                          displayed in the Services table of the Jobs page.

Ftp Connection Config

- FTP Protocol :Select the appropriate secure file transfer
                      protocol from the dropdown menu. SFTP is
                          recommended.Note: Select FTP to
                          use FTPS. Although it displays as FTP, rest assured we are using
                          FTPS.
- FTPS Security Type: This field is only used for FTPS
                      connections. Select either Implicit or
                          Explicit from the dropdown menu, as indicated by your
                      FTPS provider.
- FTP Server Host Name: Enter the FTP server hostname.
- FTP Server
                          Port: Enter the port for the FTP server. Below are the standard
                      ports for common secure protocols:
  - FTPS/Implicit=990
  - FTPS/Explicit=21
  - SFTP=22
- FTP
                          Username: Enter the username used to sign in to the FTP
                      server.
- FTP
                          Password: Enter the password used to sign in to the FTP
                      server.
- Private SSH
                          Key: Enter the private SSH key used for your connection.
- Use RSA
                          SHA2: Select this checkbox to enable the RSA SHA2-256 host key
                      encryption for the connection. Use this feature for new servers or if the
                      connection is being closed by the server.
- Server
                          Response Timeout: Enter the time in seconds to wait for a server
                      response before the connection times out. If left blank, this parameter defaults
                      to 30 seconds.
- Process this
                          queued action instance?: This feature should always be enabled
                      for optimal performance. Only disable it if you are advised to do so by
                      support.
