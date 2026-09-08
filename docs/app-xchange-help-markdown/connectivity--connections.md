# Connections

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections
> Captured directly from rendered HTML: 2026-08-14

Connections are necessary for moving data to and from
        connectors.

Connections bundle everything needed to authorize App Xchange to access the target product's
            connector. App Xchange leverages
            connections to enable certain features and behaviors on the platform, like different
            types of authentication or testing connections before executing the flows that depend on
            them. You must establish connections in your workspace to the connectors of the products
            or applications between which data will be transferred. For additional information, see
                [Connectors](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors).

This image is an example of a green, successful connection
            and red, disconnected or unsuccessful connection.

        ![App Xchange successful and unsuccessful connections](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/71a3d1ed-9653-41b3-9db2-458787de1ccb.png)

If there is no icon or status on the right of a connector’s row, the
            connector is using the legacy Connector Registration Configuration accessed by selecting
            the connector name.

## Using Connections

When a user creates a new connection, that connection is now connected. That means the connection is
                successfully tested and available for use on any valid connector registration to
                which you have access.

A connection that is connected does not need to be tested for each
                workspace.

A connection is owned by the user who creates it. That
                means the connection is usable in all workspaces owned by that user's account.

Permissions are limited if a user does not own a
                connection, because they often include and are analogous to a username and password.
                Connecting with another users connection would be equivalent to logging in as
                someone else.

Other users on that account can view the connection but
                cannot edit it or view private fields like credentials (as defined by the associated
                connector), as well as test or disconnect. Before trying to connect, make sure you
                own the connection.

If the connection employs an authentication method with
                an OAuth grant type or flow, it must incorporate an OAuth client. An OAuth client is
                owned by the user who created it and is available to that user's account and to the
                connection for which it is prepared. For more information, see [OAuth Clients](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/oauth-clients).

A user who is an integration provider (typically with an
                    App Xchange for Products license)
                may create a new connection to be used by a workspace deployed on behalf of another
                account. For example, when a user buys a pre-built App Xchange integration on the Trimble Marketplace, the integration
                provider typically deploys a managed workspace on behalf of that user. The
                integration provider also typically prepares a new connection for them to use in
                that workspace.

In this scenario, the integration provider owns the new
                connection. It is available for both the provider's account and the integration
                customer's managed workspace. The integration customer may also create their own
                connection for use by their account, including any workspaces managed by the
                integration provider.

            Note: The properties or details of a
                connection may vary, for example, based on the authorization method employed by the
                API of the connected product or application.

## Managing Connections

You can manage your
                connections by selecting it from the ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity page or the ![connectors icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/40226ac9-8020-4722-8766-d9586b0879c5.svg) Connectors tab within a workspace.

To manage a
                connection being used on your workspace, select the connection name.

When
                viewing a connection from within a workspace, the Connection Details panel
                displays.

The preferences (gear) icon on this
                view includes options to Change Connection or
                    Remove Connection from the integrations in the
                workspace.

Select Manage to display the connection
                details in your account.

The Connection page displays
                the connection name, the connector it enables, and its connection details.
                Connection details may include properties like the URL of an API or the type of
                authentication employed by the connector. Private fields such as API keys or user
                passwords are only viewable and editable by the user who owns or initially prepared
                the connection. The sidebar displays connection activity and usage details,
                including the workspaces and accounts that use the connection.

You can connect, disconnect, or test the connection from the
                connection details page. Testing the connection leverages whatever method the
                connector builder chose to confirm its authentication credentials. Disconnecting a
                connection deactivates it for all the workspaces in the right pane using that
                connection. Selecting Connect connects it to all the workspaces listed in the right
                pane using the connection.

                Note: For security reasons, deleting a connection is not
                    recoverable.
