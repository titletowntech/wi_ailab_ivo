# Create Work Item Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-work-item-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Create Work Item flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/dcb8ba1a-fa6a-468e-adfb-7fba88c09d2a.svg) Create Work Item flow step to defer the processing of data. Creating a work item allows you to mark a piece of work
        as unresolved.

Work items can be found in the Work Tracking tab of your workspace. For more
            information, see [Work Tracking](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/work-tracking).

This item can be fetched later to avoid needing to handle all data transfers in
            real-time.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Work Request Type: Enter a descriptive name to identify the
                          type of operation being performed. For example, Processing
                              Test. This is used later in Work Tracking to group work item
                          collections. You may also choose an existing option from the dropdown, if
                          any exist.
- Work request key: Enter a key that groups items
                          consistently. It is common to use a date/time key, which fetches any work
                          items that are grouped under the target date. For example, return
                              dayjs().format("MM-DD-YYYY");.
- Connector: Choose the connector whose data object prompts
                          the creation of work items.
- Data Object: Choose the data object that prompts the
                          creation of work items.
- Cache ID: Enter the cache ID for the work item. A common
                          value is the cache ID of the data object. This value typically comes from
                          the flow trigger object or the output of a Lookup flow step. For example, to
                          retrieve the value from the flow trigger object, enter return flow.trigger.event.eventInfo.CacheId.

## Step Outputs

When the Create Work Item flow step runs, work items are created
                in the Work Tracking tab in your workspace.
