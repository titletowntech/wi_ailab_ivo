# Set Up Integration Configurations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations
> Captured directly from rendered HTML: 2026-08-14

Configurations allow you to define properties and values that you can reuse across flows. When setting up your integration, create these configurations in the integration builder, then add and map them to flows. Use configuration keys when writing flow steps to reference their predefined values.

        Your use
            account must have Integration
                Author permissions to complete this task.

Add Integration Configurations

1. Open the integration where you want to add a configuration and navigate to the Configuration page.
2. Select the ![Configuration flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/33523dc7-51ad-43a2-af15-2ee85e53bbf7.svg) Configuration tab.
                  The Configuration page
                      opens.
3. Select Add Configuration and fill in the fields:

  - Key: Required.
                                The name of the configuration that authors will enter in the flow
                                fields: flow.config.key This value will be converted to
                                camelCase before being saved.

    Example: flow.config.projectSightPortfolioId
  - Title: A
                                descriptive name for the configuration.
  - Description:
                                Additional details about the configuration to explain how it is used.
  - Required:
                                Select this checkbox to require the user to enter a value.
  - Type: Identify
                                the data type. Choose from: text, multiple text items, decimal, multiple
                                decimals, integer, multiple integers, or true or false.
  - Default: Enter
                                the default value for this configuration. When you add the configuration
                                key to a flow, this value will auto-populate in the field.
  - Validation:
                                Enter a Regular Expression (RegEx) that the input must match.
  - Options: Enter
                                a different value per line that a user can choose from. If provided, the
                                user will be able to select one of the provided options instead of
                                freely typing in any value.

                  Note: After saving a configuration, you cannot change the Key or Type.
4. Select Save.
                  You can use this configuration in your integration, flows, and any
                      workspaces synced with that integration definition. For information about flow
                      configurations, see Use Configurations in Flows.

Edit an Integration Configuration

1. Open the integration where you want to add a
                      configuration and navigate to the Configuration page.
2. Select the ![Configuration flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/33523dc7-51ad-43a2-af15-2ee85e53bbf7.svg) Configuration tab.

                      Note: Make all configuration edits
                          from the Configuration page within the integration builder.

                  The Configuration page
                      opens.
3. Select the configuration you want to edit and update the fields. For a list of
                      the edits and changes you can make to configurations, see Manage Configurations.
4. Select Save.

Delete a Configuration

1. Unmap the configuration from all flows to which it
                      is mapped. For more information, see [Unmap Flow Configurations](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations/map-configurations#task-609d9b2a-8968-4f6f-ba45-c3b049c0d015--en).

                      Note: A configuration can only be deleted if it is not
                          mapped to any flow configurations.
2. On the ![Configuration flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/33523dc7-51ad-43a2-af15-2ee85e53bbf7.svg) Configuration tab of the integration, select the configuration you want to remove.
3. Select Delete, and confirm your deletion.
