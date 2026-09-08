# Call a Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step to trigger another flow within the current
        flow.

The Call a Flow step leverages flow reuse and can save you time from rebuilding
            existing flows multiple times. For more information, see [Callable Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows).

Guidelines for calling flows:

- For a flow to be callable, it must have a trigger type of On
                          Demand.
- A callable flow may call another callable flow.
- A callable flow can’t call itself (recursion).
- A callable flow can’t call a flow that is calling it (looping). For
                      example, if flow A calls flow B, flow B can’t call flow A.

In the list of flows available to your workspace, callable flows are marked
            with a Callable tag. When you open a flow, the In Use By panel on the
            right of the flow builder page indicates which parent flows call that flow. You can
            select from these flows to view the parent flow.

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as needed for
                your flow.

Step Detail

Depending on the flow you call, additional property fields associated with
                that flow display in this section. The called flow dictates what data is available
                to pass to it. Add data to all required property fields.

- Flow: Choose the flow you want to call. The dropdown list
                          displays all callable flows available to your workspace.

                      Tip: Select View Flow to open the
                          called flow in a new tab.
- Use Existing Input: Enable this option to use the output of
                          a previous flow step as the input for the flow you call. The structure and
                          data types of the existing input must match the input schema expected by the
                          called flow. If disabled, you must use the property fields in the Step
                          Detail to define the input for the called flow.
- Input data: If you enabled Use Existing Input, enter
                          code to reference the existing input you want to use. For example,
                              `flow.step('create-an-object').output[0]`.

                      Note: Incorrectly formatted input can lead to errors in
                          the called flow.

## Step Outputs

The output of the Call a Flow step is that the called flow runs. The
                specific results depend on the flow that is called and what data is returned after
                it runs. When this flow step runs, you will see one of the following step statuses
                after running the Call a Flow step:

- SUCCESSFUL: Occurs when the *called flow* successfully
                          completes, resolving to either a Successful or Failed status.
- FAILED: Occurs when the *called flow* completes with an
                          Exception status.

## Example Use Case

For an example of how to use the Call a Flow step, consider the scenario of using two
                flows to transfer two companies' budget data from Vista to ProjectSight. Before
                sending this data between systems, you need to process each dataset. Instead of
                adding identical steps to process the data in both flows, you can create one
                callable flow to validate the budget data. This streamlines development and allows
                for modular usage.
