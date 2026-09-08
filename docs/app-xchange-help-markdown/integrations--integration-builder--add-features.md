# Add Features

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features
> Captured directly from rendered HTML: 2026-08-14

When building an integration, it is best practice to create unique features for each of
  the integration's individual functions.

    Your use
            account must have Integration
                Author permissions to complete this task.For more information, see [Integration Components](https://help.trimble.com/doc/app-xchange/app-xchange/integrations#concept-066069b6-42b2-4a5b-a003-33d9a409141f--en__integration_components_section). Follow these steps to add a new feature to your integration.
1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the integration where you want to add a
            feature.
2. Select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab.
          The Features page opens.
3. Select Add Feature and fill in the fields:

  - Name: Enter a name for the
                  feature to indicate its function.
  - Description: Enter
                  information about what the feature does, the data flow, and any dependencies the
                  feature has.
  - Restrict to these
                    Connectors: If your integration uses more than three connectors, it may
                  be useful to select the connectors to which a feature applies. In most cases, you can
                  disregard this field.
4. Select Save.
5. Follow these steps to change the workspace feature
            status.
          The feature status assigned during integration
            registration impact the feature's functionality. For more information, see [Onboard and Configure Features](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-registration/onboard-and-configure-features).

  1. Open the feature and select the Edit icon.
  2. Feature statuses in the integration builder indicate where a particular feature is
                  in development. Unlike workplace feature statuses, these feature status are UI
                  informational flags only, except for Archived. Choose a feature status:

    - Under Construction:
                        Default. The feature is still being built.
    - Under Construction:
                        Default. The feature is still being built.
    - Active: The feature is
                        actively used in an integration.
    - Deprecated: The
                        feature still exists but it should not be used.
    - Archived: This can
                        only be set when the feature is no longer used by any integrations. It will not
                        sync to a workspace.
  3. Select Save when you are finished.
6. Select the new feature to open it and add resources.You can add resources, including services, flows, and flow templates. These different components move data between the systems identified in your integration.
