# Connector Building FAQ

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/connector-building-faq
> Captured directly from rendered HTML: 2026-08-14

Find the answers to common questions about the feasibility and
        logistics of building a custom connector.

## Why Build a Connector?

A connector is necessary for App Xchange to read and write from a target
                system. Deploying a connector on App Xchange instead of using one of the public connectors enables
                the development of pre-built integrations on top of it that may cover a variety of
                common use cases. Building your own connector has several advantages over the HTTP
                connector, which are covered in [HTTP or SDK](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/http-or-sdk). Once your connector is ready, you can
                reuse it to build integrations with any of our existing public connectors.

## What is App Xchange's Pricing Model for Connectors?

There is no extra direct cost for the end user to leverage a standard
                connector on the platform.

In App Xchange for Products, which is typically used by technology company
                developers building integration products for their users, there is a limit to the
                number of connectors non-enterprise users can leverage per integration. This is a
                pricing tier for the platform not directly tied to any individual connector. This
                limit does not apply to App Xchange for Contractors, typically purchased by end
                users building their own custom integrations.

If there is a cost to use the connected product or API, you must pay that
                directly to the product developer. (not in App Xchange). You can then enter any
                necessary credentials for the connector on App Xchange.

## How To Evaluate the Revenue Potential of Building a Connector?

Even if a product or application enables direct integration capabilities,
                for example by providing an API, typically only developers can leverage it, and they
                will need to invest in building custom logic to achieve the integrations needed.
                This may be a barrier to adoption for potential users, which can be difficult to
                quantify accurately.

It may be useful to evaluate the demand for a connector by performing any
                of the following exercises:

- Interview current users with custom-built direct integrations
                          (e.g., leveraging an API directly) to weigh their interest in using the
                          connector (for example, if they'd prefer not to continue investing in the
                          current development effort).
- Evaluate the cost, if any, of building integrations on behalf of
                          existing users who cannot develop their own.
- Analyze user behavior to determine if churn or attrition is due in
                          any part to the cost (or lack of) integration paths available.
- Perform an analysis of products with complementary features or data
                          to evaluate if a connector may provide an adoption path of benefit to them
                          or their users.

In general, the most-used features of a product can be identified based on
                current usage patterns, log data, and user engagement or feedback. This data can be
                leveraged to better understand what kinds of integration are in demand. By focusing
                on these when building a connector, broader adoption can be enabled with lower
                initial development effort, thereby maximizing earning potential.

It is difficult to quantify this in general terms, as the data will vary
                widely between products or applications.

By focusing early development on targeted integrations and prioritizing the
                most in-demand features, the investment to build a connector can be effectively
                managed while beginning to collect initial data on its usage by early adopters on
                which to base enhancements later if needed.

In addition, by enabling new custom or pre-built integrations on the
                platform, long-term adoption of the connected product or application will be
                encouraged.

## What is the Estimated Level of Effort to Build a Connector?

The level of effort involved in building a connector
                largely depends on the complexity of the application and the integrations the
                connector will enable. That can be evaluated in many ways and mitigated by
                prioritizing the most in-demand features needed. Additionally, building a connector
                requires intermediate C# development skills, as described in the [SDK Connector documentation](https://trimble-xchange.github.io/connector-docs/). If you have never opened C# before, you may want to consider a third party contractor. App Xchange is still there to assist every step of the way.

Building a connector includes three phases of work:

1. Initial onboarding: The App Xchange team engages directly with new
                          teams to prepare any needed components and provide initial direction.
2. Build as needed for integration use cases: This will depend on the
                          integrations to be enabled and may involve continued engagement with the App
                          Xchange team on platform capabilities and documentation.
3. Deploying to production: Connector code can be submitted at any time via the provided tooling, with expansions and iterations expected as you develop.
