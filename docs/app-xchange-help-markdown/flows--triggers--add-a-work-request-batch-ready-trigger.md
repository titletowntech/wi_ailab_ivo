# Add a Work Request Batch Ready Trigger

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-work-request-batch-ready-trigger
> Captured directly from rendered HTML: 2026-08-14

Use a work request batch ready trigger to run a flow when
        a batch of work requests reaches a state where they are ready to be processed.

        You must have at least one existing work request type in your workspace to complete
            this task. For more information, see [Work Tracking](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/work-tracking).

1. In the flow builder, select Add Trigger.
                  The Edit Trigger page opens.
2. In the Trigger type field, choose Work Request Batch Ready.
3. In the Work request type field, choose the appropriate work request type from those available in your workspace.
4. In the Work item type field, choose the work item type to monitor for batch readiness.
5. In the Connector field, choose the connector associated with the work request data.
6. In the Data object field, choose the data object that contains the work request batch information.
7. Select Save.
                  The Edit Trigger page closes.
8. Save the trigger as follows:

  - Select Save and Deploy to
                                Staging.
  - Select the arrow and Save Draft
                            Version.

        The trigger is added to your flow. Next, you
            can continue setting up your flow by adding [Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps).
