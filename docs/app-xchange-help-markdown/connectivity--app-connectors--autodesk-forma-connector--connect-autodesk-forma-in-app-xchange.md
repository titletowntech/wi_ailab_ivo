# Connect Autodesk Forma in App Xchange

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-connectors/autodesk-forma-connector/connect-autodesk-forma-in-app-xchange
> Captured directly from rendered HTML: 2026-08-14

Before you can use Autodesk with App Xchange, follow these steps.

        This task must be completed by an administrator of an
            Autodesk team that has an active APS subscription.
            Note: These instructions assume a new setup under the APS
                Developer Hub System. If you need to migrate an older setup from before February 18,
                2026, follow these instructions from Autodesk: [Create a Developer Hub and Migrate Your
                    Applications](https://aps.autodesk.com/blog/how-create-developer-hub-and-migrate-your-applications).

1. [Create an App](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/). Choose
                          Traditional Web App (most flexible) and enter
                          https://api.xchange.trimble.com/app-builder/v1/oauth/authenticate/callback
                      in the Callback URL
                      field.
                  Record your Client ID and Client Secret
                      for later.
2. [Manage API Access to Forma Services](https://aps.autodesk.com/en/docs/acc/v1/tutorials/getting-started/).
                      Populate the mandatory fields as follows.

  - APS Client ID: Enter the Client ID from the APS
                                registration.
  - Custom integration name: Enter an integration
                                name. The recommended format is XChange [integration
                                    target].
3. Enter
                                  the connector details in App Xchange.Connection
                          DetailsNote: Choose the Scoped
                              by Project option to limit the workspace to the provided
                          Project ID, if any.
  - Name: Enter a
                                    descriptive name for your connection.
  - OAuth Client:
                                    Select the appropriate OAuth Client from the dropdown.
                                    Alternatively, create a new OAuth Client using the OAuth2CodeFlow
                                    connection definition. For instructions on creating a new OAuth
                                    Client, see [Create an OAuth Client](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/oauth-clients#task-bc7f2072-9989-42f9-9988-ebce8d8eba05--en).

    - Name:
                                              Enter a descriptive name for your OAuth client.
    - Connection
                                              Definition: Select the OAuth2CodeFlow option to enable both
                                          authorization code and client credentials authentication. The
                                          connector will use the appropriate type on a per-endpoint
                                          basis.
    - Client
                                              ID: Enter your Client ID from step 1.
    - Client
                                                  Secret: Enter your Client Secret from step
                                              1.
    - Authorization
                                                  URL:
                                                  https://developer.api.autodesk.com/authentication/v2/authorize
    - Token
                                              URL:
                                                  https://developer.api.autodesk.com/authentication/v2/token
    - Refresh
                                                  URL:
                                                  https://developer.api.autodesk.com/authentication/v2/token
    - Scope:
                                              data:read data:write data:create account:read
                                              account:write

      For information about the scope
                                              requirements for different endpoints, see [AutoDesk Platform
                                                  Services API Basics](https://aps.autodesk.com/en/docs/data/v2/developers_guide/basics/#authentication-and-scopes).
    - Client
                                                  authentication: Select Basic auth
                                                  header.
  - Connection
                                        Environment: Select the appropriate connection
                                    environment from the dropdown.
  - Region: Enter the
                                    region to which your request should be routed. For example, *US*, *EMEA*, or *AUS*.
  - Account: Enter
                                    the ID of the Autodesk Forma account that contains the project being
                                    created or the projects being retrieved.

    For instructions on finding this, see [Where to find the Forma for
                                        Construction account ID](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Where-to-find-the-Autodesk-Construction-Cloud-Account-ID.html) at Autodesk Support.
  - Project ID: (Optional) Enter the project identifier
                                    if you want the workspace to work only in the context of that
                                    project.
