# Step Dependencies

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/step-dependencies
> Captured directly from rendered HTML: 2026-08-14

By default, all flow steps are dependent on the success of the
        previous step.

After saving your flow step, the flow builder automatically populates the
            details of this dependency in the Step Dependencies section of the flow step. You can
            re-open the saved flow step to modify the fields in this section to refer to a different
            step or a different step result.

        Note: A flow must include multiple steps for the step dependencies
            field to display, as the first flow step depends on the flow trigger.

## Step Id

Enter the ID of any previous flow step. This field displays the Step ID of
                the previous step by default. This field is required.

            Note: If you rearrange the order of steps in your flow, the
                default Dependent On Step Id value will update to match the ID of the previous step.
                However, if you manually define a step ID in this field, it will not change even if
                you rearrange the order of steps in your flow.

## Step Result Status

Enter the step result status the identified step must return before this
                flow step runs. This field is set to SUCCESSFUL by default.

            Note: If this field is left blank, the step will run regardless of
                the status of the step set in the ID field.

- SUCCESSFUL: Returns when an identified flow step
                          successfully completes.
- FAILED: Returns when an identified flow step fails to
                          complete.
- ACTION_HANDLED_SUCCESS: Returns when an identified Connector
                          Action flow step successfully completes its action.
- ACTION_HANDLED_FAILED: Returns when an identified Connector
                          Action flow step fails to complete its action.
