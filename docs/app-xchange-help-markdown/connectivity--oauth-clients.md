# OAuth Clients

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/oauth-clients
> Captured directly from rendered HTML: 2026-08-14

OAuth clients are a common way to facilitate a secure
        connection to external services. When you link an App Xchange connector to an external application that uses OAuth, the
        OAuth client provides the necessary credentials.

You can view your account's OAuth clients on the ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity by selecting the OAuth Clients tab. A table displays
            all available OAuth clients as well as the following information.

- Name: The name of the OAuth client.
- Connector: The connector for which the OAuth client is used.
- Connection definition: The type of OAuth connection being
                          used.
- Public: Indicates whether a client is publicly available to all
                      users on the platform who can access this connector. Using a public client saves
                      you the effort of creating your own. Public clients are provided by the
                      connector developer.Important: Do not make company or customer-specific clients
                          public.

You can use the search bar to find a specific client. Select
            any client name to configure it. Select the trash can icon to delete a
            client.

## Create an OAuth Client

Follow these steps to create an OAuth client if needed by any
        of the connections available in your workspace.

1. Select ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity then open the OAuth
                          Clients.
2. Select Create OAuth Client.
                  Alternatively, you can select this when creating a connection.
3. Select the connector for which the OAuth client is
                      used.
4. In the Name field, enter a
                      descriptive name.
5. In the Connection
                          definition field, select the appropriate connection definition.
                      The options available depend on the connector. Complete any fields that are
                      required by your connection definition type.

  These are the possible fields you may need to complete:

  - Client ID: Enter the unique
                                    identifier for your application.
  - Client secret: Enter the secret key
                                    used to authenticate your application.
  - Client secret
                                        expiration: If needed, enter the expiration date for
                                    your client credentials.
  - Authorization URL: Enter the URL
                                    where users are redirected to authorize your application's access to
                                    their data.
  - Token URL:
                                        https://id.trimble.com/oauth/token
                                    (default)
  - Refresh URL: Enter the URL used to
                                    obtain new access tokens using a refresh token.
  - Scope: If needed,
                                    enter a space-separated list of any permissions your application
                                    requests from the user.
  - Prompt: If
                                    needed, enter a space-separated list of any prompts used to control
                                    the user's interaction with the authorization server.
  - Client authentication: Select either
                                        Basic auth header or Client
                                        credentials body depending on how the API is
                                    configured.
  - Public: Enable
                                    this toggle if you want this client to be public.Note: You must be the
                                        connector owner to create a public client.Important: Do
                                        not make company or customer-specific clients public.
6. Select Save.
Your OAuth client is created. It is now available for
            use when connecting the chosen connector within your workspace.
