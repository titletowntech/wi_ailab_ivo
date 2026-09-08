# Best Practices for Integration Building

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/best-practices-for-integration-building
> Captured directly from rendered HTML: 2026-08-14

The best practices for integration building include building with a purpose, organizing a flow for easy maintenance, and offering support for your integration.

To avoid having to redo work, ensure you use the builder and sync tools to develop, not your development workspace.

## Integration Purpose

            Functional Requirements Met

Verify that the integration addresses the entire scope
                            as defined by the integration definition. Object mappings called out in
                            the Integration Product Scope section are achieved.

                    All Processing Scenarios Result in Intended Business Outcome or Messaging

Clearly define execution outcomes. Well-thought-out
                            and communicated execution outcomes will result in an integration that
                            is easier to onboard, support and maintain. Communicating both the
                            expected output and failed or terminated execution is critical to those
                            supporting the integration, and therefore should be handled with intent.

## Maintenance and Organization

                Features

Features should be broken up in a manner that best
                                supports sales and onboarding. It is common to have core flows and
                                services that will always be sold with the integration. Often those
                                are grouped together with optional flows grouped separately so they
                                can be activated separately. You can also consider splitting up
                                flows based on the directionality of the data.

                        ConfigurationsConfigurations should have descriptive titles and
                                descriptions. Use groups to combine configurations by feature or
                                connector.
                        FlowsEach feature contains the flows necessary to
                                perform its function. If a flow is shared by multiple features, add
                                it to each feature as App Xchange will only add the flow once to a
                                workspace regardless of how many features use it.
                        ServicesEach feature contains the services necessary to perform its function. If a
                            service is shared by multiple features, add it to each feature as
                                App Xchange will only
                            add the service once to a workspace regardless of how many features use
                            it. SchedulesCadence is appropriate based on the services and flows contained in the
                            schedule. The schedule name should focus on its action, not the
                            frequency (for example, Data for Sync).

## Support

            Document Configurations And
                            Features

This is an expansion of what is documented in the integration design
                            template discussed during onboarding.

Configurations should be documented for how they are expected to be used,
                            where the information for the value should come from, and if they are
                            required. For example, take the perspective of training a new support
                            person. What would you want them to know, and what information would set
                            them up for success?

Feature documentation should inform what the feature does, how it’s meant
                            to be used, and how it ties into the integration as a whole.

                    Onboarding
                            DocumentationThe onboarding documentation is meant as a playbook of sorts for an
                        implementation consultant. This could include a step-by-step process,
                        feature dependencies, or order of operations. It is often necessary when
                        onboarding to run schedules and cache writes to seed data, and the order of
                        cache writing data matters. This is the place to call out those issues.
                    Support
                            DocumentationThe support documentation is meant for post go-live support of your
                        customers. Common support issues and resolutions should be documented here
                        to set up your support department for success. Consistent Patterns and Naming Conventions Used
                        Use consistent naming patterns throughout your
                            integration. This will enhance the readability and supportability of
                            your product. Flows and steps allow many characters and even emojis.
- Flows:

  Consider naming flows with the
                                          convention <feature><source
                                              system><source object><operation> to
                                              <target system><target
                                              object><operation> to identify how
                                          the data is being moved at a quick glance. For example:
                                              erpCompanies : Vista HQ Company Parameters
                                              (CUD) to ProjectSight Erp Companies
                                          (CUD)

  If you have many flows with lengthy
                                          names, the flow list will look like a wall of text and make
                                          it difficult to find what you are looking for.
- Steps:

  Consider naming steps with the
                                          convention <action><system><object>
                                          (Lookup Vista Job or Update Vista Employee). Avoid shorthand
                                          if possible. Steps are referenced by the Step ID visible
                                          below each step name. The flow tooling will auto-generate
                                          the unique ID.
- Outcome
                                          Messages:

  Consistent
                                          formatting of success and failure messages makes it easier
                                          to support an integration. Consider the target of your
                                          messaging as well. More technical messages are fine for
                                          internal users or Support teams, but probably not as helpful
                                          if your integration is used by a customer.
