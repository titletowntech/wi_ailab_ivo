# App Xchange for Products

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/app-xchange-for-products
> Captured directly from rendered HTML: 2026-08-14

Follow this strategic framework to design, build, and
        launch seamless integrations within the App Xchange ecosystem.

Use these phases to align your development with our onboarding requirements
            and ensure a frictionless experience for your first customer.

## Design

Special consideration is needed when building an integration, as
                you must anticipate potential use cases and provide documentation and support. If
                any enhancements are needed, request them from App Xchange early.

Consult with an end user of the products or software to account for *actual* use
                cases and identify hidden human processing that might occur in current
                procedures.

For more information, see [Best Practices for Integration Design](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/best-practices-for-integration-design).

## Build

Use App Xchange's ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder to build your integrationg product from
                prebuilt resources. Because building an integration is an iterative process, you
                will likely jump between steps when first setting one up.

1. If necessary, create new connectors for your application
                          using the Connector SDK or set up the HTTP connector. For more information,
                          see [HTTP or SDK](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/http-or-sdk) and [Build a Connector](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/connector-building-faq). This requires a publicly
                          available API for your application, intermediate C# development skills, and
                          a well-thought-out integration design.
2. Create your integration using our integration builder at
                          the account level. For more information, see [Integration Builder](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder).
  - Add connectors.
  - Add a feature.
  - Add a cache write service.
  - Add a schedule.
                                        Note: Schedules aren't on the same page in
                                                ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder, but are logically
                                            related.
  - Add a flow.
  - Add configurations.
3. Sync your integration to your development workspace to
                          test your flows.
  - Activate the features.
  - Configure the connectors.
  - Perform an initial cache write.
  - Test and iterate.
  - Set the integration status.
  - Set the feature status.

## Launch

Before launching your first integration to the public, you must familiarize yourself
                with features and protocols that you may not have encountered during the design or
                build phase.

1. Review and exercise the customer deployment process.
  - Learn how connectivity is established to the target system.
  - Walk through the deployment tooling in a sandbox environment to
                                understand the UI flow.
2. Document the data security profile for your integration.
  - Identify exactly which tables and fields your integration needs to
                                access.
  - Understand what system-specific security features your customers need to
                                    configure.

    Consider the examples of Vista and
                                        Spectrum. In Vista, the customer must create a Vista Service
                                    User and configure Data Type Security. In Spectrum, the customer must set up an Info-Link
                                    user, configure Data Exchange, and enable specific Web
                                Services.
3. Develop and validate onboarding documentation to send to customers.
  - Set customer expectations with a clear, step-by-step roadmap of their
                                responsibilities (such as entering connection credentials).
  - Provide them steps to prepare their host system for integration.
  - Identify your audience. Multiple personas may need to participate in
                                preparing the customer system.
  - Link to the App Xchange
                                documentation where needed.
  - Peer-review this plan to ensure a non-technical user can follow your
                                instructions.
4. Optional: List your integration on Trimble Marketplace for enhanced
                      visibility and co-selling opportunities. For more information, see [List your Integration on Trimble Marketplace](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/list-your-integration-on-trimble-marketplace).

Once you've done the preparatory work to facilitate a successful launch (or if you've
                already launched an integration product), see [Onboarding Customer Checklist - App Xchange for Products](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/onboarding-customer-checklist---app-xchange-for-products).
