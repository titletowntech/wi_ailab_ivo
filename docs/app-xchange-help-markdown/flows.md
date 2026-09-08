# Flows

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows
> Captured directly from rendered HTML: 2026-08-14

Flows define the data transfers between connectors on the
            App Xchange platform. In other words, a
        flow moves data.

A flow is one of the most important components of an integration, as it uses a
            series of triggers, steps, and flow configurations to make all the critical business
            decisions and data transformations. Flows can be shared, called, or templated to use
            across integrations in your workspace.

For instructions on adding a flow to an integration feature,
            see [Add Flows to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-flows-to-a-feature).

While flows are written in JSON, most flow authors will create flows
            using App Xchange’s flow builder, a
            low-code JavaScript environment that simplifies the flow-writing process. Your account
            must have the flow author role to create a flow.

        Note: Each unique flow name can only be used
            once per workspace. If an identically-named unmanaged flow already exists in the
            workspace, you may encounter an unspecified error when trying to promote an integration
            flow.

## Required Flow Components

Each flow must have
                a trigger and at least one flow step to run.

Trigger

Flows must have an entry point, which is called the trigger. A
                trigger starts the flow. Each flow requires one trigger.

For example, the most common type of trigger is a Cache Event,
                which starts a flow when there is a Create, Update, or Delete of the connector's
                data object. For more information, see [Triggers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers).

Flow Steps

After the trigger, a flow requires a series of steps to
                accomplish different tasks. There are many different types of flow steps, which you
                can combine to define business decisions in the integration. To add flow steps,
                select the Plus signs. For
                more details, see [Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps).

## Additional
                Flow Components

Outside the required
                components, see [Best Practices for Flow Design](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/best-practices-for-flow-design) for additional aspects that are useful to anyone
                building a flow.

Additionally, you can also use
                the following features to help you when building a flow.

View Saved Versions of the
                    Flow

Choose a version from the dropdown
                list to see previous interactions of a flow. For more information, see [Flow History](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/flow-history).

Define the Flow
                Configuration

Define the flow configuration for
                different instances of the flow. Select Define Configuration. For more
                details, see [Using Configurations in Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/using-configurations-in-flows).

Enter
                    Configuration Values

After you define the
                flow configuration, input configuration values for that specific flow instance. You
                can only edit configuration values here if the flow is not managed by an
                integration.

View Flow Run
                    History

From the Runs tab, see the history of the
                flow runs. Here you can also see the version number of the flow for every run, which
                you can also look up in the revision history. For more details, see [Flow Runs Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab).

View Additional Flow Data

From the Data
                tab, look up cache objects or actions that the flow might interact with.
                You can search by triggers, lookups, or actions for that flow. For more details, see
                    [Flow Data Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-data-tab).

View Registrations

From the Registrations tab, you can view workspaces in which this flow is
                registered. For more information, see [Flow Registrations Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-registrations-tab).
