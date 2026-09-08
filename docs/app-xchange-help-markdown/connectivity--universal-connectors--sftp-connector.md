# S/FTP Connector

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/sftp-connector
> Captured directly from rendered HTML: 2026-08-14

The S/FTP connector enables App Xchange users to leverage standard transfer protocols to detect file
        updates and perform byte-level read and write operations.

            Note: This connector is available as an
                early public BETA for
                customers to preview, evaluate, and leverage in their integrations and connected
                workflows. This page will be updated when the connector is available for non-beta
                usage following evaluation of user feedback during the beta period.

Use the S/FTP connector to manage files and cache their metadata with the Files
            data object. Use the cached meta data to trigger flows and detect changes, filterable by
            directory and REGEX. Note that cache deletions are disabled so that changing target
            directories or folders does not delete existing data.

Once your flow has detected changes, reading and writing file bytes are handled
            via connector actions, primarily Get and Write. These actions get the file data as
            needed and leave the source server files intact. This paradigm enforces no file storage
            on App Xchange, and the generated file
            pointers have a time to live of 12 hours.

## User Access

You can use any SFTP-compliant software with this connector.  For a general guide on
                configuring user access, see the [OpenSSH sshd_config](https://man.openbsd.org/sshd_config) manual.

## Engagement and Training

If you would like additional training or to ask for enhancements
                to this connector, please visit your customer portal.

## Technical Documentation

This connection utilizes the standard SFTP (SSH File Transfer
                Protocol). For technical specifications, see [RFC 4253](https://datatracker.ietf.org/doc/html/rfc4253).

Connector Endpoints

            The documentation below is an OpenAPI description (OAD) of each
                module in this connector. Note:  This is
                    provided as a quick view of coverage and capabilities. The API and endpoints
                    documented are used internally by the platform and not directly by end
                    users.

- [File Management](https://api.xchange.trimble.com/connect/v1/direct/ftp/file-management/1/swagger/index.html?p=1394942c-cc27-4e69-9d48-937beac5a86a)

## User Support

If you
                                encounter a problem or need support for this connector, [create an App Xchange
                                        product case](https://help.trimble.com/doc/app-xchange/app-xchange/app-xchange-support) through the Trimble Support
                        Center.
