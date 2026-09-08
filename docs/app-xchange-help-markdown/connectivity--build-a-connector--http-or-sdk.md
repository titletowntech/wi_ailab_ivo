# HTTP or SDK

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/http-or-sdk
> Captured directly from rendered HTML: 2026-08-14

Choosing an appropriate connection method is crucial to
        building efficient and effective integrations. Consider the strengths of the HTTP connector
        and Connector Software Development Kit (SDK) to decide which is best for your specific
        integration.

## Why Use the HTTP Connector

The HTTP connector is a simpler, more direct way to integrate with external
                systems via their HTTP-based APIs. It is particularly useful for proof of concepts
                and lightweight integrations.

- Minimal Technical
                              Requirements

  The HTTP connector is ideal for users with
                          minimal development experience. It vastly reduces the effort involved in
                          setting up an integration.
- Ideal for Simple
                              Integrations

  The HTTP connector is great for straightforward
                          integrations such as creating invoices in accounting systems or retrieving
                          metrics from analytics applications.
- Prebuilt
                              Connector

  Because the HTTP connector is prebuilt, it can
                          be used to build integrations with any system with internet-accessible APIs,
                          even if they do not already have a connector.
- Quickly Implement
                              a Proof of Concept

  The HTTP connector provides a fast and
                          straightforward approach to demonstrate the feasibility of an
                          integration.
- Fast and Efficient
                              Data Integration

  The HTTP Connector is the fastest and most
                          efficient way to integrate data, especially when the integration
                          requirements are straightforward.

## Why Use the SDK

The [SDK](https://trimble-xchange.github.io/connector-docs/) offers a comprehensive and flexible
                framework for advanced use cases such as handling rate limits, advanced data
                filtering, and creating complex data relationships. If you need any of the following
                features, see [Why Build a Connector?](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/connector-building-faq#concept-2d0558b4-b1d4-447f-af2a-c23efe2020d2--en__why_build_a_connector).

- Rate Limiting Issues

  The SDK often includes built-in mechanisms to handle rate limits
                          imposed by the API, ensuring smooth operation even under constraints.
                          Additionally, it leverages a middle layer (the cache layer) provided by our
                          platform. This reduces the need to call the API every time a flow runs,
                          further optimizing performance and reliability.
- Advanced-Data
                              Filtering

  The SDK offers additional filtering capabilities
                          beyond those natively supported by the API. This allows you to perform
                          complex functions like looking up a specific employee rather than retrieving
                          all employees every time.
- Retrieve Cached
                              Information

  The SDK can provide access to cached information
                          in a target system, enhancing the performance and reliability of
                          integrations. This is also useful for debugging purposes.
- Create
                              Relationships Between Data

  The SDK makes it straightforward to create and
                          manage relationships between different datasets.
- Work
                          Requests

  The SDK supports the use of work requests,
                          offering added functionality for many integrations.
- Trigger
                              Support

  The SDK is better suited for use cases that
                          require trigger support to react to specific system events.
- Productizing the
                              Integration

  The SDK offers a more robust and scalable
                          framework for development and deployment.
- Supports
                              Non-Standard Authentication

  The SDK supports non-standard authentication
                          methods, while the HTTP connector does not.
- Additional
                              Capabilities

  The SDK supports some capabilities not yet
                          supported by the HTTP connector. These include pagination, cache writing,
                          redefining calls, type safety, file support, and trigger support.
