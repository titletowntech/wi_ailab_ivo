# Map Configurations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations/map-configurations
> Captured directly from rendered HTML: 2026-08-14

Configuration mapping is when you point an integration configuration to a flow configuration to associate the two.

Values you assign to the integration configurations
      will be passed to their mapped flow configuration values. This makes it easier to set up
      configuration values once, and then use them in other flows as needed.

An integration configuration can be mapped to multiple flow
      configurations, but a flow configuration can only be mapped to one integration configuration.
      The mapping process is different depending on if you add one flow or multiple flows at a time.

- Add a single flow to your
              integration: Configuration mapping is a step in the process for adding the
            flow. You must map all configurations in order to add the flow to the integration. Either
            map to an existing integration configuration, or create new integration configurations as
            needed.
- Add multiple flows at a time
              to your integration: You will need to map the configurations after you add
            the flows to the integration. If you do not map your configurations (especially required
            configurations), this may cause issues when syncing the integration.

## Map Flow Configurations When Adding Flows to an Integration

Follow these instructions to map flow configurations when adding flows to an integration.

    Your use
            account must have Integration
                Author permissions to complete this task.
1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab.
2. Select the feature you want to add a flow to.
3. In the Flows section, select Add Flow.
4. Select Add Existing and choose one or more shared flows from the list.
5. Select Next. The Configuration Mapping page opens.
6. For each flow configuration, choose an integration configuration from the dropdown list. Alternatively, enter a title in the New Config Title field and select + to add a new integration configuration.
       Note: You must map all configurations before you can add the flow to the integration.
7. Select Next and confirm the configuration mappings are correctly listed.
8. Select Save.

The flows are added to the integration and their configurations are
    mapped.

## Map Flow Configurations After Adding Multiple Flows to the Integration

Follow these steps to map flow configurations to an existing integration.

  Your use
            account must have Integration
                Author permissions to complete this task.
1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab.
2. Select an unmapped flow. The flow opens.
       Note: Unmapped flows are identified with an Unmapped tag.
3. Select Manage Configurations and open the configuration details for the unmapped configuration.
4. At the bottom of the configuration details in the Integration Configuration Mapping section, select an integration configuration or enter a new one.
5. Select Save.

The flow configurations are mapped.

## Unmap Flow Configurations

There are two ways to unmap flow configurations: through
        the Integration Builder Configuration page or directly within the flow.

        Your use
            account must have Integration
                Author permissions to complete this task.

Unmap a Flow Configuration from the Integration Builder

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the ![Configuration flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/33523dc7-51ad-43a2-af15-2ee85e53bbf7.svg) Configuration tab.
2. Select Mappings.
3. Repeat the following steps for each flow to which the configuration is mapped.

  1. Select the flow.
                            The Manage
                                    Configurations window opens.
  2. If the configuration is not used by the published flow, select the configuration and select Delete.
  3. If the configuration is used by the published flow, map it to a different integration configuration.
4. Select Save.
5. Select Save and Deploy to Staging to save these changes.

  The flow configurations are unmapped.

Unmap a Flow Configuration Directly from the Flow

1. Repeat the following steps for each flow to which the configuration is
                      mapped.

  1. Open a flow with the configuration you want to unmap.
  2. Select Manage Configurations and open the
                                details for the configuration.
  3. If the configuration is not being used by the published flow, select
                                    Delete.
  4. If the configuration is being used by the published flow, map it to a
                                different integration configuration.
2. Select Save.
3. Select Save and Deploy to Staging to save these
                      changes.
                  The flow configurations are unmapped.

You can verify this by opening ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and checking the ![Configuration flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/33523dc7-51ad-43a2-af15-2ee85e53bbf7.svg) Configuration tab. Select the configuration and verify that the Mappings tab is grayed out. This
                means all configurations are unmapped.
