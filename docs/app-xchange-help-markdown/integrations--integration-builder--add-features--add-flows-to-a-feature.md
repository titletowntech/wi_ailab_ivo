# Add Flows to a Feature

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-flows-to-a-feature
> Captured directly from rendered HTML: 2026-08-14

After adding a feature, you can add a flow to it to define the
    data transfers between connectors in your integration. There are two ways to add a flow to an
    integration feature: create a new flow from scratch or select an existing shared flow that has
    already been created for your workspace. In most situations, you will create a new flow.

    Your use
            account must have Integration
                Author permissions to complete this task.

Create a New Flow

Follow these steps to create a new flow for a feature.

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the appropriate integration.
2. Select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab and open the feature you want to add a flow
            to.
3. In the Flows section, select Add Flow.
4. Select Create New and populate the following fields:

  1. Enter a Name for the flow.
  2. Select Next. If you already have configurations set up for your integration,
                  choose from the list.
  3. Select Next.
5. Review and select Save.
6. Navigate to your workspace, select the ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows tab, and select the flow to start building it or make additional edits.
          For instructons, see [Creating a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow).Note: Flows default to Active on Sync, which means the flow automatically switches to Active
              when the feature is set to Active. Toggle this option off if you do not want the flow to
              automatically activate.

Add an Existing Flow

Follow these steps to add an existing flow to a feature.

The flow must have a Main version and *not* be marked
            Private.

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the appropriate integration.
2. Select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab and open the feature you want to add a flow
            to.
3. In the Flows section, select Add Flow.
4. Select Add
              Existing.
          A list displays all shared flows already created
            for your workspace. These flows are visible to other workspaces and integrations. Note: For existing flows with configurations, you
              must map these configurations to the integration when adding the flow.
5. Choose one or more shared flows from the list.
6. Select Next.
          The Configuration Mapping page opens.
7. If you selected a flow with a configuration, choose an
            integration configuration from the dropdown list or enter a title in the New config title field and select the
              plus icon to add a new
            integration configuration.

            Note: If you selected multiple flows that
              require integration mapping, you must map the configurations in another window. For more
              information, see [Map Flow Configurations After Adding Multiple Flows to the Integration](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations/map-configurations#task-a09f5a6b-06e9-48ad-9b96-c2034c131015--en).
8. Select Next.
          The Review page opens.
9. Select Save.

  The flow is added to the integration feature, and its configurations are mapped.
If you have set up an integration and added at least
      one feature with at least one service and flow, you can sync the integration definition to
      your development workspace for testing. Alternatively, you can continue setting up components
      such as [Integration Configurations.](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations)
