# Resolve Work Items Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/resolve-work-items-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Resolve Work Items flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5c233b91-7aaf-453c-9981-f6b9b097778f.svg) Resolve Work Items flow
                                        step to resolve multiple work items simultaneously and mark them as complete.

This step should follow the [Create Work
                Item](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-work-item-flow-step) and [Get Work Items](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/get-work-items-flow-step)
            flow steps. It is useful to indicate that the deferred work has been processed with a
            certain outcome. Work items can be found in the Work Tracking tab of your workspace. For
            more information, see [Work Tracking](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/work-tracking).

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Work Item Ids: Enter an expression that obtains the work
                          item IDs you want to resolve. This is almost always from the output of the
                          Get Work Items flow step. For example, `return
                              flow.step('get-work-items').output.map((x) =>
                          x.WorkItemId);`.
- Resolution: Choose how to resolve the selected work items
                          from among these values:

  - Successful
  - Failed
  - Canceled

## Step Outputs

When the Resolve Work Items flow step executes, it resolves all
                given work items with the selected status. This status displays on the Work Tracking
                tab.
