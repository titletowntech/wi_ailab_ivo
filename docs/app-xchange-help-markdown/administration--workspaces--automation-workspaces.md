# Automation Workspaces

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/administration/workspaces/automation-workspaces
> Captured directly from rendered HTML: 2026-08-14

Automation workspaces are used to build a custom set of jobs
        and flows to fulfill specific business needs.

Unlike building an integration, an automations are fully customized and are
            not for deployment to other contexts. You, the owner of the workspace, or perhaps a
            third party on your behalf, must set up all connectors, flows, services, and schedules
            manually. Your account must have the Automation Workspaces feature enabled to create an
            automation workspace.

## Create an Automation Workspace

Follow these steps to create an automation
        workspace.

Your account must have the
                ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces feature enabled.
1. Navigate to the account where you want to add a
                      workspace.
2. From the left menu, select ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces.
3. Select Add Workspace.The Add New Workspace window opens.
4. Choose one or more connectors to include in the workspace, then select
                          Next.
                      Note: If you select a connector that
                          requires an App Xchange Agent to be
                          installed, the App Xchange team
                          will contact you for the connection details.
5. For each connector, complete all configuration fields and/or add a connection. For instructions, see
                      the Connecting in App Xchange page
                      for the respective connectors in [App Connectors](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-connectors) or [Universal Connectors](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors).
6. Enter a Workspace Name.As a best practice, follow this naming convention when adding a workspace:
                          Company Name : Connector1 <> Connector2.
7. When finished with the setup, select Continue.
                      Note: Adding a new workspace may take several
                          minutes.
The automation workspace is created.

## Add an Automation Workspace Connector

Follow these steps to add one or more additional connectors to an already existing automation
        workspace.

1. Select Add Connector.
2. Choose one or more connectors you want to
                      add.
                      Note: If you select a connector that
                          requires an App Xchange Agent to be
                          installed, the App Xchange team
                          will contact you for the connection details.
3. Select Save.
The connector is added. You can now configure the
            connector.

## Create a New Connection

Follow these steps to add the connection to the connector
        in your workspace.

Be careful when changing the connection initially assigned
            to a workspace. If the new connection does not work, you must contact the owner of the
            preferred connection to reassign the original connection.
1. Depending on the workspace type, select ![integration workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/476c5b53-43e4-4db2-8d78-2a882a193df2.svg) Integration Workspaces or ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces.The workspace
                      opens.
2. Depending on the workspace type, select the
                      workspace's ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integrations or ![connectors icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/40226ac9-8020-4722-8766-d9586b0879c5.svg) Connectors tab.
3. Under the name of compatible connectors, select
                          Add
                      Connection.
                  The Workspace Connection
                      drawer opens.
4. Choose one of the following options:

  - If the connection has a [base connection](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections/base-connections) associated with it, select
                            it in the Base
                                Connection field.Note: Selecting a
                                base connection is required if one is available.
  - Select Create New to create a
                            new connection.
  - Select Assign Existing to choose
                            a pre-existing connection you own.

                  App Xchange adds the connection definition.
5. If creating a new connection, use the Select connection definition
                      dropdown to select the appropriate connection definition from the authentication
                      options.
6. If creating a new connection, enter the Connection
                      Details.
7. Select Connect.
App Xchange creates the new connection. It is
            now available under the Assign Existing tab. Use this tab to reassign the connection if
            it has been disconnected or if you want to reuse the connection details already
            created.

## Delete an Automation Workspace Connector

Automation workspaces allow you to delete connectors directly
        from the workspace. Follow these steps to delete connectors from an automation
        workspace.

1. Select ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces then select the workspace's ![connectors icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/40226ac9-8020-4722-8766-d9586b0879c5.svg) Connectors page.
2. Select the connector you want to delete.
                  The connector details page opens.
3. Select Delete Connector.
4. Select OK to confirm the
                      deletion.
The connector and all of its configurations are
            deleted. It remains on the platform but is no longer registered to the workspace.Note: If your account owns the connector or
                the connector is publicly available, you can regain access by re-adding it to the
                workspace.
