# Stop Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/stop-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step to halt a flow.

The Stop Flow step allows you to define the status of the flow and provide an
            output message about the status. Once your flow encounters a Stop Flow step, the flow
            will stop processing. You may want a flow to stop for a variety of reasons:

- You determine that no additional processing is
                      needed for a particular scenario, so you can use the Stop Flow step to end the
                      flow early.
- You determine there is an issue that prevents the
                      flow from continuing a process. Rather than letting the flow continue with bad
                      or missing data, you can use a Stop Flow step to end the flow.

Stop steps function differently in parent versus child flows. You can use the
            Stop Flow step to stop child flow runs while the parent flow continues. A Stop step in a
            child flow will not stop the parent flow. For parent flows (also called initiating
            flows), you can view additional details on the Runs tab.

        Note: A Stop Flow step inside a [For Each in a List step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/for-each-in-a-list-flow-step) will not
            stop processing on the remaining items in the collection. This is because all items in
            the For Each step are processed in parallel.

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Stop Flow Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56342/stop-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details
                about the step configuration as needed for your flow.

Step
                Detail

- Result Status: Choose the status that the flow will display
                          when it processes this step and stops:

  - Success
  - Failure
- Result Message: Enter a message that will display alongside
                          the result details. It should explain why the flow stopped. You can enter an
                          expression or a string in this field.

Result Details

This section is optional. Information you
                add to these fields will be included with the flow result. This information is
                commonly used for Stop steps in parent flows, as flow authors can view these details
                in the Outcomes tab of the Run Details page. If you enter result details for Stop
                steps in child flows, you won’t be able to view the details with the flow result.
                However, details in these fields are in general useful for conveying information to
                the parent flow.

Select Add Item to add details about the
                result. The fields in this section display only after you select the Plus sign. To
                delete result details, select the trash can icon on the right.

- Array Map: If you want to create a nested object, enable
                          this option. It is off by default.
- Property Name: Enter a name for this information.
- Value: Enter details about the property. For example, you
                          could enter additional messaging, or you could pull data such as a Project
                          ID to be able to track which projects are associated with a failed result.
                          Enter an expression, string, integer, true/false, list, or null value
                          input.

## Step Outputs

This step ends the flow. The defined Result Details data becomes available
                to the flow author in the Outcome tab on the run detail page.

The following statuses may result after running the Stop Flow step.

- SUCCESSFUL: Occurs when the Stop Flow step completes and
                          shows a result status of either Success or Failure in the output.
- ERROR: Occurs when there is an invalid input in one of the
                          fields or the step fails to save the result.

## Example Use Cases

The most common use for
                the Stop Flow step is at the end of a flow. You should always include a Stop Flow
                step at the end of a flow.

Another common use
                case scenario is at the exit point of a flow. This is useful because the Stop Flow
                step can help you determine whether or not a flow completed successfully. For
                example, if you want to send budget data from ProjectSight to Vista, you would first look up the Vista
                job. You would then add a Conditional step to check if the Vista job is found. If it is not found, the conditional
                step would close out the export budget data request with a failed status. Then stop
                the flow.

When setting up
                the nested Stop Flow step, you could define the Result Status of Failure and input
                your own Result Message to explain the failure:

To Stop a Child Flow

You can also use a Stop step in a child flow, allowing
                you to stop the child flow without stopping the entire parent flow. A Stop Flow step
                only halts processing for its container flow.

For example, if your flow has a For Each in a List or Call a Flow step, these would
                run child flows. You could add a Stop Flow step to help define why the child flow
                stopped.
