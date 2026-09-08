# For Each in a List Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/for-each-in-a-list-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![For Each in a List flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/410c8c81-be4f-4a60-9ffb-d6197b39d984.svg) For Each in a List flow
                                        step to repeat a set of actions on a collection of items.

In this flow step, you define the collection of data. Then in your flow,
            nested under the For Each step, you add child flow steps that define the actions you
            want to perform on this collection. This is not a loop. It treats your child steps as a
            called flow that will run parallel on all items in your list.

Tip: You can use the helper code
                `flow.loopItem()` in a child step to
            reference a specific item in the collection. This may be helpful for targeting list
            items with specific features.Note: When inside a For Each In a List step, you can
            only reference the input of the for each step, flow configurations, and steps that are
            nested inside the ![For Each in a List flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/410c8c81-be4f-4a60-9ffb-d6197b39d984.svg) For Each in a List flow
                                        step. Because it acts a called flow for its child
            steps, it cannot see any outside steps. The best practice is to pass the data in a part
            of the For Each step input.

On the App Xchange platform, the For Each step processes all items simultaneously, but
            the output of each iteration will be in the same order as the input.

## Step Inputs

A For Each in a List step expects a collection or dataset as its input. In the Edit
                Step menu, you can configure the step as needed for your collection.

Step Detail

- List: Define
                          the collection of data. For example:
                              `flow.step('create-budget-records').output;`. This value
                          identifies data that is coming from a set of budget items created by a
                          previous flow step.
- Wait for all action responses: This option is off by
                          default. Toggle this option if you want each child flow step to run and
                          complete associated actions before proceeding to the next flow step.
- Run sequentially: When enabled, each iteration will
                      completely finish before the next iteration starts. When disabled, iterations
                      run in parallel (default behavior).Note: Enabling this
                          feature will significantly increase the flow step's runtime.

## Step Outputs

When a For Each step runs, the child steps nested under
                the For Each in a List step are executed in parallel against each object in the
                collection. Unlike other steps, the For Each step has no default outputs. You should
                leverage the Stop step (conditional Success or Failure as appropriate) inside the
                For Each step to halt a given iteration and return an output. Note that the Stop
                step will only halt the current iteration and will *not* terminate the entire For Each execution. When Stop steps are used in a
                For Each step, the For Each step’s output will contain an array of that output.

For example, you could have a Stop step with a Result
                Message of `‘return
                    flow.step('your-connector-action').actionResponse;’`, which you could
                use to check for 400 errors with `return
                    flow.step('your-for-each').output.some((x) => x.__Status ==
                400)`.

You can view the flow run status of a For Each in a List
                step from the Run Details page. The flow visualization each flow run as a
                                numbered iteration. Five iterations are displayed by default,
                                prioritizing iterations that produced a code exception. To view more
                                iterations, select Show All. The total amount of exceptions is
                                displayed at the top of the visualization.

You can select an individual
                                iteration to view the segment of code that produced the exception.
                                Typically, a code change will fix all repeated exceptions. However,
                                if you need to view additional iterations for further debugging,
                                select Download
                                        JSON to view the full run details if the flow is
                                not marked Sensitive.

## Example Use Case

In most cases, the For Each step is used to execute some sort of
                action on a dataset. Child Stop steps are commonly used to indicate the success or
                failure of these actions, as they are extremely important for processing the results
                of the For Each step.

For example, consider a
                Filter flow step that sorts out Vista
                records with missing or mismatched job phases. You can add a For Each step to pass
                each Vista record to a child Connector
                Action flow step that adds Vista job
                phase data. You can then add two child Stop Flow steps to indicate if the job phase
                was added successfully or if the action failed.

In this scenario, the For Each in a List might have this setup:

This is how the For Each
                step might look with its substeps:

When run, this produces the following
                output:

```javascript
[
  {
    "__Status": 400,
    "__OutcomeMessage": "This is the failure result message",
    "details": {
      "success": false,
      "message": "JobStatus is not Open"
    }
  },
  {
    "__Status": 400,
    "__OutcomeMessage": "This is the failure result message",
    "details": {
      "success": false,
      "message": "JobStatus is not Open"
    }
  }
]
```

This means, for each job phase you add
                to Vista from ProjectSight, the flow will do the
                following:

1. Add a Vista job phase record if one does not already
                          exist.
2. Stop the flow and send one of the following
                          outcomes.

  - If adding the job phase record
                                    succeeded, send a message saying it was successful.
  - If adding the job phase record failed,
                                    send a message to indicate there was an error.

## Collecting and Processing Errors

Because a For Each step runs multiple parallel child flows, you must take additional
                steps to detect errors.

When preparing your input for the For Each, you can map a metadata property to the
                input list. This allows Stop output messages to provide error messaging, like in the
                example below.

```javascript
const action = flow.step('post-projectsight-prj-budgetsupsertadd');

return {
  success: action.isActionSuccess(),
  callerMetadata: flow.loopItem().callerMetadata,
  errorDetail: !action.isActionSuccess()
    ? action.output.Response.Content.result //confirming the property exists
      ? //this happens from Action results failure
        action.output.Response.Content.result
      : //this happens from AppNetwork schema validation errors
        action.output.Response.Content.error
    : null,
  successDetail: action.isActionSuccess()
    ? action.output.Response.Content.data
    : null,
};
```

You can then insert a Conditional step that checks for failures. See the example
                below.

```javascript
return (
  flow.step('filter-addchangedelete-projectsight-budget-item-fo').output[0]
    .failures.length != 0
);
```
