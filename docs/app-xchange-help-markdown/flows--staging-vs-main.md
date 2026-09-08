# Staging vs Main

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/staging-vs-main
> Captured directly from rendered HTML: 2026-08-14

App Xchange's flow builder has two deployment slots: staging
        and main.

These deployment slots allow you to make and test changes to
            a flow in a way similar to code branching. Main is the primary deployment slot that
                App Xchange looks to when you register
            a flow to a workspace. If the flow does not have a main version, App Xchange defaults to the staging version
            instead.

Check the [Flow History
                menu](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/flow-history) or the indicator in the upper right corner to see which flow version a
            workspace currently uses. Check the [Flow Registrations Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-registrations-tab) to see
            which flow version other workspaces currently use.

## Deployment Actions

You can take several deployment actions when creating or editing a
                flow.

- Save and Deploy to Staging: This saves your work and
                          deploys the flow in the staging slot where you can test the changes. It also
                          sets the current workspace to use staging and updates all staging versions
                          of the flow across all workspaces.

                      Note: You can log comments when
                          deploying to staging to easily track changes.
- Save Draft Version: This saves your work within this
                          workspace but does not deploy the edited flow to staging or main. These
                          changes will not be reflected in other workspaces.
- Revert All Changes: An option in the dropdown menu. This
                          reverts any staged or draft changes and resets the default flow version to
                          main.
- Promote to Main: This merges the staging branch into the
                          existing main branch and sets the default flow version to main across all
                          workspaces. You can only promote a flow to main when it is in staging and
                          all the changes you made to it have been saved. When you do so, the flow
                          builder displays the number of other workspaces that use this flow. You can
                          see more details about these workspaces in the [Flow Registrations Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-registrations-tab).

                      Note: You can log comments when deploying to staging to
                          easier track changes.
