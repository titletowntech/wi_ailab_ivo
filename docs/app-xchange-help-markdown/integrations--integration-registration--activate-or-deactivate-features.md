# Activate or Deactivate Features

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-registration/activate-or-deactivate-features
> Captured directly from rendered HTML: 2026-08-14

After populating the data for integration features and running the flows to move the data, you can begin transitioning features to Active.  When the feature has been updated or is no longer needed, change the status to Off.  If you need to pause the feature to troubleshoot other resources, change the feature status to Maintenance.

   Note: Before you turn off a feature, you must deactivate it in customer workspaces.

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the integration.
2. Repeat the following steps for each feature you want to
            onboard and configure.

  1. In the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab, select the feature you want to edit.
  2. Select the pencil icon.

                The Edit New feature window
                  opens.
  3. In the Status dropdown, select Active or Off.
3. Select Save.

  After you save changes, the integration will automatically sync with your workspace.
4. Wait for the integration to finish syncing.  If you are activating the feature, verify that all resources associated with the feature you activated are also active.
  1. Check that the flows are active: Go to the Flows page. Verify that there are no
            Inactive tags marking the flows
           associated with the active feature.

    Feature still in onboarding, flows inactive:

    Feature active, flows active:
  2. Check that feature schedules are active: Go to the
            Jobs page. Verify that the feature
           schedules are listed under Active Feature
            Schedules (not Onboarding).
5. Repeat these steps as needed for all features you want to activate or deactivate in your integration.
At this point, you have completed the necessary setup
      and testing, and your integration is fully registered and ready to move data when its status
      is active. If you need information on onboarding or configuring your features, review [Onboard and Configure Features](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-registration/onboard-and-configure-features).
