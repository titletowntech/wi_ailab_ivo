# Pre-Development Considerations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/pre-development-considerations
> Captured directly from rendered HTML: 2026-08-14

This topic outlines the prerequisites for developing a
        connector for the App Xchange platform, including API requirements, authentication methods,
        and data strategy considerations.

## What Do I Need to Build a Connector?

You need intermediate C# development skills and a suitable API. The
                connector can be thought of in part as an API client, in which the API endpoints
                correlate to the data objects and actions that will be defined in the connector and
                thereby made available to integrations and flows on the platform.

## API Evaluation

Performing an API evaluation before developing a connector will help
                determine if an existing API is fit to build a connector or needs enhancement before
                connector development may begin. If developing a new API for a product, this
                exercise can provide an inventory of the API endpoints and methods that must be
                developed. Please email [xchange_build@trimble.com](https://help.trimble.com/doc/app-xchange/app-xchange) if you need assistance
                performing an API evaluation, or have a non-supported API you want us to support.

The following guide qill help you determine whether a target system falls into an easy, hard, or impossible category for building against.

## API Type

We recommend building connectors using HTTP or REST APIs for optimal
                compatibility. If your project requires a different API type, please email [xchange_build@trimble.com](https://help.trimble.com/doc/app-xchange/app-xchange) to discuss feature compatibility. You will
                need a plan to provide equivalent functionality for the features below.

## Authentication

App Xchange integrations depend on executing flows on behalf of users
                without their direct intervention. Therefore, non-interactive API authentication is
                preferred. The following authentication types are well supported, but custom
                authentication types are possible.

- [API Key](https://en.wikipedia.org/wiki/API_key)
- [HTTP Basic](https://en.wikipedia.org/wiki/Basic_access_authentication)
- OAuth 2.0

  - [Client Credentials](https://oauth.net/2/grant-types/client-credentials/)
  - [Authorization Code](https://oauth.net/2/grant-types/authorization-code/)
  - [Password](https://oauth.net/2/grant-types/password/)

## Documentation

[OpenAPI](https://github.com/OAI/OpenAPI-Specification) Specification version 3.0 or later is preferred
                for HTTP/REST API documentation, but it is not a building requirement for a
                connector on App Xchange. It facilitates an informed evaluation of the API a
                connector will leverage. The better the target system documentation, or your understanding thereof, is, the easier connector building will be.

The connector SDK will automatically prepare OpenAPI documentation for the
                connector API (not to be confused with the API of the connected product or
                application). This documentation will be available to users building integrations
                with the connector.

## Endpoints

The API should include [endpoints](https://blog.postman.com/what-is-an-api-endpoint/) and HTTP verbs (or
                methods) correlating to the resources (data objects) and operations (actions) needed
                to build integrations with the connected product or application.

For example, if an integration depends on the ability to get a list of
                projects from a backend database, a GET /projects endpoint would likely be needed.
                To get data on an individual project, an endpoint like GET /projects/{id} could be
                used. POST, PATCH, PUT, and DELETE operations are typically needed for creating,
                updating, and deleting entries.

In practice, this is a matter of evaluating the integrations for which a
                connector will be used and confirming if the API facilitates them. The connector may
                provide initial use cases and can be expanded upon later as needed.

Connectors and App Xchange integrations always orchestrate data movement. That means there are not open endpoints for you to "push" data toApp Xchange, the connector must be able to GET the needed data from the target system. Confirm that you can GET from and POST to the target system, or, if building against your own API, consider adding those endpoints.

We recommend preparing a list of these data objects to
                confirm any necessary endpoints and methods exist before developing the connector.
                See [Best Practices for Integration Design](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/best-practices-for-integration-design) for a more in-depth explanation of how to approach building integrations on the
                    App Xchange platform.

## Filtering and Pagination

The API endpoints should include any parameters needed to filter or edit
                the data being queried or created. These parameters improve performance, but is not a requirement. In particular, filtering should include the
                ability to query for changed data based on a date or time frame and pagination to
                limit the amount of data transferred per call.

## Data Strategy

Before developing a connector, you should have an
                initial use case. The App Xchange team
                wants to confirm your intentions before deploying. While your actual connector
                should be agnostic to eventual integrations, a minimum viable product state should
                support actual business use, as the connector can be extended later to provide new
                data and capabilities.

To that end, avoid hard coding values or data mapping. Good choices have
                data objects and actions that closely map to your API and are as general as
                possible.

Your design should avoid breaking changes even in the development and testing
                phases. A breaking change occurs when the schema changes in a way that results in
                any already existing payloads (like queued action steps) generating a payload that
                does not pass schema validation. Some examples of breaking changes include changing
                the module key, adding or changing required data object properties, changing (not
                adding to) the data object key, or removing object properties entirely. Therefore,
                you should proactively define required properties as early as possible to prevent the
                platform from generating incomplete data.

## Connector Requirements

App Xchange code approval focuses on safety and avoiding security and
                performance risks, not optimization or design. You are responsible for performing
                quality assurance on your connector and confirming that your connector design
                supports your business requirements.

Connectors that fail to meet minimum criteria will not be deployed.
                Connectors that deviate from best practices will require justification before
                deployment. See the [SDK Connector documentation](https://trimble-xchange.github.io/connector-docs/) for a complete
                list of the technical requirements for App Xchange platform deployment.
