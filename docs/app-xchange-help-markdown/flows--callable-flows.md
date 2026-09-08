# Callable Flows

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows
> Captured directly from rendered HTML: 2026-08-14

A Callable Flow is a flow designed to be referenced, or
        called, by another flow.

Callable flows prevent the need to duplicate steps across multiple
            flows, as multiple flows can reference a single callable flow to repeat common flow
            actions. You can call a flow using the ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step. For more information see [Call a Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step).

Callable flows are run independently of the calling flow, and cannot
            access the same data as the parent flow. The data available to the flow is defined by
            the [trigger's input schema](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-on-demand-trigger), which
            you must set up. The data is then supplied by the Flow that calls this one.
            Additionally, flow configurations are scoped to the flow they are on. This means that
            this flow will not have access to the configuration of the flow that calls it, and
            either needs its own configuration or to have that data passed in via the custom input
            schema you created. For more information, see [Using Configurations in Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/using-configurations-in-flows).

## View Your
                Callable Flow

You can view your callable flow
                in two ways:

- Know the name of your flow and find it in the
                          standard list of flows.
- Open the parent flow and view the flow in the
                              ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step.

Callable flows are shown in the standard list of
                flows, so you will just need to know the name of your callable flow to find it here.
                Additionally, you can get to your callable flow from the parent flow that calls it.
                Open the ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step and choose the View Flow link under the name of your callable
                flow. This will open the callable flow in a new window.

Schema for a Callable Flow

Callable flows can define an input schema which will
                then be shown on the ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step in a parent flow. Remember a callable flow
                will only have the context you define and pass to it. Define this schema by
                selecting the trigger in the callable flow and selecting Custom Schema. The input schema must follow the
                JSON Schema v7.0 format. In the example below, Job and calling_flow_name will be inputs
                available to the step.

## Data Returned from a Stop Step in a Callable Flow

A callable flow has no output unless you define it using
                a Stop step. Include a Stop step for every exit scenario in your callable flow so
                the output to the parent flow is consistent. The Result Status, Result Message, and
                Result Details will all flow back to the parent flow. If a parent flow needs to
                react to the outcome of the called flow, make sure to include necessary information
                in the details.

A Stop step configured as it appears in Figure 1 will
                appear in the parent flow as it does in Figure 2.

            Figure 1. Step Configuration

            Figure 2. Step Output

If a Stop step has the Result Status set to Failure,
                then the `“__Status”` property will be `400`.
