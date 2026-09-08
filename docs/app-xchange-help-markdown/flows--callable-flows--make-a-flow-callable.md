# Make a Flow Callable

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/make-a-flow-callable
> Captured directly from rendered HTML: 2026-08-14

A flow must meet certain criteria before you can make it
        callable by other flows.

        You must have the Flow
            Author account role to complete this task.
1. Follow the steps in [Creating a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow) to create a flow. Ensure it meets these
                      criteria to make it callable:

  - The flow has an On Demand trigger.
  - All flow exit paths end in a ![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step.
  - The flow is Promoted to Main.
  - The flow is not marked Private.
2. Select ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows then select the flow you want to make
                      callable.
                  The flow opens.
3. Select the gear icon.
                  The Flow Settings window opens.
4. Toggle Callable from flow.
5. Select Save.
You can now use the ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step to reference this flow within a parent flow.
