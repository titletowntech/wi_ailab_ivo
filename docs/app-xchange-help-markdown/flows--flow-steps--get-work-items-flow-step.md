# Get Work Items Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/get-work-items-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Get Work Items flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/8857e86f-0459-43b5-9b82-2305749744bd.svg) Get Work Items flow step to retrieve work items for processing or resolution.

This flow step should be used after a [Create Work Item step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-work-item-flow-step) and before a
                [Resolve Work Items step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/resolve-work-items-flow-step).

Work items can be found in the Work Tracking tab of your workspace. For more
            information, see [Work Tracking](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/work-tracking).

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Work Request Type: Enter a descriptive name to identify the
                          type of operation being performed. For example, *Processing Test*. This
                          is used later in Work Tracking to group work item collections. You may also
                          choose an existing option from the dropdown, if any exist.
- Work request key: Enter a key that groups items
                          consistently. It is common to use a date/time key, which fetches any work
                          items that are grouped under the target date. For example, *return
                              dayjs().format("MM-DD-YYYY");*.
- Work item type: Choose the work item type you want to
                          retrieve. Currently, Cache Record is the only option.
- Filter by Resolution: Choose which status of work items you
                          want this flow step to return from among these options.

  - Any
  - Unresolved
  - Resolved
  - Successful
  - Failed
  - Canceled
- Connector: Choose the connector whose data object has work
                          items you want to retrieve. This should match the value chosen in the
                          preceding Create Work Item flow step.
- Data Object: Choose the data object whose work items you
                          want to retrieve. This should match the value chosen in the preceding Create
                          Work Item flow step.
- Properties to Select: If needed, you can select Add
                              Item to list properties to select from the given Data Object
                          by entering them in the Property Name field. For example, *id* or
                              *file_id*.
- Optional Limit: Enter the maximum number of items you want
                          to be returned. If there are more items than the number set here, you will
                          not get all the items back. Leave this blank to return all items.

## Step Outputs

When a Get Work Items flow step executes, it returns all work
                items that match the filtering criteria. This output can be used by other steps in
                our flow, like the Resolve Work Items step. For more information about how to
                resolve work items, see [Resolve Work Items Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/resolve-work-items-flow-step).
