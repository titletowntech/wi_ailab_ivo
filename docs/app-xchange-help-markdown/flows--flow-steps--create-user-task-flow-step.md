# Create User Task Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-user-task-flow-step
> Captured directly from rendered HTML: 2026-08-14

The ![Create User Task flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/90457212-cd77-4e51-aefc-8a07f7e69e82.svg) Create User Task flow step creates a task that requires user intervention when something goes wrong.

Tasks can be found in the Tasks tab of your workspace. For more information, see [Tasks](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/tasks). This flow step is commonly used alongside the Action Close
            Out trigger type to generate a task when an action fails.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Title: Enter the title for the user task you want to
                          create.
- Description: Enter a description for the user task you want
                          to create.
- Type: Enter the type of user task you want to create.

                      Note: Remediation is currently the only available task
                          type.
- Task definition initial value: Use this field to set
                          specific initial values that indicate the remediation step has been
                          initiated and identify the faulty step that triggered this remediation.

## Step Outputs

When a Create User Task flow step executes with remediation as the
                type, a new user task is generated.

## Remediate a Failed Action

The most common use for the Create User Task flow step is to provide
                options to remediate a failed action. The best practice is to create a flow that
                triggers when an action fails using an Action Close Out trigger.

To do this, select Add Trigger in the flow builder. Choose the
                    Action Close-Out trigger and enter an appropriate connector and trigger
                in the respective fields. Select Failed under Subscribed Status then select
                    Save. The flow now triggers when the specified action fails.

Next, select Add Steps then give the new step a name and ID. Choose
                the Create User Task type. Enter the step details as described above. Use the
                Task Definition Initial Value field to return dynamic data from the flow trigger.
                For example, you can use this code snippet to expose the input data from the flow
                trigger to the generated task.

```javascript
return flow.trigger.data.Input;
```

This process allows users to more easily remediate an error within the
                flow.
