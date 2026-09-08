# HTTP Connector

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/http-connector
> Captured directly from rendered HTML: 2026-08-14

The HTTP connector enables direct interaction with API
        endpoints not connected to the App Xchange ecosystem via a dedicated connector.

This connector is a simple, universal way to handle data. It is ideal for users
            lacking development experience. Using App Xchange's low-code flow builder, users can
            easily create a flow with basic GET, POST, PUT, PATCH, or DELETE requests to API
            endpoints.

This capability offers an alternative path to bringing data to and from the
            platform, which is useful when developing a connector is not feasible.

## Use Cases

The HTTP connector provides benefits to the following user types.

Integration or Flow Author

The HTTP connector enables direct transactions with the API endpoints of products
                that do not yet have a dedicated connector on App Xchange, unblocking critical
                integrations with these applications.

If building an integration with a product that offers API endpoints for certain data
                entities or actions not yet included in that product's dedicated app connector, the
                HTTP connector allows you to easily incorporate them.

Connector Builder

The HTTP connector can be used as an alternative to App Xchange’s Software
                Development Kit (SDK) when building connections.

See [HTTP or SDK](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/http-or-sdk) for a detailed comparison of the
                strengths of each connection method.

## User Access

The HTTP connector enables integration with products and applications by
                transacting directly with the API endpoints they provide. Each product will offer
                different pathways for user and developer access.

## Engagement and Training

The HTTP connector enables integration with many products and applications,
                each of which may provide different channels for user engagement and training.

## Technical Documentation

The HTTP connector enables direct transaction with HTTP endpoints for many
                products, including applications with no dedicated connector on the App Xchange
                platform. HTTP API documentation can be provided in many formats depending on the
                API being used. This includes [OpenAPI descriptions](https://www.openapis.org/) and [Postman collections](https://www.postman.com/collection/).

## Connection in App Xchange

Navigate to Workspace > Integrations, select Add Connection next to this connector.
                Select a connection type from API Key Auth, Basic Auth, OAuth 2.0 Client
                Credentials, or Oauth 2.0 Code Flow. The required connection details vary based on
                which type you select. Each field is explained below.

- Name: Enter a distinct name to identify this connector.
- OAuth Client: Enter the OAuth client used by your
                          authorization server.
- Base Url: Enter the root URL for the HTTP service, including
                          the protocol (HTTP/HTTPS). For example, *https://api.example.com*.
- Api Key: Enter the API key provided by your API service.
- Api Key Header: Enter the name of the header where the API
                          key should be included in your API requests.
- Username: Enter the username required for
                          authentication.
- Password: Enter the corresponding password for the
                          username.
- Connection Test Endpoint: Enter the relative path for the
                          endpoint that will be used to test the connection. This path should return
                          an HTTP status code to confirm the connection. For example,
                              */status/check*.
- Test Result Status Code: Enter the HTTP status code that
                          indicates a successful connection. This is usually 200.

## Additional Configuration

- Real-time Action Processing: This feature
                          should always be enabled for optimal performance. Only disable it if you are
                          advised to do so by support.

## How to Use in a Flow

See [Use HTTP in a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/http-connector/use-http-in-a-flow) for information about
                configuring flow step details for this connector.

## User Support

If you
                                encounter a problem or need support for this connector, [create an App Xchange
                                        product case](https://help.trimble.com/doc/app-xchange/app-xchange/app-xchange-support) through the Trimble Support
                        Center.
