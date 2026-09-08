# Connectivity

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity
> Captured directly from rendered HTML: 2026-08-14

The ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity page displays all of your account's Connections,
        OAuth clients, On-Prem Agents, and Legacy Agents, each across its own tab.

## Connections Tab

![App Xchange Connectivity page](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/faf3c3ba-b699-4b03-960e-ab79edc6dad3.png)

The main tab of the ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity page includes a list of connections that
                belong to your account. For each connection, it details the connector name,
                connection name, the user who created it, the status, the test result, and the
                latest test date.

You can use the search bar and the Account Connections and
                    External Connections
                filters to find a specific connection. Select any connection to view its connection
                details page. For more information, see [Connections](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections).

## OAuth Clients Tab

            The OAuth Clients tab includes a list of OAuth Clients
                that belong to your account. For each client, it details the following
                    information:
- Name
- Connector
- Connector Definition
- Public
For more information, see [OAuth Clients](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/oauth-clients).

## On-Prem Agents Tab

The Agents tab displays all active v2 agents connecting apps to
                your account. For each agent, it details the following information:

            Note: During the platform migration to the v2 agent, you may see
                new agents in this section. This is an expected result of the automatic
                rollout.

- Name
- Version
- Status
- In Use
- Last Called
- Created On

You should create a new agent when and if you control the machine it needs to be installed on, and that machine does not already have an agent installed. If you need an agent installed on a cloud hosted service, see the connector documentation for that service.

For more information, see [App Xchange Agent](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-xchange-agent).

## Legacy Agents Tab

The Agents tab displays all active v1 agents connecting apps to
                your account. For each agent, it details the following information:

- Computer name
- Workspace
- Login name
- IP Address
- Main
  - Version
  - Last call home
- Monitor
  - Version
  - Last call home
