# Base Connections

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections/base-connections
> Captured directly from rendered HTML: 2026-08-14

For an integration product, base connections define connection
        details that can be used whenever that connector is used in integration.

Integration builders can enable base connections at the integration level to pre-populate
            certain connection details across multiple integration registrations. A connector must
            support connections to use base connections.

Because all connectors are configured differently, base connections can define
            a wide variety of connection details. Most commonly, you can define the OAuth
                Client or API Key when they are required for the
            integration to function properly. You can also create multiple base connections to
            account for different connection scenarios.

While base connections bring convenience for customers, they have some
            nuances to be aware of. When one or more base connection is enabled at the integration
            level, customers *must* use one when setting up their connection. Only a base
            connection's owner can modify it. Additionally, any field defined by a base connection
            cannot be modified at the workspace level.
