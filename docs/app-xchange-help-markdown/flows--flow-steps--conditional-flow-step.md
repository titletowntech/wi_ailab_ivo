# Conditional Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/conditional-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use a ![Conditional flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/17129c7d-c321-4dc7-8c44-e67c5260d596.svg) Conditional flow step to determine the correct actions to take based on whether certain criteria are
        met.

For instance, it may be used to determine whether to move on in the flow or
            halt processing, depending on the data values or the outcome of a previous step. A
            common Conditional Step checks that the output of a previous step is not empty.

You can select If or If/Else for the condition type.

- With If conditionals, the flow will only enter that path when the
                      condition is true. If the condition is false, the flow moves to the next
                      step.
- With If/Else conditionals, the flow will enter the If path when the
                      condition is true and the Else path when the condition is false.

Conditional steps are commonly used at the beginning of a flow to verify if the
            flow should run or narrow its goal. However, they can be used at any time.

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Conditional Flow
                    Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56341/conditional-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Type: Select whether the Conditional type is If or
                          If/Else.
- Condition: Set up the condition under which this flow will
                          run. This Condition needs JavaScript evaluation.

## Step Outputs

The output of the Conditional flow step is when the condition is determined
                to be true or false. The following statuses may result after running the conditional
                flow step:

- True: Occurs when the Conditions are met.
- False: Occurs when the Conditions are not met.

## Example Use Case

You would use the Conditional flow step to
                determine which path in the flow to follow if conditions are met. Examples
                include:

- To determine if a vendor is active and exists in the target system
                          before processing a vendor update.
- To determine if a phone number for an employee is complete before
                          sending the information from the source system to the target system.

This flow picture below uses the Conditional step to continue the flow
                path if a relationship exists between Spectrum and ProjectSight. This data is sourced from the Lookup step.
