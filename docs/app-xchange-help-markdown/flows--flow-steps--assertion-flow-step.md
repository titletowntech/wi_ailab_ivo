# Assertion Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/assertion-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Assertion flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/365c8742-d631-4b6e-85f2-5a0e39d9c462.svg) Assertion flow step to validate specific conditions when testing or debugging a flow.

If the defined conditions are met, the flow continues; if not, the flow fails.
            You can repeatedly run a flow with Assertions until all Assertions pass, ensuring all
            necessary conditions are met before you promote the flow to main.

For example, you can use an Assertion to validate that certain properties
            output from a Map Step are shaped correctly when you do not want to send the data to a
            target system yet. In this scenario, you can run the flow and validate that the data
            looks correct without sending and deleting the data from the target app.

You should not use this step in main flows. Actions and Stop Flow steps are
            both preferred methods of validating flow step outcomes. Both options provide more
            details about a flow's outcome, making them better for production flows.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

Select Add Item to add an Assertion.

- Label: Enter a descriptive name for the Assertion.
- Expected: Enter the value or expression being tested.
- Actual: Enter the value or condition you want the Actual
                          value to meet.
- Assertion Type: Currently, the dropdown to select the
                          Assertion Type is disabled. Only one validation is available at this time,
                          which is automatically selected:

  - Are Equal: Checks if the actual value equals the
                                    expected value.

## Step Outputs

There are two possible outputs for an Assertion step, depending on whether
                the Assertion conditions are met.

- Pass: The Assertion conditions are met and the flow
                          continues to the next step.
- Fail: The Assertion conditions are not met, and the flow
                          fails.
