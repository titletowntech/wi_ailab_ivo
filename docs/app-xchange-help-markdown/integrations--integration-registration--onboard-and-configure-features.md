# Onboard and Configure Features

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-registration/onboard-and-configure-features
> Captured directly from rendered HTML: 2026-08-14

While registering an integration, set the feature status to change the status of resources registered to the workspace. To onboard and configure features, you need to set the feature to a status of onboarding and complete testing before setting it to active for the integration.

Validate the workspace. Make sure of the following:
- The name of the workspace is correct.
- The integration you added to the workspace is the correct integration.
- On-premises systems only: The App Xchange Agent has been properly installed and shows green indicators.

Workspace feature statuses control the behavior of your integration in this specific workspace. They include the following:

- Active: The feature and its resources are registered to the workspace
                 and they are on and functioning.
- Off: The feature and its resources are not registered to the workspace.
- Onboarding: The
                 feature and its resources are registered to the workspace, but they are inactive by
                 default. You can customize which flows are active here, and go to the Jobs page to
                 activate schedules.
- Maintenance: Functionally identical to Onboarding. The feature and
                 its resources are registered to the workspace, but they are inactive by default. You
                 can customize which flows are active here, and go to the Jobs page to activate
                 schedules.

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the integration.
2. Repeat the following steps for each feature you want to onboard and
                 configure.

  1. In the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab, select the feature you want to edit.
  2. Select the pencil icon.

                      The Edit New feature window opens.
  3. In the Status dropdown,
                         select Onboarding.
                      The feature is registered to the workspace but not
                         activated.
  4. If the integration product has any flow
                         templates, you can manage those here as well. Select the checkbox to register a
                         copy of that flow template to your workspace.
  5. If the flows in those features have
                         configurations, select the flow then select Manage
                            Configurations to enter or edit the configuration values.
3. Select Save.
              The integration product automatically syncs with your workspace’s instance
                 of the integration.
