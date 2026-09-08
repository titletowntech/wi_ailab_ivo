# Integrations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations
> Captured directly from rendered HTML: 2026-08-14

An integration is a package of the resources needed to move
        data from one external system to another. It is a reusable component that users can create
        or purchase to control how they move data between systems.

Integrations can be used for different functions across multiple workspaces.
            Integration builders can create new integrations to enable new data transfer
            possibilities for customers.Note: Integrations cannot be changed across source regions. For example, an integration
                built in the United States version of App Xchange cannot be modified within the Australia
                version.

## Integration Components

An integration is comprised of the following components.

                Connectors

Connectors communicate and exchange data between the
                                external system and the App Xchange platform in an integration.

For
                            more information, see [Connectors](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors).Features

Features are a set of functionalities that a
                                customer can enable or disable based on the requirements for their
                                integration. The feature groups the functionalities with the ways
                                that customers use the integration.

Each feature represents a different set of
                                functionalities. For example, the ProjectSight <> Vista integration has a feature for each
                                type of data it can move between systems. The Budgets feature is for
                                moving budget items between the two systems, the Job Costs feature
                                is for moving job cost data, and so on.

Standalone, reusable features provide the best
                                integration building experience, since they help avoid dependencies,
                                offer more granular control of integration functions, and allow for
                                each feature to be independently updated. They also provide the best
                                customer experience, as a given customer may want to activate only
                                some of these features depending on the functionality that they want
                                in their integration.

For instructions on adding features to an
                                integration, see [Add Features](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features).

                        Services

Services are added to a feature and are specific
                                to a particular connector. Services identify how data will move
                                between systems. You can configure a service and even make it into a
                                template for customization across different workspaces.

For more information, see [Services](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services).

                        Configurations

Configurations (configs) allow for customization
                                of each integration to fit the unique needs of each customer. For
                                example, configurable components could include support email
                                addresses, or specific data table names in a third-party system.
                                Integration configs are mapped to flow configs.

                        Jobs /
                                Schedules

Jobs are a way to group flows/services and run
                                them on a specific schedule. Jobs allow for grouping cache writers
                                and action processors. You can set the sequence of flows/services
                                within a particular job to dictate the order that they complete.

                        Activity Log

The activity log is a record of all the changes
                                that were made to an integration.

For more information, see [Integration Activity Log](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-activity-log).

                        Workspaces

Workspaces are where data is stored. The
                                integration builder houses the integration definition, but the
                                workspace is where that integration moves data. An integration must
                                be registered to a workspace to move data—this means syncing the
                                integration definition with a particular workspace.

For more information, see [Workspaces](https://help.trimble.com/doc/app-xchange/app-xchange/administration/workspaces).
