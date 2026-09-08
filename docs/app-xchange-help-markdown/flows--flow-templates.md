# Flow Templates

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates
> Captured directly from rendered HTML: 2026-08-14

You can create a flow template when an integration flow has
        common steps but requires workspace-specific customization.

While this requirement is best addressed using [configuration
                mapping](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations/map-configurations) or a [callable flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/add-a-callable-flow-template-to-an-integration), flow templates offer integration builders an additional
            method for mapping a flow’s field differently for each customer. However, before
            choosing to use a flow template instead of a configuration mapping, it is important to
            understand the limitations that this method presents.

When you add a flow template to an integration, a copy is
                        automatically created in each new workspace to which the integration is
                        deployed. This copy is different from other integration flows, which will
                        display as Managed. If you make changes to the
                        template copy within a specific workspace, those changes will only apply to
                        that workspace. Similarly, if you edit the original flow template in the
                        integration, it will not change any of the copies that were already created
                        and instead only apply to new integration deployments.

Comparatively, using a flow with either configuration mapping or a called flow
            allows integration builders to propagate updates across all workspaces where the flow is
            used.

Related information

- [Add a Callable Flow Template to an Integration](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/add-a-callable-flow-template-to-an-integration)
- [Add Flow Templates to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates#task-dc923f85-6b8e-43ad-a8d9-f0226e5e2c8a--en)

## Add Flow Templates to a Feature

When flows share common steps across different
        deployments, create a template for per-workspace customization.

        Your use
            account must have Integration
                Author permissions to complete this task.
        If you have a need
            for this flow template to be called from another flow, such as if there are fields that
            need custom logic to populate beyond what can be accomplished through configurations,
            use a callable flow template. Callable flow templates can be modified to fit specific
            logic and are managed independently from each other.

Use
                the [![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step) to add the template to your
                flow. Changes to the template will affect only new users of the flow
            template.

Create a Flow Template

When you create a flow template, App Xchange adds a template tag and an
                    icon to the template when it is displayed in a list.

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the appropriate integration.
2. Select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab and open the feature you want to
                      add a flow template to.
3. In the Flow Templates section,
                      select Add Flow
                          Template and choose the type you are creating.

  1. Create: Create a
                                template from a flow that already exists.
  2. Use Existing: Adds a
                                reference to a template that already exists in a different
                                feature.

                      Note: You can add search criteria in the Search Flows or
                              Workspace
                          fields to filter the flows that display.
4. To use an existing flow, select the checkbox for the flow you want to use.
5. Select Save.

  The flow template is added to the integration feature.
Edit a Flow Template

Integration builders can edit flow templates
                    globally within the integration or locally within a customer
                workspace.

1. To edit an existing flow template globally, open
                      the flow template in ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder.
                  Changes made by the flow author will update the flow across all
                      workspaces that use it.
2. To edit an existing flow template for a specific
                      customer user, select ![customer workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2956fba6-a4ef-4061-ae71-8bfd4826f488.svg) Customer Workspaces and open the appropriate workspace. Select the ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows tab and select the flow. Open the flow template from within the workspace to
                      make your changes.
                  Saving these changes creates a copy with the Template Copy tag. It does
                      not modify the original flow template.

        The flow template is added to the integration
            feature. If you created a new flow template, App Xchange adds a Template tag and an icon to the template when it
            is displayed in a list.
        When you are ready
            to deploy the flow template to a workspace, make sure to select its checkbox in the
            feature management page of that workspace to enable it, as shown in the image below:

![App Xchange feature management window](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/94822ec9-7649-403e-999c-f179db60ed09.png)

Related information

- [Flow Templates](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates)
- [Add a Callable Flow Template to an Integration](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/add-a-callable-flow-template-to-an-integration)
