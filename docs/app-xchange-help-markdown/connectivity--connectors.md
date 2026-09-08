# Connectors

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors
> Captured directly from rendered HTML: 2026-08-14

Connectors communicate and exchange data between the external
        system and the App Xchange platform in an integration.

The connector is an intermediary between the App Xchange platform and an external product,
            database, or application. It is *not* an integration or
            data workflow. Instead, it provides integration capabilities in the form of pre-built
            data objects with actions that can be used to build data transformations and flows. All
            products require a connector for their data to be available on the platform.

There are two types of connectors:

- Account-owned connectors are created by and are only available
                      to your company.
- Public
                          connectors are available to anyone to use in building
                      integrations and flows. Consult the [App Xchange Connector Directory](https://appxchange.trimble.com/connectors) for a full list of
                      public connectors.

Integration builders can also create their own connectors
            for public or private use. For more information, see [Build a Connector](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/connector-building-faq).

## Connector Details and Modules Page

Select ![connectors icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/40226ac9-8020-4722-8766-d9586b0879c5.svg) Connectors to view the Connector Details and Modules
                pages for an account-owned or public connector. You can also view these from the
                    ![connectors icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/40226ac9-8020-4722-8766-d9586b0879c5.svg) Connectors tab in a workspace. There are no actions to
                take on these pages.

The Details tab displays the connector's Metadata and a Timeline
                Overview of its changes.

The Modules tab displays the modules and data objects implemented
                for that connector that you can use in your flows and integrations. If you don't see
                these, you may not have permission to view them or they may not be available.

Select a modules to see its data objects. The data
                objects show you what you can select and configure as part of this integration. For
                example, if you view an Accounts Payable module, data objects may include Invoices,
                Payment Histories, and Vendors.

Select Open API for a module to view the available API commands for that
                module.

Select a data object to see its JSON schema, Unique
                Identifiers, and Actions you can perform with the data. If no schema is listed, the
                data object cannot send or receive data.

## Using Connectors

To add connectors to an integration, see [Add Connectors](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-connectors). Connectors cannot be removed from an integration,
                though they do not have to be used.

Connectors do not move data until a connection is
                created with credentials. For more information, see [Connections](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections).

Depending on the connector and your system's firewall or IP restriction settings, you
                may have to allowlist one or more App Xchange source IP addresses.

            Tip: United States-based
                        users must allowlist these App Xchange source IP addresses:
- 4.151.125.250
- 13.84.41.168

Australia-based users must allowlist this
                                        App Xchange
                                source IP address:

- 4.197.193.145
