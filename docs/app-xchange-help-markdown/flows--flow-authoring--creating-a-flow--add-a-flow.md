# Add a Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow/add-a-flow
> Captured directly from rendered HTML: 2026-08-14

To create a flow, you need to define the trigger, the steps
        required to launch actions and move data, the flow configuration, and the data going into
        the flow.

        Consider what you want to accomplish with your flow and what
            kind of data you will be handling. Review the [Best Practices for Flow Design](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/best-practices-for-flow-design). Once you have a good idea of what
            your flow needs to do, then you can start assembling the components.  For more
            information about flow components, see [Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows).
1. Depending on the workspace type, select ![integration workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/476c5b53-43e4-4db2-8d78-2a882a193df2.svg) Integration Workspaces or ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces.The workspace
                      opens.
2. Select the workspace's ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows tab.
3. Select Add Flow.

                      Note: The flow will be owned by the workspace you
                          select.
4. Choose one of the following options for adding a
                      flow:

  - Create New: Enter a name for the flow.

                            Note: Each unique flow name can only be used once per
                                workspace. If an identically-named unmanaged flow already exists in the
                                workspace, you may encounter an unspecified error when trying to promote
                                an integration flow.
  - Add Existing: Search for the name of the existing flow
                                in the search bar and select from the results.
5. Select Add.
6. Optional: You can select
                          Settings to adjust the flow settings. From this Flow
                      Settings window, you can edit the following:

  - Name: Change the flow name.
  - Description: Add a brief description of the
                                    flow.
  - Contains Sensitive Data: This option is on by
                                    default. The flow visualization section of the flow’s run details
                                    will be unavailable to those without the correct permissions to
                                    protect sensitive data, such as an employee’s personal
                                    information.
  - Is Remediation: This option is off by default. If
                                    needed, program the flow to remediate failures by toggling this
                                    option on.
  - Callable from Flow: This option is off by default.
                                    Set the flow type to callable (only if the flow has an On Demand
                                    trigger type) if you want other flows to be able to call this
                                    flow.
  - Private: This option is on by default. If you want
                                    the flow to be public, toggle this option off to set the flow as
                                    public.
  - Is Active: This option is on by default. Toggle this
                                    option off to set the flow as inactive. You may want to do this for
                                    flow testing purposes.

                                Note: The Is Active setting must be toggled on for
                                    a flow to run.
                                Note: Flows with an On Demand trigger that don’t
                                    have schedules set cannot be inactive.
  - Archive: Select this option to remove the flow from
                                    the list on the Flows page. Archiving a flow also sets it to an
                                    inactive status. To see archived flows, on the Flows page, select
                                    the Include Archived checkbox.
7. When finished editing, select
                          Save.
The flow is created.
        Next, you can [Add a Trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow/add-a-trigger) or [Add or Edit Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow/add-or-edit-flow-steps) to continue setting up
            your flow.
